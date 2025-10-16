import { useFetch } from "../hooks/useFetch";
import { Product } from "../types/product";
export const transformInventoryToProducts = (apiResponse: any) => {
  if (!apiResponse?.data) return [];  
  return apiResponse.data.map((item: any): Product => ({
    id: Number(item._id || item.item_id),
    _id: String(item._id || item.item_id),
    name: item.name,
    title: item.name,
    description: item.description,
    price: Number(item.pricebook_rate || item.rate || item.sales_rate || 0),
    currency: item.rate_formatted?.split('.')[0] || 'Rs.',
    sizes: [item.sku?.split(' ')[1] || 'M'], // Extract size from SKU
    category: item.category || item.item_type_formatted,
    subCategory: item.subCategory || '',
    discount: 0,
    colorImageMap: {}, // Add color images if available
    material: item.material || '',
    inStock: Number(item.initial_stock || 0) > 0,
    restockDate: item.restock_date || '',
  }));
};
export const useProducts = () => {
  const { data} = useFetch("/api/inventory/items", 0);
  const products = transformInventoryToProducts(data);
  return { products };
};