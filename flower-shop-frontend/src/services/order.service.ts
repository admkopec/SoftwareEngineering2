import { getBackendURL } from './user.service';
import { OrderStatus } from '../resources/constants';

export const fetchClientOrders = async (
  statusParam?: OrderStatus,
  dateDescParam?: boolean,
  pageParam?: number | undefined,
  maxPerPageParam?: number | undefined
) => {
  const ordersSearchParams: URLSearchParams = new URLSearchParams();

  if (statusParam) ordersSearchParams.append('status', `${statusParam.toString()}`);
  if (dateDescParam) ordersSearchParams.append('date', `${dateDescParam.toString()}`);
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
