import { create } from "zustand";

export interface GridLine {
  _id: string;
  productType: string;
  front_gridline: string;
  back_gridline: string;
  sleeve_gridline: string;
  width: number;
  height: number;
  top: number;
  left: number;
  gridX: number;
  gridY: number;
  print_configurations: ("front" | "back" | "sleeve")[];
  key: string;
  id: string;
}

interface ProductGridState {
  productGrids: GridLine[];
  setProductGrid: (
    productType: string,
    data: Omit<GridLine, "key" | "productType">
  ) => void;
  clearGrids: () => void;
}

export const useProductGridStore = create<ProductGridState>()((set) => ({
  productGrids: [
    // {
    //   _id: "685bc80c1b8894fc36165bc2",
    //   productType: "unisex_round",
    //   front_gridline:
    //     "https://res.cloudinary.com/dam5ek7qe/image/upload/v1750330732/Group_1000002995_3_l5ksvs.png",
    //   back_gridline:
    //     "https://res.cloudinary.com/dam5ek7qe/image/upload/v1750330732/Group_1000002986_vseyj0.png",
    //   sleeve_gridline:
    //     "https://res.cloudinary.com/dam5ek7qe/image/upload/v1750330732/Group_1000002992_4_iyis15.png",
    //   width: 400,
    //   height: 400,
    //   top: -60,
    //   left: 0,
    //   gridX: 10,
    //   gridY: 16,
    //   print_configurations: ["front", "back", "sleeve"],
    //   key: "unisex_round-grid",
    //   id: "",
    // },
  ],

  setProductGrid: (productType, data) =>
    set((state) => {
      const existingIndex = state.productGrids.findIndex(
        (grid) => grid.productType === productType
      );

      const updatedGrid: GridLine = {
        ...data,
        productType,
        key: `${productType}-grid`,
        gridX: data.gridX || 20,
        gridY: data.gridY || 20,
      };

      if (existingIndex !== -1) {
        const updatedGrids = [...state.productGrids];
        updatedGrids[existingIndex] = updatedGrid;
        return { productGrids: updatedGrids };
      } else {
        return { productGrids: [...state.productGrids, updatedGrid] };
      }
    }),

  clearGrids: () => set({ productGrids: [] }),
}));
