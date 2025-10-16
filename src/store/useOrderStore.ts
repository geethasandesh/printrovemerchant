import { create } from 'zustand';
interface Product {
  id: string;
  qty: number;
  price: number;
  sku: string;
}
interface ShippingAddress {
  fullName: string;
  storeName: string;
  address1: string;
  address2: string;
  landmark: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}
interface Merchant {
  id: string;
  name: string;
}
interface OrderState {
  products: Product[];
  shippingAddress: ShippingAddress | null;
  merchant: Merchant | null;
  setProducts: (products: Product[]) => void;
  updateProductQty: (id: string, qty: number) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setMerchant: (merchant: Merchant) => void;
  resetOrder: () => void;
}
export const useOrderStore = create<OrderState>((set) => ({
  products: [],
  shippingAddress: null,
  merchant: null,
  setProducts: (products) => set({ products }),
  updateProductQty: (id, qty) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, qty } : p
      ),
    })),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setMerchant: (merchant) => set({ merchant }),
  resetOrder: () =>
    set({
      products: [],
      shippingAddress: null,
      merchant: null,
    }),
}));
