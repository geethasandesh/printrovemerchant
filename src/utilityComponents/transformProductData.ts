import { Product } from '../store/products';

/**
 * Transform MongoDB product data to match the expected Product interface
 */
export function transformMongoProductToProduct(mongoProduct: any): Product {
  // Extract variant information
  const variantConfigs: any[] = Object.values(mongoProduct.variantConfigurations || {});
  
  // Find the first valid variant with pricing
  const firstValidVariant = variantConfigs.find(
    (v) => !!v.pricing?.price && parseFloat(v.pricing.price as string) > 0
  );
  
  // Extract price information
  const price = parseFloat(firstValidVariant?.pricing?.price || "0");
  const compareAtPrice = parseFloat(firstValidVariant?.pricing?.compareAtPrice || "0");
  const discount =
    compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;
  
  // Extract sizes from variants
  const sizeVariant = mongoProduct.variants?.find((v: any) => v.name === "Size" || v.name === "size");
  const sizes = sizeVariant?.values || [];
  
  // Extract colors from variants
  const colorVariant = mongoProduct.variants?.find((v: any) => v.name === "Color" || v.name === "color");
  const colors = colorVariant?.values || [];
  
  // Create color image map with placeholder images
  const colorImageMap: { [key: string]: { color: string; path: string } } = {};
  colors.forEach((color: string) => {
    // Try to find an image for this color variant
    const variantWithColor = variantConfigs.find(
      (v) => v.values?.some((val: any) => 
        val.name?.toLowerCase() === 'color' && 
        val.value?.toLowerCase() === color.toLowerCase()
      )
    );
    
    // Use variant thumbnail if available, otherwise use placeholder
    let imagePath = '/product-img-white.png'; // Default placeholder
    
    if (variantWithColor?.thumbnails?.[0]?.url) {
      imagePath = variantWithColor.thumbnails[0].url;
    } else if (mongoProduct.thumbnails?.[0]?.url) {
      imagePath = mongoProduct.thumbnails[0].url;
    }
    
    // Map color names to hex codes (basic mapping)
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
    
    colorImageMap[color.toLowerCase()] = {
      color: hexColor,
      path: imagePath
    };
  });
  
  // If no color variants, create a default entry
  if (Object.keys(colorImageMap).length === 0) {
    colorImageMap['default'] = {
      color: '#FFFFFF',
      path: mongoProduct.thumbnails?.[0]?.url || '/product-img-white.png'
    };
  }
  
  // Determine material from product type or description
  const material = mongoProduct.productType || 'Cotton';
  
  // Determine category based on product type or collections
  const category = mongoProduct.collections?.[0] || 'general';
  const subCategory = mongoProduct.productType?.toLowerCase() || 'product';
  
  // Check inventory availability
  const hasInventory = variantConfigs.some(
    (v) => (v.inventory?.location?.available || 0) > 0
  );
  
  return {
    id: mongoProduct._id || mongoProduct.id,
    name: mongoProduct.title || 'Unnamed Product',
    colorImageMap,
    sizes,
    currency: '₹', // Default to INR, could be configurable
    price,
    description: mongoProduct.description || '',
    material,
    category,
    subCategory,
    discount,
    inStock: hasInventory,
    restockDate: !hasInventory ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
  };
}

/**
 * Transform array of MongoDB products to Product array
 */
export function transformMongoProductsToProducts(mongoProducts: any[]): Product[] {
  if (!Array.isArray(mongoProducts)) {
    console.warn('transformMongoProductsToProducts: input is not an array', mongoProducts);
    return [];
  }
  
  return mongoProducts.map(transformMongoProductToProduct);
}
