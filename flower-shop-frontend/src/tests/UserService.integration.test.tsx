import {fetchUser, loginWithCredentials, signupWithUser} from "../services/user.service";
import {regions} from "../resources/constants";
import {sleepingBackendWrapper} from "./Helpers.integration";

describe("Log in action", () => {
    test('testing login with Our Backend', () => {
        sessionStorage.setItem('backendURL', 'https://pw-flowershop.azurewebsites.net');
        return loginWithCredentials({username: 'karol.nowak@flowershop.com', password: 'admin'})
            .then(() => {
                expect(sessionStorage.getItem('loggedIn')).toBe('true');
                expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
            })
    });

    test.skip('testing login with Team 2', () => {
        sessionStorage.setItem('backendURL', regions.alpsMountains);
        return sleepingBackendWrapper(() =>
            loginWithCredentials({username: 'admin@flowershop.com', password: 'password'})
                .then(() => {
                    expect(sessionStorage.getItem('loggedIn')).toBe('true');
                    expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
                })
        );
    });

// Team 3 endpoints do not yet match Flower Shop documentation
    test.skip('testing login with Team 3', () => {
        sessionStorage.setItem('backendURL', regions.easterIsland);
        return loginWithCredentials({username: 'admin@admin.com', password: 'admin'}).then(() => {
            expect(sessionStorage.getItem('loggedIn')).toBe('true');
            expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
        })
    });
});

describe("User Info fetching", () => {
    test('testing user into fetching with Our Backend', () => {
        const email = 'karol.nowak@flowershop.com';
        sessionStorage.setItem('backendURL', 'https://pw-flowershop.azurewebsites.net');
        return loginWithCredentials({username: email, password: 'admin'})
            .then(() => fetchUser().then((user) => {
                expect(user.email).toBe(email)
                expect(user.name.length).toBeGreaterThanOrEqual(0)
            }))
    });

    test('testing user into fetching with Team 2', () => {
        const email = 'admin@flowershop.com';
        sessionStorage.setItem('backendURL', regions.alpsMountains);
        return sleepingBackendWrapper(() =>
            loginWithCredentials({username: email, password: 'password'})
                .then(() => fetchUser().then((user) => {
                    expect(user.email).toBe(email)
                    expect(user.name.length).toBeGreaterThanOrEqual(0)
                }))
        );
    });

// Team 3 endpoints do not yet match Flower Shop documentation
    test.skip('testing user into fetching with Team 3', () => {
        const email = 'admin@admin.com';
        sessionStorage.setItem('backendURL', regions.easterIsland);
        return loginWithCredentials({username: email, password: 'admin'})
            .then(() => fetchUser().then((user) => {
            expect(user.email).toBe(email)
            expect(user.name.length).toBeGreaterThanOrEqual(0)
        }))
    });
})

describe("Sign up action", () => {
    test('testing signing up with Our Backend', () => {
        const email = `${(Math.random() + 1).toString(36).slice(8)}@pw.edu.pl`;
        sessionStorage.setItem('backendURL', 'https://pw-flowershop.azurewebsites.net');
        return signupWithUser({name: 'Test User', email, password: '1234', newsletter: false})
            .then(() => {
                expect(sessionStorage.getItem('loggedIn')).toBe('true');
                expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
            })
    });
    // Team 2 experiences some kind of 500 internal server error while saving entity changes to db
    test.skip('testing signing up with Team 2', () => {
        const email = `${(Math.random() + 1).toString(36).slice(8)}@pw.edu.pl`;
        sessionStorage.setItem('backendURL', regions.alpsMountains);
        return sleepingBackendWrapper(() =>
            signupWithUser({name: 'Test User', email, password: '1234', newsletter: false})
                .then(() => {
                    expect(sessionStorage.getItem('loggedIn')).toBe('true');
                    expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
                })
        );
    });

// Team 3 endpoints do not yet match Flower Shop documentation
    test.skip('testing signing up with Team 3', () => {
        const email = `${(Math.random() + 1).toString(36).slice(8)}@pw.edu.pl`;
        sessionStorage.setItem('backendURL', regions.easterIsland);
        return signupWithUser({name: 'Test User', email, password: '1234', newsletter: false})
            .then(() => {
                expect(sessionStorage.getItem('loggedIn')).toBe('true');
                expect(sessionStorage.getItem('jwtToken')?.length).toBeGreaterThan(0);
            })
    });
})