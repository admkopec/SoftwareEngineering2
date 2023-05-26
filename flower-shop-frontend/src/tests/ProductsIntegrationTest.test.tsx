import {regions} from "../components/Footer";
import {getBackendURL} from "../services/user.service";
import {Product} from "../resources/types";
import {fetchProductsFiltered} from "../services/product.service";

test('testing product getting with Our Backend', () => {
    sessionStorage.setItem('backendURL', 'https://pw-flowershop.azurewebsites.net');
    // @ts-ignore Arguments
    return fetchProductsFiltered()
        .then((products: Product[]) => {
            expect(products.length).toBeGreaterThanOrEqual(0)
        })
});

// Team 2 is sometimes sleeping so accept the test if we get 503
// When there are no products, 404 is returned instead of an empty array, so this has to be handled in catch
test('testing product getting with Team 2', () => {
    sessionStorage.setItem('backendURL', regions.alpsMountains);
    /* eslint-disable jest/no-conditional-expect */
    // @ts-ignore Arguments
    return fetchProductsFiltered()
        .then((products: Product[]) => {
            expect(products.length).toBeGreaterThanOrEqual(0)
        }).catch((error: Error) => {
            expect(error.message).toMatch(/ERROR (503)|(404)/);
        })
    /* eslint-enable jest/no-conditional-expect */
});

interface Team3Token {
    token: string;
}

test('testing product getting with Team 3', () => {
    sessionStorage.setItem('backendURL', regions.easterIsland);
    return fetch(`${getBackendURL()}/api/v1/auth/authenticate`, {
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
        .then((token: Team3Token) => {
            sessionStorage.setItem('jwtToken', token.token);
            // @ts-ignore Arguments
            return fetchProductsFiltered().then((products: Product[]) => {
                    expect(products.length).toBeGreaterThanOrEqual(0)
                })
        })
});