import { create } from 'zustand';
import { Product, productCatalogProducts, dashboardProducts } from './products';

interface FilterState {
  material: string[];
  color: string[];
  size: string[];
}

interface ProductCatalogStore {
  products: Product[];
  filters: FilterState;
  expandedItems: string[];
  setProducts: (products: Product[]) => void;
  loadCatalogProducts: () => void;
  loadDashboardProducts: () => void;
  toggleExpanded: (item: string) => void;
  updateFilter: (category: keyof FilterState, value: string) => void;
  clearFilters: () => void;
}

export const useProductCatalogStore = create<ProductCatalogStore>((set, get) => ({
  products: [],
  filters: {
    material: [],
    color: [],
    size: []
  },
  expandedItems: ['material', 'color', 'size'],

  // Generic setter
  setProducts: (products) => set({ products }),

  // Load local catalog data
  loadCatalogProducts: () => {
    set({ products: productCatalogProducts });
  },

  // Load local dashboard data
  loadDashboardProducts: () => {
    set({ products: dashboardProducts });
  },

  toggleExpanded: (item) => {
    const current = get().expandedItems;
    set({
      expandedItems: current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
    });
  },

  updateFilter: (category, value) => {
    const current = get().filters[category];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    set({
      filters: {
        ...get().filters,
        [category]: updated
      }
    });
  },

  clearFilters: () => set({
    filters: {
      material: [],
      color: [],
      size: []
    }
  })
}));
