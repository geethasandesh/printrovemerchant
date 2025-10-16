import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ArrowLeftIcon, ImagesIcon } from '@shopify/polaris-icons';
import { useProductCatalogStore } from '../../store/useProductCatlog';
import { useFetch } from '../../hooks/useFetch';

interface ProductPosition {
  location: string;
  width: number;
  height: number;
  top: number;
  left: number;
  gridlines?: Array<{ key: string; url: string }>;
}

interface PrintConfiguration {
  name: string;
  locations: ProductPosition[];
}

interface VariantConfiguration {
  printConfigurations: PrintConfiguration[];
  pricing: {
    price: string;
    compareAtPrice: string;
    costPerItem: string;
  };
}

interface ProductData {
  _id: string;
  title: string;
  description: string;
  status: string;
  productType: string;
  thumbnails: Array<{ key: string; url: string }>;
  variantConfigurations: Record<string, VariantConfiguration>;
}

export default function EnhancedProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, selectProduct, setProducts } = useProductCatalogStore();
  const { data } = useFetch(`/products/${id}`, 0);
  
  // State for current product and positions
  const [product, setProduct] = useState<ProductData | null>(null);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('Front side');
  const [productImage, setProductImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Canvas ref for product visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data?.data) {
      const productData = data.data;
      setProduct(productData);
      selectProduct(productData._id);

      // Extract available positions from variant configurations
      const positions = new Set<string>();
      Object.values(productData.variantConfigurations || {}).forEach((variant: VariantConfiguration) => {
        variant.printConfigurations?.forEach((config: PrintConfiguration) => {
          config.locations?.forEach((location: ProductPosition) => {
            // Convert location names to display names
            const displayName = location.location
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            positions.add(displayName);
          });
        });
      });

      const positionArray = Array.from(positions);
      setAvailablePositions(positionArray);
      
      // Set default position if available
      if (positionArray.length > 0) {
        setSelectedPosition(positionArray[0]);
      }

      // Set product image (use first thumbnail or default)
      const thumbnail = productData.thumbnails?.[0];
      if (thumbnail?.url) {
        setProductImage(thumbnail.url);
      } else {
        // Use default product image based on product type
        setProductImage(getDefaultProductImage(productData.productType));
      }

      setIsLoading(false);
    }
  }, [data, selectProduct]);

  // Get default product image based on product type
  const getDefaultProductImage = (productType: string): string => {
    const type = productType?.toLowerCase();
    if (type?.includes('tshirt') || type?.includes('t-shirt')) {
      return '/product-img-white.png';
    } else if (type?.includes('hoodie')) {
      return '/blue-hoodie.png';
    } else if (type?.includes('mug') || type?.includes('cup')) {
      return '/product-img-white.png';
    }
    return '/product-img-white.png';
  };

  // Handle position selection
  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    // Here you could update the product view/angle based on position
    updateProductView(position);
  };

  // Update product view based on selected position
  const updateProductView = (position: string) => {
    // This would typically involve:
    // 1. Loading the appropriate product model/view
    // 2. Updating the canvas with the new view
    // 3. Adjusting grid lines for the selected position
    
    console.log(`Switching to ${position} view`);
    
    // For now, we'll just log the position change
    // In a real implementation, this would:
    // - Load different product model images
    // - Update grid overlay
    // - Adjust bounding boxes
  };

  // Draw product in canvas
  useEffect(() => {
    if (canvasRef.current && productImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 400;
      canvas.height = 500;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create product image
      const img = new Image();
      img.onload = () => {
        // Draw product image
        ctx.drawImage(img, 50, 50, 300, 400);
        
        // Draw grid overlay
        drawGridOverlay(ctx, canvas.width, canvas.height);
        
        // Draw print area for selected position
        drawPrintArea(ctx, selectedPosition);
      };
      img.src = productImage;
    }
  }, [productImage, selectedPosition]);

  // Draw grid overlay
  const drawGridOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // Draw print area for selected position
  const drawPrintArea = (ctx: CanvasRenderingContext2D, position: string) => {
    // Define print areas for different positions
    const printAreas: Record<string, { x: number; y: number; width: number; height: number }> = {
      'Front side': { x: 150, y: 100, width: 100, height: 80 },
      'Back side': { x: 150, y: 120, width: 100, height: 100 },
      'Sleeve left': { x: 50, y: 200, width: 60, height: 120 },
      'Sleeve right': { x: 290, y: 200, width: 60, height: 120 },
      'Neck label inner': { x: 180, y: 70, width: 40, height: 20 },
    };

    const area = printAreas[position];
    if (area) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(area.x, area.y, area.width, area.height);
      ctx.setLineDash([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="icon" onClick={() => navigate(-1)} icon={<ArrowLeftIcon />} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Info</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm">
            Edit
          </Button>
          <Button variant="secondary" size="sm">
            Preview
          </Button>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Upload</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">AI</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Text</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Library</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Graphics</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Templates</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Shutterstock</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <span className="text-xs">Fiverr</span>
            </button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded"
              style={{ width: '400px', height: '500px' }}
            />
          </div>
        </div>

        {/* Right Sidebar - Variants and Layers */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Variants and layers</h3>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Variants</h4>
              <div className="space-y-2">
                {Object.keys(product.variantConfigurations || {}).map((key) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">{key}</div>
                    <div className="text-xs text-gray-600">
                      ₹{product.variantConfigurations[key]?.pricing?.price || '0'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Colors</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-gray-400"></div>
                <Button variant="secondary" size="sm">
                  Select variants
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Product Views/Positions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="w-6 h-6 bg-gray-200 rounded"></button>
          <span className="text-sm">8%</span>
          <button className="w-6 h-6 bg-gray-200 rounded"></button>
          <button className="w-6 h-6 bg-gray-200 rounded"></button>
        </div>
        
        {/* Position Selection Pills */}
        <div className="flex items-center gap-2">
          {availablePositions.map((position) => (
            <button
              key={position}
              onClick={() => handlePositionSelect(position)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedPosition === position
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
        
        <Button variant="primary">
          Save product
        </Button>
      </div>
    </div>
  );
}
