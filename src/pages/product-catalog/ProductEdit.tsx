import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ArrowLeftIcon, ImagesIcon } from '@shopify/polaris-icons';
import { ProductCustomizer } from '../poc/ProductCustomizer';
import { useProductCatalogStore } from '../../store/useProductCatlog';
import { useFetch } from '../../hooks/useFetch';
import { useProductGridStore } from '../../store/useProductCustomizerAssetStore';

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, selectProduct, setProducts } = useProductCatalogStore();
  const { data, isLoading: isFetchingData } = useFetch(`/products/${id}`, 0);

  console.log('🔍 ProductEdit - data:', data);
  console.log('🔍 ProductEdit - isFetchingData:', isFetchingData);

  useEffect(() => {
    if (data?.data) {
      console.log('✅ Product data loaded in ProductEdit:', data.data);
      const product = data.data;

      // Set product in catalog store
      setProducts([product]);
      selectProduct(product._id);

      // Clear existing gridlines
      useProductGridStore.getState().clearGrids();

      // Loop through all variant configurations
      const variantConfigs = product.variantConfigurations || {};
      Object.values(variantConfigs).forEach((variantConfig: any) => {
        (variantConfig.printConfigurations || []).forEach((config: any) => {
          (config.locations || []).forEach((location: any) => {
            const {
              productType,
              front_gridline,
              back_gridline,
              sleeve_gridline,
              boundingBox,
              gridX,
              gridY,
            } = location;

            if (productType && boundingBox) {
              useProductGridStore.getState().setProductGrid(productType, {
                _id: '',
                front_gridline: front_gridline || '',
                back_gridline: back_gridline || '',
                sleeve_gridline: sleeve_gridline || '',
                width: parseInt(boundingBox.width || '0'),
                height: parseInt(boundingBox.height || '0'),
                top: parseInt(boundingBox.top || '0'),
                left: parseInt(boundingBox.left || '0'),
                gridX: gridX || 20,
                gridY: gridY || 20,
                print_configurations: Object.entries({
                  front: front_gridline,
                  back: back_gridline,
                  sleeve: sleeve_gridline,
                })
                  .filter(([, val]) => !!val)
                  .map(([key]) => key as 'front' | 'back' | 'sleeve'),
          
                id: '',
              });
            }
          });
        });
      });
    }
  }, [data, setProducts, selectProduct]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-8 py-8 flex flex-col pb-20">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="icon" onClick={() => navigate(-1)} icon={<ArrowLeftIcon />} />
          <h1 className="text-2xl font-bold text-[#121212]">
            <span className="text-[#6B7280] mr-2">
              {selectedProduct?.title || "No Product Selected"} |
            </span>
            <span className="text-[#121212]">Change Product</span>
          </h1>
        </div>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-none"
          onClick={() => navigate('/mockup')}
        >
          <ImagesIcon className="w-6 h-6 fill-white" />
          Continue to Mockup
        </Button>
      </div>

      {/* Main Product Editor */}
      <ProductCustomizer />

      {/* Sticky Footer */}
      <div className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between fixed bottom-0 left-0 z-10 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="/product-img-yellow.png"
            alt="product thumbnail"
            className="w-10 h-10 rounded-lg object-cover border border-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {selectedProduct?.title || "Product Title"}
            </span>
            <span className="text-lg font-bold text-[#121212]">
              ₹
              {selectedProduct?.variantConfigurations?.[Object.keys(selectedProduct?.variantConfigurations || {})[0]]
                ?.pricing?.price || "--"}
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          className="!text-sm border border-gray-300 shadow-none hover:bg-gray-100"
          onClick={() => navigate("/add-product/edit")}
        >
          🛒 Order now
        </Button>
      </div>
    </div>
  );
}
