import * as React from 'react';
import {Credentials, JWTToken} from "../resources/types";
import log from "../utils/logger";

export const loginWithCredentials = async (credentials: Credentials) =>
    fetch(`/api/users/log_in`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error(`ERROR ${response.status}`);
        })
        .then((responseJSON: JWTToken) => {
            log('Success logging in.');
            sessionStorage.setItem('jwtToken', responseJSON.jwttoken);
            sessionStorage.setItem('loggedIn', 'true');
            log(responseJSON.jwttoken);
        })
        .catch((error: Error) => {
            sessionStorage.clear();
            log(`Error when trying to log in: ${error.message}`);
            throw error;
        });