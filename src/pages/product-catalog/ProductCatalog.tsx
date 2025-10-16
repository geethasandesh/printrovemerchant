import { useEffect, useMemo } from 'react';
import { Navbar } from "../../layout/Navbar";
import { Checkbox } from "@shopify/polaris";
import { ChevronDownIcon } from '@shopify/polaris-icons';
import { Catalog } from './Catalog';
import { productCatalogProducts } from '../../store/products';
import { useProductCatalogStore } from '../../store/useProductCatalogStore';
import { useFetch } from '../../hooks/useFetch';
import { transformMongoProductsToProducts } from '../../utilityComponents/transformProductData';

export function ProductCatalog({ navbarHidden = false }: { navbarHidden?: boolean }) {
  const {
    products,
    filters,
    expandedItems,
    setProducts,
    toggleExpanded,
    updateFilter
  } = useProductCatalogStore();
  // Fetch only active products for merchant catalog
  const {data}=useFetch(`/products/all?status=active`,0);
  console.log('Fetched products:', data);

  useEffect(() => {
    // Use fetched data if available, otherwise fallback to hardcoded products
    if (data?.data && Array.isArray(data.data)) {
      console.log('Setting products from API:', data.data.length);
      // Transform MongoDB products to match expected Product interface
      const transformedProducts = transformMongoProductsToProducts(data.data);
      console.log('Transformed products:', transformedProducts.length);
      setProducts(transformedProducts);
    } else {
      console.log('Using fallback products');
      setProducts(productCatalogProducts);
    }
  }, [data, setProducts]);

  const navigationItems = useMemo(() => {
    const materials = [...new Set(products.map(p => p.material))];
    const colors = [...new Set(products.flatMap(p => Object.keys(p.colorImageMap)))];
    const sizes = [...new Set(products.flatMap(p => p.sizes))];

    const getCount = (category: keyof typeof filters, value: string) => {
      return products.filter(product => {
        switch (category) {
          case 'material':
            return product.material === value;
          case 'color':
            return Object.keys(product.colorImageMap).includes(value);
          case 'size':
            return product.sizes.includes(value);
          default:
            return true;
        }
      }).length;
    };

    return [
      {
        label: 'Material',
        category: 'material',
        items: materials.map(material => ({
          label: material,
          count: getCount('material', material)
        }))
      },
      {
        label: 'Color',
        category: 'color',
        items: colors.map(color => ({
          label: color,
          count: getCount('color', color)
        }))
      },
      {
        label: 'Size',
        category: 'size',
        items: sizes.map(size => ({
          label: size,
          count: getCount('size', size)
        }))
      }
    ];
  }, [products, filters]);

  return (
    <div className="h-screen flex flex-col">
      {!navbarHidden && <Navbar />}
      <div className="flex flex-1 overflow-hidden bg-[#F5F5F5]">
        {/* Filter Sidebar */}
        <div className="w-[280px] bg-[#F5F5F5] border-r border-[#EBEBEB] sticky top-0 h-screen">
          <div className="py-4 m-2">
            {navigationItems.map(({ label, category, items }, index) => (
              <div key={category}>
                {index > 0 && <div className="h-[1px] bg-[#D8D8D8] mx-4 my-2" />}
                <div className="mb-2">
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      expandedItems.includes(category)
                        ? 'bg-[#DDDDDD]'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleExpanded(category)}
                  >
                    <span className="text-sm font-medium text-[#121212]">{label}</span>
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform ${
                        expandedItems.includes(category) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedItems.includes(category) && (
                    <div className="mt-1 pl-8 pr-6">
                      {items.map(({ label: itemLabel, count }) => (
                        <div key={itemLabel} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              label={itemLabel}
                              checked={filters[category as keyof typeof filters].includes(itemLabel)}
                              onChange={() =>
                                updateFilter(category as keyof typeof filters, itemLabel)
                              }
                            />
                          </div>
                          <span className="text-sm text-[#7A7A7A]">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Sections */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#121212] mb-8">Product Catalogue</h1>

            <div className="flex gap-4 mb-4">
              <h2 className="text-lg font-semibold text-[#121212]">Trending Items</h2>
              <button className="text-[#005BD3] hover:underline text-sm font-semibold">
                View All
              </button>
            </div>
            <Catalog />
          </div>

          <div className="p-8">
            <div className="flex gap-4 mb-4">
              <h2 className="text-lg font-semibold text-[#121212]">New to Store</h2>
              <button className="text-[#005BD3] hover:underline text-sm font-semibold">
                View All
              </button>
            </div>
            <Catalog />
          </div>

          <div className="p-8">
            <div className="flex gap-4 mb-4">
              <h2 className="text-lg font-semibold text-[#121212]">Printrove Choice</h2>
              <button className="text-[#005BD3] hover:underline text-sm font-semibold">
                View All
              </button>
            </div>
            <Catalog />
          </div>
        </div>
      </div>
    </div>
  );
}
