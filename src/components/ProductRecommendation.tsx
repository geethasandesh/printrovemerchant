import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Checkbox } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { useProductCatalogStore } from '../store/useProductCatlog';

interface ProductRecommendationProps {
  id: string | number; // Display ID
  _id?: string; // MongoDB ObjectId for navigation
  title: string;
  sizes: string[];
  price?: number;
  discount?: number;
  currency?: string;
  colorImageMap: {
    [key: string]: {
      color: string;
      path: string;
    };
  };
  defaultColor?: string;
  hoverImage?: string;
  showCheckbox?: boolean;
  inStock?: boolean;
  restockDate?: string;
}

export const ProductRecommendation = ({
  id,
  _id,
  title,
  price,
  discount = 0,
  sizes,
  currency = "$",
  colorImageMap,
  defaultColor = Object.keys(colorImageMap)[0],
  hoverImage,
  showCheckbox = false,
  inStock = true,
  restockDate
}: ProductRecommendationProps) => {
  const navigate = useNavigate();
  const { selectProduct } = useProductCatalogStore(); // ✅ Zustand hook to set selected product
  const [selectedColor, setSelectedColor] = useState<keyof typeof colorImageMap>(defaultColor as keyof typeof colorImageMap);
  const [isHovered, setIsHovered] = useState(false);
  const [checked, setChecked] = useState(false);

  const originalPrice = price !== undefined && discount > 0
    ? (price * 100) / (100 - discount)
    : price;

  const handleProductClick = () => {
    const productId = _id || String(id);
    selectProduct(productId); // ✅ Set the selected product in Zustand store (prefer MongoDB _id)
    navigate(`/product-design-editor/${productId}`); // ✅ Navigate to product design editor with MongoDB _id
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-[356px]">
      <div className="relative" onClick={handleProductClick}>
        <div
          className={`relative h-[344px] w-full rounded-xl overflow-hidden ${!inStock ? 'bg-[#F5F5F5]' : ''} cursor-pointer`}
          onMouseEnter={() => inStock && setIsHovered(true)}
          onMouseLeave={() => inStock && setIsHovered(false)}
        >
          {showCheckbox && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                label=""
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
            </div>
          )}
          <img
            src={isHovered && hoverImage && inStock ? hoverImage : colorImageMap[selectedColor].path}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${!inStock ? 'opacity-50' : ''}`}
          />
          {isHovered && inStock && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 transition-opacity duration-300">
              <Button
                variant="secondary"
                className="w-[70%]"
                onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                  e?.stopPropagation();
                  handleProductClick();
                }}
              >
                Start Design
              </Button>
              <Button
                variant="primary"
                className="w-[70%]"
              >
                Add to Store
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2" onClick={handleProductClick}>
        <h3 className="text-[#11181C] text-lg font-bold hover:underline cursor-pointer">
          {title}
        </h3>

        <div className="flex gap-2">
          {Object.keys(colorImageMap).map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering outer click
                if (inStock) setSelectedColor(color as keyof typeof colorImageMap);
              }}
              className={`w-6 h-6 border rounded-md ${selectedColor === color ? 'border-[#333333]' : 'border-[#DCDCDC]'} ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: colorImageMap[color as keyof typeof colorImageMap].color }}
              disabled={!inStock}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#616161] text-lg font-medium">{sizes[0] + " - " + sizes[sizes.length - 1]}</span>
        </div>

        {inStock ? (
          price !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-[#000000B3] text-lg font-bold">{currency}{price}</span>
              {discount > 0 && originalPrice !== undefined && (
                <>
                  <span className="text-[#909090] text-sm font-medium line-through">{currency}{originalPrice.toFixed(2)}</span>
                  <span className="text-[#F92E2E] text-sm font-bold">({discount}% OFF)</span>
                </>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[#F92E2E] text-lg font-bold">Sold Out</span>
            {restockDate && (
              <span className="text-[#616161] text-sm">(Restock by {restockDate})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
