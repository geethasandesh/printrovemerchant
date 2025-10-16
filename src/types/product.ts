export interface Product {
    id: number;
    name: string;
    title: string;
    _id: string;
    colorImageMap: { [key: string]: { color: string; path: string } };
    sizes: string[];
    currency: string;
    price: number;
    description: string;
    material: string;
    category: string;
    subCategory: string;
    discount: number;
    inStock?: boolean;
    restockDate?: string;
    variantConfigurations?: {
        [key: string]: {
            pricing?: {
                price?: string;
                compareAtPrice?: string;
            }
        }
    };
}
