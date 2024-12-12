export class Product {
  id: number = 0;
  name: string = '';
  price: number = 0;
  image_url: string = '';
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  products: Product[];
}
