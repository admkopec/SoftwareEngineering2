import { OrderProduct } from '../resources/types';

export const fetchProductsFiltered = async (
  searchParam: string | undefined,
  categoryParam: string | undefined,
  minPrice: number | undefined,
  maxPrice: number | undefined,
  pageParam: number | undefined,
  maxPerPageParam: number | undefined
) => {
  const productsSearchParams: URLSearchParams = new URLSearchParams();

  if (searchParam) productsSearchParams.append('search', `${searchParam}`);
  if (categoryParam) productsSearchParams.append('category', `${categoryParam}`);
  if (minPrice) productsSearchParams.append('minPrice', `${minPrice}`);
  if (maxPrice) productsSearchParams.append('maxPrice', `${maxPrice}`);
  if (pageParam && pageParam > 0) productsSearchParams.append('page', `${pageParam}`);
  if (maxPerPageParam && maxPerPageParam > 0 && maxPerPageParam <= 50)
    productsSearchParams.append('maxPerPage', `${maxPerPageParam}`);

  return fetch(`/api/products/?${productsSearchParams.toString()}`).then((response) => {
    if (response.ok) return response.json();
    throw new Error(`ERROR ${response.status}`);
  });
};

export const addProductToBasket = async (orderProduct: OrderProduct) =>
  fetch(`/api/basket`, {
    method: 'POST',
    body: JSON.stringify(orderProduct),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
    }
  }).then((response) => {
    if (response.ok) return;
    throw new Error(`ERROR ${response.status}`);
  });

export const fetchBasket = async () =>
  fetch(`/api/basket`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
    }
  }).then((response) => {
    if (response.ok) return response.json();
    throw new Error(`ERROR ${response.status}`);
  });
