export const IS_DEV = process.env.NODE_ENV === 'development';

export enum SurfaceSizes {
  TileSmall = 200,
  TileLarge = 300,
  ImageSmall = 150,
  ImageLarge = 300
}

export enum Category {
  Flower,
  Bouquet,
  GroundFlower,
  Supplement
}

export enum OrderStatus {
  Any,
  Pending,
  Accepted,
  Declined,
  Delivered
}

export enum OrdersCategory {
  All,
  Pending,
  ToDeliver,
  Resolved,
  Past
}

export enum Roles {
  Client = 'client',
  Employee = 'employee',
  DeliveryMan = 'deliveryman'
}

export const regions = {
  ours: '',
  easterIsland: 'https://flower-shop-se2.azurewebsites.net',
  alpsMountains: 'https://flowershop-dev.store'
};
