import { Credentials, JWTToken, User, UserData } from '../resources/types';
import log from '../utils/logger';
import { Roles } from '../resources/constants';

export const getBackendURL = () => {
  const backendURL = sessionStorage.getItem('backendURL');
  return backendURL || '';
};

export const isLoggedIn = (): boolean => sessionStorage.getItem('loggedIn') === 'true';
export const isEmployeeOrDeliveryMan = (): boolean =>
  sessionStorage.getItem('role') === Roles.Employee || sessionStorage.getItem('role') === Roles.DeliveryMan;
export const isEmployee = (): boolean => sessionStorage.getItem('role') === Roles.Employee;
export const isClient = (): boolean => sessionStorage.getItem('role') === Roles.Client;
export const isDeliveryMan = (): boolean => sessionStorage.getItem('role') === Roles.DeliveryMan;

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
// TODO: Decide if we should add it to loginWithCredentials, or they'll align with documentation
// interface Team3Token {
//     token: string;
// }
// return fetch(`${getBackendURL()}/api/v1/auth/authenticate`, {
//     method: 'POST',
//     body: JSON.stringify({email: 'admin@admin.com', password: 'admin'}),
//     headers: {
//         'Content-type': 'application/json'
//     }
// })
//     .then((response: Response) => {
//         if (response.ok) return response.json();
//         throw new Error(`ERROR ${response.status}`);
//     }).then((token: Team3Token) => {
//         expect(token.token.length).toBeGreaterThan(0);
//     })

export const signupWithUser = async (newUser: User) =>
  fetch(`${getBackendURL()}/api/users`, {
    method: 'POST',
    body: JSON.stringify({ ...newUser, role: 'client' }),
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
  fetch(`${getBackendURL()}/api/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
    }
  }).then((response) => {
    if (response.ok) return response.json() as unknown as UserData;
    throw new Error(`ERROR ${response.status}`);
  });
