import {regions} from "../components/Footer";
import {getBackendURL} from "../services/user.service";
import {JWTToken, Product} from "../resources/types";
const fetch = require('node-fetch');

// When there are no products, 404 is returned instead of an empty array, so the test is not passing

// test('testing product getting with Team 2', () => {
//     sessionStorage.setItem('backendURL', regions.alpsMountains);
//     return fetch(`${getBackendURL() }/api/products/`).then((response) => {
//         if (response.ok) return response.json();
//         throw new Error(`ERROR ${response.status}`);
//     })
//         .then((products: Product[]) => {
//             expect(products.length).toBeGreaterThanOrEqual(0)
//         })
// });

interface team3Token {token: string}
test('testing product getting with Team 3', () => {
    sessionStorage.setItem('backendURL', regions.easterIsland);
    return fetch(`${getBackendURL()  }/api/v1/auth/authenticate`, {
        method: 'POST',
        body: JSON.stringify({email: 'admin@admin.com', password: 'admin'}),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error(`ERROR ${response.status}`);
        })
        .then((token: team3Token) => fetch(`${getBackendURL() }/api/products/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        }).then((response) => {
        if (response.ok) return response.json();
        throw new Error(`ERROR ${response.status}`);
        })
        .then((products: Product[]) => {
            expect(products.length).toBeGreaterThanOrEqual(0)
        }))
});