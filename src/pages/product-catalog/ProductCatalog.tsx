import { useEffect } from 'react';
import { Navbar } from "../../layout/Navbar";
import { Catalog } from './Catalog';
import { productCatalogProducts } from '../../store/products';
import { useProductCatalogStore } from '../../store/useProductCatalogStore';
import { useFetch } from '../../hooks/useFetch';
import { transformVariantsToProducts } from '../../utilityComponents/transformVariantsToProducts';

export function ProductCatalog({ navbarHidden = false }: { navbarHidden?: boolean }) {
  const { setProducts } = useProductCatalogStore();
  // Fetch variants from the same endpoint as admin
  const {data}=useFetch(`/inventory/products/variants?page=1&limit=100`,0);
  console.log('Fetched products:', data);

  useEffect(() => {
    console.log('🔄 ProductCatalog useEffect triggered with data:', data);
    if (data?.data?.length) {
      console.debug('[catalog] First 2 API variants sample', data.data.slice(0, 2));
    }
    
    // Use fetched data if available, otherwise fallback to hardcoded products
    if (data?.data && Array.isArray(data.data)) {
      console.log('✅ Setting products from API:', data.data.length);
      console.log('📊 Raw API data structure:', data);
      console.log('📋 First variant sample:', data.data[0]);
      
      // Transform variant data to match expected Product interface
      const transformedProducts = transformVariantsToProducts(data.data);
      console.log('🔄 Transformed products count:', transformedProducts.length);
      console.log('📋 First transformed product:', transformedProducts[0]);
      
      setProducts(transformedProducts);
    } else {
      console.log('⚠️ Using fallback products - API data not available');
      console.log('🔍 Data structure received:', data);
      setProducts(productCatalogProducts);
    }
  }, [data, setProducts]);

  // Sidebar filters removed

  return (
    <div className="h-screen flex flex-col">
      {!navbarHidden && <Navbar />}
      <div className="flex flex-1 overflow-hidden bg-[#F5F5F5]">
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
