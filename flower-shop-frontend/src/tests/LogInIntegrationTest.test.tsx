import {getBackendURL, loginWithCredentials} from "../services/user.service";
import {regions} from "../resources/constants";
import {sleepingBackendWrapper} from "./Helpers.integration";

test('testing login with Our Backend', () => {
    sessionStorage.setItem('backendURL', 'https://pw-flowershop.azurewebsites.net');
    return loginWithCredentials({username: 'karol.nowak@flowershop.com', password: 'admin'})
        .then(() => {
            expect(sessionStorage.getItem('loggedIn')).toBe('true');
            expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
        })
});

// Team 2 is sometimes sleeping so accept the test if we get 503
test('testing login with Team 2', () => {
    sessionStorage.setItem('backendURL', regions.alpsMountains);
    return sleepingBackendWrapper(() =>
        loginWithCredentials({username: 'admin@flowershop.com ', password: 'password'})
            .then(() => {
                expect(sessionStorage.getItem('loggedIn')).toBe('true');
                expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
            })
    );
});

interface Team3Token {
    token: string;
}
// Team 3 endpoints do not match Flower Shop documentation
// TODO: Decide if we should add it to loginWithCredentials, or they'll align with documentation
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
        }).then((token: Team3Token) => {
            expect(token.token.length).toBeGreaterThan(0);
        })
});
