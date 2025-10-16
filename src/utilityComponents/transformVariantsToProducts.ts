import { Product } from '../store/products';

/**
 * Transform ProductVariant data from admin API to match the expected Product interface
 */
export function transformVariantToProduct(variant: any): Product {
  console.log('🔍 Transforming variant:', variant);
  
  // Extract product information from variant
  const productId = variant.productId || variant._id?.toString?.() || String(variant._id || '');
  const title = variant.title || 'Unnamed Product';
  const description = variant.description || '';
  const variantCombo = variant.variantCombo || '';
  const sku = variant.sku || '';
  
  console.log('📋 Extracted data:', {
    productId,
    title,
    description,
    variantCombo,
    sku,
    variantKeys: Object.keys(variant)
  });
  
  // Extract pricing information
  const price = parseFloat(variant.price || '0');
  const compareAtPrice = parseFloat(variant.compareAtPrice || '0');
  const discount = compareAtPrice > price && compareAtPrice > 0
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  
  // Parse variant combination to extract size and color
  const comboParts = variantCombo.split(' - ').map((part: string) => part.trim());
  
  // Try to identify size and color from the combination
  let size = 'M'; // Default size
  let color = 'White'; // Default color
  
  // Look for common size patterns
  const sizePatterns = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const foundSize = comboParts.find((part: string) => 
    sizePatterns.some((pattern: string) => part.toUpperCase().includes(pattern))
  );
  if (foundSize) {
    size = foundSize.toUpperCase();
  }
  
  // Look for color patterns (everything else that's not a size)
  const foundColor = comboParts.find((part: string) => 
    !sizePatterns.some((pattern: string) => part.toUpperCase().includes(pattern))
  );
  if (foundColor) {
    color = foundColor;
  }
  
  // Create color image map
  const colorImageMap: { [key: string]: { color: string; path: string } } = {};
  
  // Map color names to hex codes
  const colorHexMap: { [key: string]: string } = {
    'white': '#FFFFFF',
    'black': '#000000',
    'red': '#EF4D2F',
    'blue': '#A4E8F2',
    'yellow': '#FFD700',
    'green': '#00FF00',
    'pink': '#FFC0CB',
    'gray': '#808080',
    'grey': '#808080',
  };
  
  const hexColor = colorHexMap[color.toLowerCase()] || '#CCCCCC';
  
  // Use thumbnail URL if available, otherwise use default
  // Prefer variant.thumbnailUrl, else try first product thumbnail from backend shape
  const thumbnailUrl =
    variant.thumbnailUrl ||
    (Array.isArray(variant.productThumbnails) && variant.productThumbnails[0]?.url) ||
    (Array.isArray(variant.thumbnails) && variant.thumbnails[0]?.url) ||
    '/product-img-white.png';
  
  colorImageMap[color.toLowerCase()] = {
    color: hexColor,
    path: thumbnailUrl
  };
  
  // Determine if product is in stock
  const available = variant.available || 0;
  const onHand = variant.onHand || 0;
  const inStock = available > 0 || onHand > 0;
  
  const transformedProduct = {
    id: productId,
    _id: productId, // Store the original MongoDB ObjectId
    name: `${title} - ${variantCombo}`,
    colorImageMap,
    sizes: [size],
    currency: '₹',
    price,
    description: description || `${title} ${variantCombo}`,
    material: 'Cotton', // Default material
    category: 'clothing',
    subCategory: 'apparel',
    discount,
    inStock,
    restockDate: !inStock ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
  };
  
  console.log('✅ Transformed product:', transformedProduct);
  return transformedProduct;
}

/**
 * Transform array of ProductVariant objects to Product array
 */
export function transformVariantsToProducts(variants: any[]): Product[] {
  console.log('🚀 transformVariantsToProducts called with:', variants);
  
  if (!Array.isArray(variants)) {
    console.warn('❌ transformVariantsToProducts: input is not an array', variants);
    return [];
  }
  
  console.log(`📦 Processing ${variants.length} variants...`);
  const transformed = variants.map(transformVariantToProduct);
  console.log('🎯 Final transformed products:', transformed);
  
  return transformed;
}
