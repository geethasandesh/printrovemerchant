import { create } from "zustand";
interface Thumbnail {
  key: string;
  url: string;
  _id: string;
}
interface PrintLocation {
  location: string;
  basePrice: string;
  fontRate: string;
  boundingBox: {
    width: string;
    height: string;
    top: string;
    left: string;
  };
  gridlines: any[];
}
interface PrintConfiguration {
  name: string;
  locations: PrintLocation[];
}
interface InventoryLocation {
  name: string;
  unavailable: number;
  committed: number;
  available: number;
  onHand: number;
}
interface Inventory {
  sku: string;
  zohoItemId?: string;
  location: InventoryLocation;
}
interface Shipping {
  productWeight: string;
  shippingWeight: string;
}
interface Variant {
  combination: string;
  values: { name: string; value: string }[];
  thumbnails: Thumbnail[];
  pricing: {
    price: string;
    compareAtPrice: string;
    costPerItem: string;
  };
  printConfigurations: PrintConfiguration[];
  inventory: Inventory;
  shipping: Shipping;
  variantNumber?: string;
  isZohoSynced?: boolean;
  zohoItemId?: string;
  zohoSyncedAt?: string;
}
interface VariantGroup {
  _id: string;
  name: string;
  values: string[];
}
interface Product {
  _id: string;
  productNumber: string;
  title: string;
  description: string;
  status: string;
  thumbnails: Thumbnail[];
  mockImages: Thumbnail[];
  collections: string[];
  printTypes: string[];
  variants: VariantGroup[];
  avgLeadTime: string;
  avgDailyUsage: string;
  additionalInfo: string;
  variantConfigurations: Record<string, Variant>;
  isDeleted: boolean;
}
interface ProductCatalogState {
  products: Product[];
  selectedProduct: Product | null;
  setProducts: (products: Product[]) => void;
  selectProduct: (id: string) => void;
  updateVariant: (
    productId: string,
    variantKey: string,
    updatedVariant: Partial<Variant>
  ) => void;
}
export const useProductCatalogStore = create<ProductCatalogState>((set, get) => ({
  products: [],
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  selectProduct: (id) => {
    const product = get().products.find((p) => p._id === id) || null;
    set({ selectedProduct: product });
  },
  updateVariant: (productId, variantKey, updatedVariant) => {
    const updatedProducts = get().products.map((product) => {
      if (product._id !== productId) return product;

      const currentVariant = product.variantConfigurations[variantKey];
      if (!currentVariant) return product;

      const updatedConfig = {
        ...product.variantConfigurations,
        [variantKey]: {
          ...currentVariant,
          ...updatedVariant,
        },
      };

      return {
        ...product,
        variantConfigurations: updatedConfig,
      };
    });

    set({ products: updatedProducts });
  },
}));
