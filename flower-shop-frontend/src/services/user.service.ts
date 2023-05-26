import {Credentials, JWTToken, User, UserData} from '../resources/types';
import log from '../utils/logger';
import {Roles} from "../resources/constants";

export const getBackendURL= () => {
    const backendURL = sessionStorage.getItem('backendURL')
    return backendURL || "";
}

export const isLoggedIn = () => sessionStorage.getItem('loggedIn') === 'true'
export const isEmployee = () => sessionStorage.getItem('role') === Roles.Employee.toString().toLowerCase()

export const loginWithCredentials = async (credentials: Credentials) =>
  fetch(`${getBackendURL()}/api/users/log_in`, {
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
      // sessionStorage.clear();
      log(`Error when trying to log in: ${error.message}`);
      throw error;
    });

export const signupWithUser = async (newUser: User) =>
  fetch(`${getBackendURL()  }/api/users`, {
    method: 'POST',
    body: JSON.stringify(newUser),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(`ERROR ${response.status}`);
    })
    .then((responseJSON: UserData) => {
      log('Success signing up.');
      sessionStorage.setItem('role', responseJSON.role);
      const credentials: Credentials = {
        username: newUser.email,
        password: newUser.password
      };
      return loginWithCredentials(credentials);
    })
    .catch((error: Error) => {
      log(`Error when trying to sign up: ${error.message}`);
      throw error;
    });

export const fetchUser = async () =>
  fetch(`${getBackendURL()  }/api/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
    }
  }).then((response) => {
    if (response.ok) return response.json() as unknown as UserData;
    throw new Error(`ERROR ${response.status}`);
  });
