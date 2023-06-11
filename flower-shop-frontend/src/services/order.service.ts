import { OrderCreation } from '../resources/types';
import { OrderStatus } from '../resources/constants';
import { getBackendURL } from './user.service';

export const placeOrder = async (newOrder: OrderCreation) =>
  fetch(`${getBackendURL()}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(newOrder),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`,
      'Content-type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error(`ERROR ${response.status}`);
  });

export const fetchClientOrders = async (
  statusesParam?: string | undefined,
  pageParam?: number | undefined,
  maxPerPageParam?: number | undefined
) => {
  const ordersSearchParams: URLSearchParams = new URLSearchParams();

  if (statusesParam) ordersSearchParams.append('statuses', `${statusesParam}`);
  if (pageParam && pageParam > 0) ordersSearchParams.append('page', `${pageParam}`);
  if (maxPerPageParam && maxPerPageParam > 0 && maxPerPageParam <= 50)
    ordersSearchParams.append('maxPerPage', `${maxPerPageParam}`);

  return fetch(`${getBackendURL()}/api/orders/?${ordersSearchParams.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
    }
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error(`ERROR ${response.status}`);
  });
};

export const updateOrderStatus = async (newStatus: OrderStatus, orderID: string) =>
  fetch(`${getBackendURL()}/api/orders/${orderID}/change_status`, {
    method: 'POST',
    body: JSON.stringify({
      orderStatus: OrderStatus[newStatus].toLowerCase()
    }),
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`,
      'Content-type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) return;
    throw new Error(`ERROR ${response.status}`);
  });

export const fetchOrderItems = async (orderID: string) =>
  fetch(`${getBackendURL()}/api/orders/${orderID}/items`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`,
      'Content-type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error(`ERROR ${response.status}`);
  });
