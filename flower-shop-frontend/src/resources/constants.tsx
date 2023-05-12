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

export enum Roles {
  Client,
  Employee,
  DeliveryMan
}
