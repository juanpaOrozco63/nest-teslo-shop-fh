
export interface IResponseProduct {
    count : number
    products: IProduct[];


}
export interface IProduct {

    id: string;

    title: string;

    price: number;

    description: string;

    slug: string;

    stock: number;

    sizes: string[]

    gender: string;
}
