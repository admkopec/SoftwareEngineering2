package pw.se2.flowershopbackend.security.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigInteger;
import java.security.*;
import java.security.interfaces.ECPrivateKey;
import java.security.spec.*;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class JwtTokenService implements Serializable {
    @Serial
    private static final long serialVersionUID = -2550185165626007488L;

    private final PrivateKey signingKey;
    private final PublicKey verifyingKey;
    private final long expirationMs;

    public JwtTokenService(String signingKey, long expirationMs) throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Loading P256 Elliptic Curve keys from private key's PEM representation
        KeyFactory kf = KeyFactory.getInstance("EC");
        PrivateKey key = kf.generatePrivate(new PKCS8EncodedKeySpec(Base64.getDecoder().decode(signingKey)));
        ECPrivateKey privateKey = (ECPrivateKey)key;
        ECParameterSpec params = privateKey.getParams();
        // Conversion of private key to public key
        ECPoint W = scalmultNew(params, params.getGenerator(), privateKey.getS());
        PublicKey publicKey = kf.generatePublic(new ECPublicKeySpec(W, privateKey.getParams()));

        this.signingKey = key;
        this.verifyingKey = publicKey;
        this.expirationMs = expirationMs;
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(verifyingKey).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    //while creating the token -
    // 1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    // 2. Sign the JWT using the HS512 algorithm and secret key.
    // 3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.ES256, signingKey)
                //.signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // MARK: - Helpers

    // scalar operations for native java
    // see https://stackoverflow.com/a/42797410/8166854
    // written by author: SkateScout
    private static ECPoint doublePoint(final BigInteger p, final BigInteger a, final ECPoint R) {
        if (R.equals(ECPoint.POINT_INFINITY)) return R;
        BigInteger slope = (R.getAffineX().pow(2)).multiply(BigInteger.valueOf(3));
        slope = slope.add(a);
        slope = slope.multiply((R.getAffineY().multiply(BigInteger.TWO)).modInverse(p));
        final BigInteger Xout = slope.pow(2).subtract(R.getAffineX().multiply(BigInteger.TWO)).mod(p);
        final BigInteger Yout = (R.getAffineY().negate()).add(slope.multiply(R.getAffineX().subtract(Xout))).mod(p);
        return new ECPoint(Xout, Yout);
    }

    private static ECPoint addPoint(final BigInteger p, final BigInteger a, final ECPoint r, final ECPoint g) {
        if (r.equals(ECPoint.POINT_INFINITY)) return g;
        if (g.equals(ECPoint.POINT_INFINITY)) return r;
        if (r == g || r.equals(g)) return doublePoint(p, a, r);
        final BigInteger gX = g.getAffineX();
        final BigInteger sY = g.getAffineY();
        final BigInteger rX = r.getAffineX();
        final BigInteger rY = r.getAffineY();
        final BigInteger slope = (rY.subtract(sY)).multiply(rX.subtract(gX).modInverse(p)).mod(p);
        final BigInteger Xout = (slope.modPow(BigInteger.TWO, p).subtract(rX)).subtract(gX).mod(p);
        BigInteger Yout = sY.negate().mod(p);
        Yout = Yout.add(slope.multiply(gX.subtract(Xout))).mod(p);
        return new ECPoint(Xout, Yout);
    }
    private static ECPoint scalmultNew(final ECParameterSpec params, final ECPoint g, final BigInteger kin) {
        EllipticCurve curve = params.getCurve();
        final ECField field = curve.getField();
        if (!(field instanceof ECFieldFp)) throw new UnsupportedOperationException(field.getClass().getCanonicalName());
        final BigInteger p = ((ECFieldFp) field).getP();
        final BigInteger a = curve.getA();
        ECPoint R = ECPoint.POINT_INFINITY;
        // value only valid for curve secp256k1, code taken from https://www.secg.org/sec2-v2.pdf,
        // see "Finally the order n of G and the cofactor are: n = "FF.."
        BigInteger SECP256K1_Q = params.getOrder();
        //BigInteger SECP256K1_Q = new BigInteger("00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",16);
        BigInteger k = kin.mod(SECP256K1_Q); // uses this !
        // BigInteger k = kin.mod(p); // do not use this ! wrong as per comment from President James Moveon Polk
        final int length = k.bitLength();
        final byte[] binarray = new byte[length];
        for (int i = 0; i <= length - 1; i++) {
            binarray[i] = k.mod(BigInteger.TWO).byteValue();
            k = k.shiftRight(1);
        }
        for (int i = length - 1; i >= 0; i--) {
            R = doublePoint(p, a, R);
            if (binarray[i] == 1) R = addPoint(p, a, R, g);
        }
        return R;
    }
}
