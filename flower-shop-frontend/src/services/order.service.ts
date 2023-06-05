import {OrderCreation} from "../resources/types";
import {getBackendURL} from "./user.service";

export const placeOrder = async (newOrder: OrderCreation) =>
    fetch(`${getBackendURL()}/api/orders`, {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`,
            'Content-type': 'application/json'
        }
    });