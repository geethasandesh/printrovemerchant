export interface Product {
  id: number;
  name: string;
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
}

export const productCatalogProducts: Product[] = [
  {
    id: 1,
    name: "Black Hoodie",
    colorImageMap: {
      red: { color: "#EF4D2F", path: "/product-img-red.png" },
      white: { color: "#FFFFFF", path: "/product-img-white.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
    },
    sizes: ["S", "M", "L", "XL"],
    currency: "$",
    price: 29.99,
    description: "A comfortable and stylish hoodie in black.",
    material: "Cotton",
    category: "mens-clothing",
    subCategory: "hoodie",
    discount: 10,
    inStock: false,
    restockDate: "2025-05-01",
  },
  {
    id: 2,
    name: "Red T-Shirt",
    colorImageMap: {
      yellow: { color: "#FFD700", path: "/product-img-yellow.png" },
      pink: { color: "#FFC0CB", path: "/thumbnail-pink-tshirt.png" },
      maroon: { color: "#800000", path: "/thumbnail-maroon-tshirt.png" },
    },
    sizes: ["M", "L", "XL"],
    currency: "$",
    price: 19.99,
    description: "Classic red t-shirt.",
    material: "Cotton",
    category: "mens-clothing",
    subCategory: "t-shirt",
    discount: 5,
  },
  {
    id: 3,
    name: "Silk Blouse",
    colorImageMap: {
      white: { color: "#FFFFFF", path: "/product-img-white.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
      pink: { color: "#FFC0CB", path: "/thumbnail-pink-tshirt.png" },
    },
    sizes: ["S", "M"],
    currency: "$",
    price: 49.99,
    description: "Elegant silk blouse.",
    material: "Silk",
    category: "womens-clothing",
    subCategory: "blouse",
    discount: 15,
  },
];
export const dashboardProducts: Product[] = [
  {
    id: 4,
    name: "Black Icons Hoodie Unisex",
    colorImageMap: {
      white: { color: "#FFFFFF", path: "/product-img-white.png" },
      yellow: { color: "#FFD700", path: "/product-img-yellow.png" },
      red: { color: "#EF4D2F", path: "/product-img-red.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
    },
    currency: "$",
    sizes: ["S", "M", "L", "XL", "2XL"],
    price: 20,
    description: "Stylish unisex hoodie with iconic design.",
    material: "Cotton",
    category: "unisex-clothing",
    subCategory: "hoodie",
    discount: 10,
  },
  {
    id: 5,
    name: "Classic White T-Shirt",
    colorImageMap: {
      white: { color: "#FFFFFF", path: "/product-img-white.png" },
      red: { color: "#EF4D2F", path: "/product-img-red.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    currency: "$",
    price: 20,
    description: "Classic and versatile white t-shirt.",
    material: "Cotton",
    category: "unisex-clothing",
    subCategory: "t-shirt",
    discount: 0,
  },
  {
    id: 6,
    name: "Summer Collection Tee",
    colorImageMap: {
      white: { color: "#FFFFFF", path: "/product-img-white.png" },
      yellow: { color: "#FFD700", path: "/product-img-yellow.png" },
      red: { color: "#EF4D2F", path: "/product-img-red.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
    },
    currency: "$",
    sizes: ["S", "M", "L", "XL", "2XL"],
    price: 20,
    description: "Trendy summer collection t-shirt.",
    material: "Cotton Blend",
    category: "unisex-clothing",
    subCategory: "t-shirt",
    discount: 0,
  },
  {
    id: 7,
    name: "Everyday Fit Tee",
    colorImageMap: {
      grey: { color: "#FFFFFF", path: "/product-img-white.png" },
      black: { color: "#FFD700", path: "/product-img-yellow.png" },
      red: { color: "#EF4D2F", path: "/product-img-red.png" },
      blue: { color: "#A4E8F2", path: "/product-img-blue.png" },
    },
    currency: "$",
    sizes: ["S", "M", "L", "XL"],
    price: 22.99,
    description: "Comfortable daily wear t-shirt for all seasons.",
    material: "Cotton",
    category: "mens-clothing",
    subCategory: "t-shirt",
    discount: 8,
  },
];
