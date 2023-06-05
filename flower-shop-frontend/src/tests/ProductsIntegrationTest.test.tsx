import {regions} from "../resources/constants";
import {Product} from "../resources/types";
import {loginWithCredentials} from "../services/user.service";
import {fetchProductsFiltered} from "../services/product.service";
import {sleepingBackendWrapper} from "./Helpers.integration";

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
    return sleepingBackendWrapper(() =>
        // @ts-ignore Arguments
        fetchProductsFiltered()
            .then((products: Product[]) => {
                expect(products.length).toBeGreaterThanOrEqual(0)
            }).catch((error: Error) => {
            expect(error.message).toBe('ERROR 404');
        })
    );
    /* eslint-enable jest/no-conditional-expect */
});

test.skip('testing product getting with Team 3', () => {
    sessionStorage.setItem('backendURL', regions.easterIsland);
    return loginWithCredentials({username: 'admin@admin.com', password: 'admin'}).then(() =>
        // @ts-ignore Arguments
        fetchProductsFiltered().then((products: Product[]) => {
            expect(products.length).toBeGreaterThanOrEqual(0)
        })
    )
});