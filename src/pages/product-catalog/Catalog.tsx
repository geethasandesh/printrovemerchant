import { useProductCatalogStore } from '../../store/useProductCatalogStore';
import { ProductRecommendation } from '../../components/ProductRecommendation';
import { useMemo } from 'react';

export function Catalog() {
  const products = useProductCatalogStore((state) => state.products);
  const filters = useProductCatalogStore((state) => state.filters);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      Object.entries(filters).every(([category, values]) => {
        if (values.length === 0) return true;

        switch (category as keyof typeof filters) {
          case 'material':
            return values.includes(product.material);
          case 'color':
            return values.some((color: string) =>
              Object.keys(product.colorImageMap).includes(color)
            );
          case 'size':
            return values.some((size: string) =>
              product.sizes.includes(size)
            );
          default:
            return true;
        }
      })
    );
  }, [products, filters]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-12">
        No products match the selected filters.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F5F5F5] max-w-[70vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductRecommendation
            key={(product as any)._id || String(product.id)}
            id={(product as any)._id || String(product.id)}
            _id={product._id}
            title={product.name}
            price={product.price}
            discount={product.discount}
            colorImageMap={product.colorImageMap}
            sizes={product.sizes}
            inStock={product.inStock}
            restockDate={product.restockDate}
          />
        ))}
      </div>
    </div>
  );
}
