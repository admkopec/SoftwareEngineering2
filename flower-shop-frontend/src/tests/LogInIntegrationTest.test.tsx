import {getBackendURL} from "../services/user.service";
import {regions} from "../components/Footer";
import {JWTToken} from "../resources/types";

const fetch = require('node-fetch');

test('testing login with Team 2', () => {
    sessionStorage.setItem('backendURL', regions.alpsMountains);
    return fetch(`${getBackendURL()  }/api/users/log_in`, {
        method: 'POST',
        body: JSON.stringify({username: 'admin@flowershop.com ', password: 'password'}),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response: Response) => {
            if (response.ok) return response.json();
            expect(response.status).toBe(503);
            throw new Error(`ERROR ${response.status}`);
        })
        .then((token: JWTToken) => {
            expect(token.jwttoken.length).toBeGreaterThan(0)
        }).catch((error) => {
            expect(error.message).toBe('ERROR 503');
        })
});

// Team 3 endpoints do not match Flower Shop documentation
test('testing login with Team 3', () => {
    sessionStorage.setItem('backendURL', regions.easterIsland);
    return fetch(`${getBackendURL()  }/api/v1/auth/authenticate`, {
        method: 'POST',
        body: JSON.stringify({email: 'admin@admin.com', password: 'admin'}),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response: Response) => {
            if (response.ok) return response.json();
            throw new Error(`ERROR ${response.status}`);
        })
});
