import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { DesignTools, UploadedFile } from '../../components/product-editor/DesignTools';
import {
  BackArrowIcon,
  InfoIcon,
  UndoIcon,
  RedoIcon,
  SettingsIcon,
  TypeIcon,
  XIcon,
  TagIcon,
  LayersIcon,
  ImageIcon,
  SearchIcon
} from '../../components/product-editor/PrintifyIcons';

// Types
interface DesignLayer {
  id: string;
  type: 'image' | 'text';
  name?: string;
  content: string;
  x: number;
  y: number;
  width: number;  // Display width on canvas
  height: number; // Display height on canvas
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  // Image-specific properties
  actualWidth?: number;  // Actual image width in pixels
  actualHeight?: number; // Actual image height in pixels
  // Text-specific properties
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  inStock: boolean;
}

export default function PrintifyStyleProductDesignEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch product data with model files
  const { data: productData, isLoading: isLoadingProduct } = useFetch(`/products/${id}`, 0);
  
  console.log('🔍 ProductDesignEditor - productData:', productData);
  console.log('🔍 ProductDesignEditor - isLoadingProduct:', isLoadingProduct);

  // NEW: derive admin gridline data (variant combinations → print configs → locations)
  const [selectedCombo, setSelectedCombo] = useState<string>("");
  const [selectedPrintType, setSelectedPrintType] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const variantConfigs: Record<string, any> = (productData as any)?.data?.variantConfigurations || {};
  const comboOptions = Object.keys(variantConfigs).map((k: string) => ({ label: k, value: k }));

  useEffect(() => {
    if (comboOptions.length && !selectedCombo) setSelectedCombo(comboOptions[0].value);
  }, [comboOptions, selectedCombo]);

  // Get print types from variant configs, or use sample data for testing
  const printTypes = selectedCombo ? (variantConfigs[selectedCombo]?.printConfigurations || []) : [];
  
  // Sample print types for testing (when no real data exists)
  const samplePrintTypes = [
    {
      name: "DTF Printing",
      description: "Direct to Film printing for vibrant, durable designs",
      method: "DTF",
      locations: [
        { location: "Front", basePrice: "50.00", fontRate: "20.00" }, 
        { location: "Back", basePrice: "50.00", fontRate: "20.00" }
      ]
    },
    {
      name: "DTG Printing",
      description: "High-quality direct to garment printing with vibrant colors",
      method: "DTG",
      locations: [
        { location: "Front", basePrice: "80.00", fontRate: "30.00" }, 
        { location: "Back", basePrice: "80.00", fontRate: "30.00" }
      ]
    },
    {
      name: "Puff Printing",
      description: "Raised 3D effect printing for eye-catching designs",
      method: "Puff",
      locations: [
        { location: "Front", basePrice: "100.00", fontRate: "40.00" }
      ]
    },
    {
      name: "Vinyl Transfer",
      description: "Durable vinyl transfer for long-lasting designs",
      method: "Vinyl",
      locations: [
        { location: "Front", basePrice: "40.00", fontRate: "15.00" }, 
        { location: "Back", basePrice: "40.00", fontRate: "15.00" }
      ]
    }
  ];
  
  // Use sample data if no print types from product data
  const availablePrintTypes = printTypes.length > 0 ? printTypes : samplePrintTypes;
  const printTypeOptions = availablePrintTypes.map((pc: any) => ({ label: pc.name, value: pc.name }));

  useEffect(() => {
    if (printTypeOptions.length && !selectedPrintType) setSelectedPrintType(printTypeOptions[0].value);
  }, [printTypeOptions, selectedPrintType]);

  const positions = (() => {
    const pc = printTypes.find((p: any) => p.name === selectedPrintType);
    return (pc?.locations || []).map((l: any) => ({ label: l.location, value: l.location }));
  })();


  useEffect(() => {
    if (positions.length && !selectedPosition) setSelectedPosition(positions[0].value);
  }, [positions, selectedPosition]);

  // Set currentModelUrl based on selected gridline image
  useEffect(() => {
    const pc = printTypes.find((p: any) => p.name === selectedPrintType);
    const loc = (pc?.locations || []).find((l: any) => l.location === selectedPosition);
    const grid = loc?.gridlines?.[0];
    const url = grid?.signedUrl || grid?.url || null;
    if (url) setCurrentModelUrl(url);
  }, [printTypes, selectedPrintType, selectedPosition]);


  
  // State management
  const [currentView] = useState<'front' | 'back' | 'left-sleeve' | 'right-sleeve' | 'neck-label'>('front');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showLayerAddMenu, setShowLayerAddMenu] = useState(false);
  const [layerMenuOpenId, setLayerMenuOpenId] = useState<string | null>(null);
  
  // Uploaded files state (lifted from UploadTool to prevent reset on re-render)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Footer and order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderColor, setSelectedOrderColor] = useState('');
  const [selectedOrderSize, setSelectedOrderSize] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  
  // Template save modal state
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  
  // Branding elements state
  const [brandingElements, setBrandingElements] = useState({
    innerNecklabel: false,
    outerNecklabel: false,
    hangTag: false
  });

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if clicking outside the dropdown menus
      if (!target.closest('.dropdown-menu')) {
        setShowLayerAddMenu(false);
        setLayerMenuOpenId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ id: string; startX: number; startY: number; startLeft: number; startTop: number; scale: number; containerLeft: number; containerTop: number; containerW: number; containerH: number; layerW: number; layerH: number } | null>(null);
  const resizeState = useRef<{ id: string; handle: 'nw'|'ne'|'sw'|'se'|'rotate'; startX: number; startY: number; startW: number; startH: number; startRotation: number; centerX: number; centerY: number } | null>(null);
  
  // Design tools - Left Sidebar Navigation (6 sections as per spec)
  const designTools = [
    { id: 'product', name: 'Product', icon: TagIcon },
    { id: 'layers', name: 'Layers', icon: LayersIcon },
    { id: 'files', name: 'Files', icon: ImageIcon },
    { id: 'text', name: 'Text', icon: TypeIcon },
    { id: 'branding', name: 'Branding', icon: TagIcon },
    { id: 'collections', name: 'Collections', icon: SearchIcon }
  ];

  // Get variants from backend data or use sample data for testing
  const backendVariants = productData?.data?.variants || [];

  // Extract actual colors and sizes from database variants
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    
    // Extract from backend variants
    if (backendVariants.length > 0) {
      backendVariants.forEach((variant: any) => {
        const values = variant.values || [];
        values.forEach((value: string) => {
          const lowerValue = value.toLowerCase();
          // Check if it's a color
          if (['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'gray', 'navy', 'purple', 'orange'].includes(lowerValue)) {
            colors.add(value);
          }
          // Check if it's a size
          if (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL'].includes(value.toUpperCase())) {
            sizes.add(value);
          }
        });
      });
    }
    
    // If no colors/sizes found in variants, extract from variant configurations
    if (colors.size === 0 && Object.keys(variantConfigs).length > 0) {
      Object.keys(variantConfigs).forEach(combo => {
        const values = combo.split(' - ').map(v => v.trim());
        values.forEach(value => {
          const lowerValue = value.toLowerCase();
          if (['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'gray', 'navy', 'purple', 'orange'].includes(lowerValue)) {
            colors.add(value);
          }
          if (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL'].includes(value.toUpperCase())) {
            sizes.add(value);
          }
        });
      });
    }
    
    // Fallback to default colors and sizes if none found in database
    const fallbackColors = [
      { label: 'White', value: 'white' },
      { label: 'Black', value: 'black' },
      { label: 'Navy', value: 'navy' },
      { label: 'Gray', value: 'gray' },
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' }
    ];
    
    const fallbackSizes = [
      { label: 'XS', value: 'XS' },
      { label: 'S', value: 'S' },
      { label: 'M', value: 'M' },
      { label: 'L', value: 'L' },
      { label: 'XL', value: 'XL' },
      { label: '2XL', value: '2XL' },
      { label: '3XL', value: '3XL' }
    ];
    
    return {
      colors: colors.size > 0 
        ? Array.from(colors).map(color => ({ label: color, value: color.toLowerCase() }))
        : fallbackColors,
      sizes: sizes.size > 0 
        ? Array.from(sizes).map(size => ({ label: size, value: size }))
        : fallbackSizes
    };
  }, [backendVariants, variantConfigs]);
  
  // Convert backend variants to our format, or use sample data if none exist
  const variants: ProductVariant[] = backendVariants.length > 0 
    ? backendVariants.map((variant: any, index: number) => {
        // Parse variant values to extract color and size
        const values = variant.values || [];
        const color = values.find((v: string) => 
          ['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'gray', 'navy'].includes(v.toLowerCase())
        ) || 'white';
        const size = values.find((v: string) => 
          ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(v.toUpperCase())
        ) || 'M';
        
        // Get pricing from variant configurations - match by variant combination
        const variantCombo = values.join(' - ');
        const variantConfig = variantConfigs[variantCombo];
        
        // Parse price as number (prices are stored as strings in database)
        const basePrice = variantConfig?.pricing?.price ? parseFloat(variantConfig.pricing.price) : 299;
        
        return {
          id: variant._id || index.toString(),
          name: `${color.charAt(0).toUpperCase() + color.slice(1)} / ${size}`,
          color: color.toLowerCase(),
          size: size.toUpperCase(),
          price: basePrice,
          inStock: true // Default to true, could be from inventory data
        };
      })
    : [
        // Sample variants for testing when no backend data
    { id: '1', name: 'White / M', color: 'white', size: 'M', price: 299, inStock: true },
    { id: '2', name: 'Black / M', color: 'black', size: 'M', price: 299, inStock: true },
        { id: '3', name: 'Navy / M', color: 'navy', size: 'M', price: 299, inStock: true },
        { id: '4', name: 'Red / M', color: 'red', size: 'M', price: 299, inStock: true },
        { id: '5', name: 'Gray / M', color: 'gray', size: 'M', price: 299, inStock: true },
        { id: '6', name: 'White / L', color: 'white', size: 'L', price: 349, inStock: true },
        { id: '7', name: 'Black / L', color: 'black', size: 'L', price: 349, inStock: true },
        { id: '8', name: 'Navy / L', color: 'navy', size: 'L', price: 349, inStock: true }
  ];

  // Initialize selected variant
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  // Calculate total price including print type costs and font rates
  const calculateTotalPrice = useMemo(() => {
    let totalPrice = selectedVariant?.price || 0;
    
    // Add print type costs if selected (basePrice + fontRate from selected location)
    if (selectedPrintType && selectedPosition) {
      const printType = availablePrintTypes.find((pt: any) => pt.name === selectedPrintType);
      if (printType) {
        // Find the specific location for accurate pricing
        const location = printType.locations?.find((loc: any) => loc.location === selectedPosition);
        if (location) {
          const printBasePrice = parseFloat(location.basePrice) || 0;
          const fontRate = parseFloat(location.fontRate) || 0;
          totalPrice += printBasePrice + fontRate;
        }
      }
    }
    
    return totalPrice;
  }, [selectedVariant, selectedPrintType, selectedPosition, availablePrintTypes]);

  // Garment configuration for proper scaling
  const garmentConfig = useMemo(() => {
    // Standard garment dimensions for different types and sizes
    const garmentTypes = {
      't-shirt': {
        'XS': { width: 18, height: 26 },
        'S': { width: 20, height: 28 },
        'M': { width: 22, height: 29 },
        'L': { width: 24, height: 30 },
        'XL': { width: 26, height: 31 },
        '2XL': { width: 28, height: 32 },
        '3XL': { width: 30, height: 33 }
      },
      'sweatshirt': {
        'XS': { width: 20, height: 24 },
        'S': { width: 22, height: 25 },
        'M': { width: 24, height: 26 },
        'L': { width: 26, height: 27 },
        'XL': { width: 28, height: 28 },
        '2XL': { width: 30, height: 29 },
        '3XL': { width: 32, height: 30 }
      },
      'polo': {
        'XS': { width: 19, height: 27 },
        'S': { width: 21, height: 28 },
        'M': { width: 23, height: 29 },
        'L': { width: 25, height: 30 },
        'XL': { width: 27, height: 31 },
        '2XL': { width: 29, height: 32 },
        '3XL': { width: 31, height: 33 }
      }
    };
    
    // Determine garment type from product title or use default
    const productTitle = productData?.data?.title?.toLowerCase() || '';
    let garmentType = 't-shirt'; // default
    
    if (productTitle.includes('sweat') || productTitle.includes('hoodie')) {
      garmentType = 'sweatshirt';
    } else if (productTitle.includes('polo')) {
      garmentType = 'polo';
    }
    
    // Get current size from selected variant
    const currentSize = selectedVariant?.size || 'L';
    
    // Get garment dimensions with proper typing
    const garmentDims = (garmentTypes as any)[garmentType]?.[currentSize] || garmentTypes['t-shirt']['L'];
    
    return {
      type: garmentType,
      size: currentSize,
      dimensions: garmentDims,
      canvasWidth: 500, // Standard display canvas width
      canvasHeight: 600 // Standard display canvas height
    };
  }, [productData, selectedVariant]);

  // Get current print area bounding box with proper scaling
  const currentPrintArea = useMemo(() => {
    // First try to get from variant configurations (most accurate)
    const variantConfig = variantConfigs[selectedCombo];
    const pc = variantConfig?.printConfigurations?.find((p: any) => p.name === selectedPrintType);
    const loc = pc?.locations?.find((l: any) => l.location === selectedPosition);
    let boundingBox = loc?.boundingBox;
    
    // Fallback to print types data
    if (!boundingBox) {
      const pc2 = printTypes.find((p: any) => p.name === selectedPrintType);
      const loc2 = (pc2?.locations || []).find((l: any) => l.location === selectedPosition);
      boundingBox = loc2?.boundingBox;
    }
    
    if (boundingBox && boundingBox.width && boundingBox.height) {
      // The bounding box coordinates are in inches relative to the actual garment
      // Scale them properly based on the canvas size and actual garment dimensions
      
      const { dimensions, canvasWidth, canvasHeight } = garmentConfig;
      
      // Calculate scaling factor based on actual garment width vs canvas width
      const scaleX = canvasWidth / dimensions.width;
      const scaleY = canvasHeight / dimensions.height;
      
      // Use the smaller scale to maintain aspect ratio
      const scale = Math.min(scaleX, scaleY);
      
      return {
        width: parseFloat(boundingBox.width) * scale,
        height: parseFloat(boundingBox.height) * scale,
        left: parseFloat(boundingBox.left) * scale,
        top: parseFloat(boundingBox.top) * scale,
      };
    }
    
    // Default print area if no data (centered on canvas with proper proportions)
    const { canvasWidth, canvasHeight } = garmentConfig;
    const defaultWidth = canvasWidth * 0.4; // 40% of canvas width
    const defaultHeight = canvasHeight * 0.4; // 40% of canvas height
    
    return {
      width: defaultWidth,
      height: defaultHeight,
      left: (canvasWidth - defaultWidth) / 2, // Center horizontally
      top: (canvasHeight - defaultHeight) / 2, // Center vertically
    };
  }, [variantConfigs, selectedCombo, printTypes, selectedPrintType, selectedPosition, garmentConfig]);

  // Load model URL based on current view
  useEffect(() => {
    if (productData?.data?.modelFiles) {
      const modelFiles = productData.data.modelFiles;
      let modelUrl = null;
      
      switch (currentView) {
        case 'front':
          modelUrl = modelFiles.front?.url || null;
          break;
        case 'back':
          modelUrl = modelFiles.back?.url || null;
          break;
        case 'left-sleeve':
          modelUrl = modelFiles.leftSleeve?.url || null;
          break;
        case 'right-sleeve':
          modelUrl = modelFiles.rightSleeve?.url || null;
          break;
        case 'neck-label':
          modelUrl = modelFiles.neckLabel?.url || null;
          break;
        default:
          modelUrl = modelFiles.front?.url || null;
      }
      
      setCurrentModelUrl(modelUrl);
    }
  }, [productData, currentView]);

  // Initialize layers - start with empty array for clean model display
  useEffect(() => {
    // Start with empty layers to show clean model
    if (layers.length === 0) {
      setLayers([]);
    }
  }, [layers.length]);


  // Mouse handlers for drag/resize/rotate
  const onLayerMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedLayer(id);
    const layerRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const containerRect = canvasRef.current?.getBoundingClientRect();
    const target = layers.find(l => l.id === id)!;
    dragState.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: target.x,
      startTop: target.y,
      scale: 0.7, // Fixed scale matching canvas transform
      containerLeft: containerRect?.left || 0,
      containerTop: containerRect?.top || 0,
      containerW: containerRect?.width || 0,
      containerH: containerRect?.height || 0,
      layerW: layerRect.width,
      layerH: layerRect.height,
    };
    window.addEventListener('mousemove', onLayerMouseMove);
    window.addEventListener('mouseup', onLayerMouseUp);
  };

  const onLayerMouseMove = (e: MouseEvent) => {
    const s = dragState.current; if (!s) return;
    const dx = (e.clientX - s.startX) / s.scale;
    const dy = (e.clientY - s.startY) / s.scale;
    let newX = s.startLeft + dx;
    let newY = s.startTop + dy;
    
    // Constrain to print area instead of container bounds
    const printArea = currentPrintArea;
    newX = Math.max(printArea.left, Math.min(newX, printArea.left + printArea.width - s.layerW));
    newY = Math.max(printArea.top, Math.min(newY, printArea.top + printArea.height - s.layerH));
    
    setLayers((prev) => prev.map((l) => l.id === s.id ? { ...l, x: newX, y: newY } : l));
  };

  const onLayerMouseUp = () => {
    dragState.current = null;
    window.removeEventListener('mousemove', onLayerMouseMove);
    window.removeEventListener('mouseup', onLayerMouseUp);
  };

  const onHandleMouseDown = (e: React.MouseEvent, id: string, handle: 'nw'|'ne'|'sw'|'se'|'rotate') => {
    e.stopPropagation();
    const el = (e.currentTarget.parentElement as HTMLDivElement);
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const target = layers.find((l) => l.id === id)!;
    resizeState.current = { id, handle, startX: e.clientX, startY: e.clientY, startW: target.width, startH: target.height, startRotation: target.rotation || 0, centerX, centerY };
    window.addEventListener('mousemove', onHandleMouseMove);
    window.addEventListener('mouseup', onHandleMouseUp);
  };

  const onHandleMouseMove = (e: MouseEvent) => {
    const s = resizeState.current; if (!s) return;
    if (s.handle === 'rotate') {
      const angle = Math.atan2(e.clientY - s.centerY, e.clientX - s.centerX) * 180 / Math.PI;
      setLayers((prev) => prev.map((l) => l.id === s.id ? { ...l, rotation: Math.round(angle) } : l));
      return;
    }
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    let newW = s.startW + (s.handle.includes('e') ? dx : -dx);
    let newH = s.startH + (s.handle.includes('s') ? dy : -dy);
    
    // Minimum size constraints
    newW = Math.max(20, newW);
    newH = Math.max(20, newH);
    
    // Maximum size constraints within print area
    const printArea = currentPrintArea;
    const targetLayer = layers.find(l => l.id === s.id);
    if (targetLayer) {
      const maxW = printArea.left + printArea.width - targetLayer.x;
      const maxH = printArea.top + printArea.height - targetLayer.y;
      newW = Math.min(newW, maxW);
      newH = Math.min(newH, maxH);
    }
    
    setLayers((prev) => prev.map((l) => l.id === s.id ? { ...l, width: newW, height: newH } : l));
  };

  const onHandleMouseUp = () => {
    resizeState.current = null;
    window.removeEventListener('mousemove', onHandleMouseMove);
    window.removeEventListener('mouseup', onHandleMouseUp);
  };



  const deleteLayer = (layerId: string) => {
    setLayers(layers.filter(layer => layer.id !== layerId));
    if (selectedLayer === layerId) {
      setSelectedLayer(null);
    }
  };

  // Text editing handler
  const startEditingText = (layerId: string) => {
    // Select the text layer to show its properties panel where it can be edited
    setSelectedLayer(layerId);
  };

  // Tool handlers
  const handleImageFromUploadedFile = (dataUrl: string, filename: string) => {
    console.log('handleImageFromUploadedFile called with:', filename, 'dataUrl length:', dataUrl.length);
    
    const printArea = currentPrintArea;
    
    // Load the image to get actual dimensions
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded, dimensions:', img.width, 'x', img.height);
    const newLayer: DesignLayer = {
      id: Date.now().toString(),
        type: 'image',
        name: `Photo ${layers.filter(l=>l.type==='image').length + 1}`,
        content: dataUrl,
      x: printArea.left + 10, // Place within print area
      y: printArea.top + 10,
        width: 180,  // Display width on canvas
        height: 220, // Display height on canvas
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
        zIndex: layers.length + 1,
        actualWidth: img.width,   // Store actual image width
        actualHeight: img.height  // Store actual image height
      };
      console.log('Adding new layer from uploaded file:', newLayer);
      setLayers((prev) => {
        console.log('Previous layers:', prev.length, 'Adding new layer, total will be:', prev.length + 1);
        return [...prev, newLayer];
      });
    };
    
    img.onerror = (error) => {
      console.error('Error loading image from uploaded file:', error);
    };
    
    img.src = dataUrl;
  };

  const handleImageUpload = (file: File) => {
    console.log('handleImageUpload called with file:', file.name, file.type, file.size);
    
    const printArea = currentPrintArea;
    
    // Read as data URL so we can render the actual image instead of filename
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      console.log('FileReader loaded, data URL length:', dataUrl.length);
      
      // Load the image to get actual dimensions
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
      const newLayer: DesignLayer = {
        id: Date.now().toString(),
        type: 'image',
          name: `Photo ${layers.filter(l=>l.type==='image').length + 1}`,
        content: dataUrl,
        x: printArea.left + 10, // Place within print area
        y: printArea.top + 10,
          width: 180,  // Display width on canvas
          height: 220, // Display height on canvas
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
          zIndex: layers.length + 1,
          actualWidth: img.width,   // Store actual image width
          actualHeight: img.height  // Store actual image height
        };
        console.log('Adding new layer:', newLayer);
        setLayers((prev) => {
          console.log('Previous layers:', prev.length, 'Adding new layer, total will be:', prev.length + 1);
          return [...prev, newLayer];
        });
      setActiveTool(null);
    };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        alert('Failed to load image. The file may be corrupted.');
      };
      
      img.src = dataUrl;
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };

  const handleAddText = (text: string, style: any) => {
    const printArea = currentPrintArea;
    const newLayer: DesignLayer = {
      id: Date.now().toString(),
      type: 'text',
      name: `Text ${layers.filter(l=>l.type==='text').length + 1}`,
      content: text,
      x: printArea.left + 10, // Place within print area
      y: printArea.top + 10,
      width: 150,
      height: 40,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: layers.length + 1,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      color: style.color,
      fontWeight: style.fontWeight,
      textAlign: 'center'
    };
    setLayers([...layers, newLayer]);
    setActiveTool(null);
  };

  const handleSelectTemplate = (template: any) => {
    // Add template layers
    const templateLayers: DesignLayer[] = [
      {
        id: Date.now().toString(),
        type: 'text',
        content: template.name,
        x: 150,
        y: 150,
        width: 200,
        height: 50,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 1,
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    ];
    setLayers([...layers, ...templateLayers]);
    setShowTemplateModal(false);
  };

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    setIsSavingTemplate(true);

    try {
      const templateData = {
        templateName: templateName.trim(),
        templateDescription: templateDescription.trim(),
        baseProductId: id,
        baseProductTitle: productData?.data?.title || 'Custom Product',
        designLayers: layers,
        printType: selectedPrintType,
        printPosition: selectedPosition,
        printArea: currentPrintArea,
        selectedCombination: selectedCombo,
        selectedVariant: {
          name: selectedVariant?.name,
          color: selectedVariant?.color,
          size: selectedVariant?.size,
        },
        status: 'active',
        tags: [selectedPrintType, selectedPosition, selectedVariant?.color].filter(Boolean),
      };

      const API_URL = import.meta.env.VITE_APP_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not configured. Please check your environment variables.');
      }

      // Normalize URL similar to useFetch to avoid double/missing /api
      const base = API_URL.replace(/\/+$/, '');
      let ep = '/product-templates';
      const baseEndsWithApi = /\/api$/i.test(base);
      if (!baseEndsWithApi) {
        ep = `/api${ep}`;
      }
      const url = `${base}${ep}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        let message = 'Failed to save template';
        try {
          const errJson = await response.json();
          if (errJson?.message) message = errJson.message;
        } catch (_) {
          // ignore json parse error
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const result = await response.json();
      console.log('Template saved successfully:', result);

      // Show success message
      alert('Template saved successfully!');
      
      // Reset modal state
      setShowSaveTemplateModal(false);
      setTemplateName('');
      setTemplateDescription('');
      
      // Navigate to templates page
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      alert(`Failed to save template. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'product':
        return (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Information</h3>
            
            {/* Product Thumbnail */}
            {currentModelUrl && (
              <div className="mb-4">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={currentModelUrl}
                    alt={productData?.data?.title || 'Product'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            {/* Product Name - Prominent Display */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {isLoadingProduct ? 'Loading...' : productData?.data?.title || 'Product Design Editor'}
              </h2>
              {productData?.data?.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {productData.data.description}
                </p>
              )}
            </div>

            {/* Garment Information */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-xs font-semibold text-blue-900 mb-2">Garment Configuration</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700">Type:</span>
                  <span className="text-blue-900 font-medium capitalize">{garmentConfig.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Size:</span>
                  <span className="text-blue-900 font-medium">{garmentConfig.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Dimensions:</span>
                  <span className="text-blue-900 font-medium">{garmentConfig.dimensions.width}" × {garmentConfig.dimensions.height}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Canvas:</span>
                  <span className="text-blue-900 font-medium">{garmentConfig.canvasWidth} × {garmentConfig.canvasHeight}px</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Selected Variant</label>
                <div className="flex items-center space-x-2">
                  {selectedVariant && (
                    <div className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                      selectedVariant.color === 'white' ? 'bg-white' : 'bg-gray-800'
                    }`}></div>
                  )}
                  <span className="text-sm text-gray-900 font-medium">
                    {selectedVariant?.name || 'None selected'}
                  </span>
                </div>
                <button
                  onClick={() => setShowVariantModal(true)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change variant
                </button>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Current View</label>
                <div className="text-sm text-gray-900 font-medium capitalize">
                  {currentView.replace('-', ' ')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Variant Base Price</label>
                <div className="text-sm text-gray-900 font-medium">
                  ₹{selectedVariant?.price?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Total Price (with Print Type)</label>
                <div className="text-lg text-green-700 font-bold">
                  ₹{calculateTotalPrice.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
                <div className="flex items-center space-x-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    selectedVariant?.inStock ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm text-gray-900 font-medium">
                    {selectedVariant?.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Print Type Selection */}
            {availablePrintTypes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Print Type Selection</h3>
                
                <div className="space-y-3">
                  {availablePrintTypes.map((printType: any) => {
                    const isSelected = selectedPrintType === printType.name;
                    
                    // Get pricing for the selected location (or first location as default)
                    const currentLocation = printType.locations?.find((loc: any) => loc.location === selectedPosition) 
                      || printType.locations?.[0];
                    
                    const basePrice = currentLocation?.basePrice ? parseFloat(currentLocation.basePrice) : 0;
                    const fontRate = currentLocation?.fontRate ? parseFloat(currentLocation.fontRate) : 0;
                    const totalPrice = basePrice + fontRate;
                    
                    return (
                      <div
                        key={printType.name}
                        onClick={() => setSelectedPrintType(printType.name)}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Selection Indicator */}
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Print Type Name */}
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-semibold ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {printType.name}
                              </h4>
                              
                              {/* Real-time Price Display */}
                              <div className={`text-sm font-bold ${
                                isSelected ? 'text-blue-700' : 'text-gray-700'
                              }`}>
                                ₹{totalPrice.toFixed(2)}
                              </div>
                            </div>

                            {/* Description/Details */}
                            {printType.description && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {printType.description}
                              </p>
                            )}

                            {/* Price Breakdown */}
                            <div className="flex items-center space-x-3 text-xs">
                              <span className="text-gray-500">
                                Print: ₹{basePrice.toFixed(2)}
                              </span>
                              {fontRate > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-500">
                                    Font/Setup: ₹{fontRate.toFixed(2)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Print Method Badge */}
                            <div className="mt-2 flex items-center space-x-2">
                              {printType.method && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  isSelected
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {printType.method}
                                </span>
                              )}
                              {printType.locations && printType.locations.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  {printType.locations.length} location{printType.locations.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500 text-white">
                              Selected
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total Price Summary */}
                {selectedPrintType && selectedPosition && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Selected Print Type</p>
                        <p className="text-sm font-bold text-gray-900">{selectedPrintType}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Position: {selectedPosition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">Print Cost</p>
                        <p className="text-lg font-bold text-blue-700">
                          ₹{(() => {
                            const pt = availablePrintTypes.find((p: any) => p.name === selectedPrintType);
                            if (!pt) return '0.00';
                            const location = pt.locations?.find((loc: any) => loc.location === selectedPosition);
                            if (!location) return '0.00';
                            const total = (parseFloat(location.basePrice) || 0) + (parseFloat(location.fontRate) || 0);
                            return total.toFixed(2);
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Helper Text */}
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-xs text-amber-800">
                    💡 <span className="font-medium">Price includes:</span> Print base cost + Font/Setup charges
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Prices vary by print type and position. Select different positions to see updated pricing.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 'layers':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Layers</h3>
              <div className="relative dropdown-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLayerAddMenu(!showLayerAddMenu);
                  }}
                  className="px-2 py-1 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Add new +
                </button>
                {showLayerAddMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dropdown-menu">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLayerAddMenu(false);
                        handleAddText('New Text', { fontSize: 24, fontFamily: 'Arial', color: '#000000', fontWeight: 'bold' });
                      }}
                    >
                      Add Text
                    </button>
                    <label className="w-full block px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e)=>{
                          const f = e.target.files?.[0];
                          if (f) {
                            handleImageUpload(f);
                            setShowLayerAddMenu(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {layers.length === 0 ? (
                <p className="text-xs text-gray-500">No layers yet. Add elements to start designing.</p>
              ) : (
                // Sort layers by zIndex (highest first = top of stack)
                [...layers].sort((a, b) => b.zIndex - a.zIndex).map((layer, idx) => {
                  const name = layer.name || (layer.type === 'text' ? `Text ${idx+1}` : `Photo ${idx+1}`);
                  
                  // Enhanced DPI calculation for image layers
                  let dpi = null;
                  let qualityLevel = null;
                  let dpiColor = '';
                  let qualityText = '';
                  
                  if (layer.type === 'image' && layer.actualWidth) {
                    // Accurate DPI calculation using actual image dimensions
                    // Assume standard print area of 10 inches wide (typical t-shirt print area)
                    const printWidthInches = 10;
                    const dpiValue = Math.round(layer.actualWidth / printWidthInches);
                    dpi = dpiValue;
                    
                    // Enhanced quality assessment
                    if (dpi >= 300) {
                      qualityLevel = 'high';
                      dpiColor = 'bg-green-100 text-green-700 border-green-300';
                      qualityText = 'High Quality';
                    } else if (dpi >= 150) {
                      qualityLevel = 'medium';
                      dpiColor = 'bg-yellow-100 text-yellow-700 border-yellow-300';
                      qualityText = 'Medium Quality';
                    } else {
                      qualityLevel = 'low';
                      dpiColor = 'bg-red-100 text-red-700 border-red-300';
                      qualityText = 'Low Quality';
                    }
                  }
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer.id)}
                      className={`flex items-center space-x-3 p-2 rounded border ${
                        selectedLayer === layer.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {layer.type === 'text' ? (
                          <span className="text-[10px] font-bold text-gray-700">T</span>
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-medium text-gray-900 truncate">{name}</p>
                          {/* Layer position indicator */}
                          <span className="text-[9px] text-gray-400 font-mono">#{idx + 1}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{layer.type === 'text' ? 'Text Layer' : 'Image Layer'}</p>
                      </div>

                      {/* Layer ordering controls */}
                      <div className="flex flex-col space-y-0.5 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move layer up (increase zIndex)
                            const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
                            const currentIdx = sortedLayers.findIndex(l => l.id === layer.id);
                            if (currentIdx > 0) {
                              const layerAbove = sortedLayers[currentIdx - 1];
                              const newZIndex = layerAbove.zIndex + 1;
                              setLayers(layers.map(l => l.id === layer.id ? { ...l, zIndex: newZIndex } : l));
                            }
                          }}
                          disabled={idx === 0}
                          className={`p-0.5 rounded ${idx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                          aria-label="Move layer up"
                          title="Move layer up"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Move layer down (decrease zIndex)
                            const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
                            const currentIdx = sortedLayers.findIndex(l => l.id === layer.id);
                            if (currentIdx < sortedLayers.length - 1) {
                              const layerBelow = sortedLayers[currentIdx + 1];
                              const newZIndex = layerBelow.zIndex - 1;
                              setLayers(layers.map(l => l.id === layer.id ? { ...l, zIndex: newZIndex } : l));
                            }
                          }}
                          disabled={idx === layers.length - 1}
                          className={`p-0.5 rounded ${idx === layers.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                          aria-label="Move layer down"
                          title="Move layer down"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {dpi && (
                        <div className="relative group">
                          <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border font-medium ${dpiColor}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                              qualityLevel === 'high' ? 'bg-green-600' : 
                              qualityLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}></div>
                            {dpi} DPI
                          </span>
                          
                          {/* Quality tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {qualityText}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      )}

                      {/* Three-dot menu */}
                      <div className="relative">
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={(e)=>{ e.stopPropagation(); setLayerMenuOpenId(layerMenuOpenId===layer.id?null:layer.id); }}
                          aria-label="Layer actions"
                        >
                          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <circle cx="4" cy="10" r="1.5"/>
                            <circle cx="10" cy="10" r="1.5"/>
                            <circle cx="16" cy="10" r="1.5"/>
                          </svg>
                        </button>
                        {layerMenuOpenId === layer.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100" 
                              onClick={(e)=>{
                                e.stopPropagation(); 
                                if (layer.type === 'text') {
                                  startEditingText(layer.id);
                                } else {
                                  setSelectedLayer(layer.id);
                                }
                                setLayerMenuOpenId(null);
                              }}
                            >
                              {layer.type === 'text' ? 'Edit Text' : 'Edit Properties'}
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" 
                              onClick={(e)=>{e.stopPropagation(); const newName = prompt('Rename layer', name); if (newName) setLayers(layers.map(l=> l.id===layer.id ? { ...l, name: newName } : l)); setLayerMenuOpenId(null);}}
                            >
                              Rename
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" 
                              onClick={(e)=>{e.stopPropagation(); const copy: DesignLayer = { ...layer, id: Date.now().toString(), name: (layer.name||name)+ ' copy', x: layer.x + 10, y: layer.y + 10 }; setLayers([...layers, copy]); setLayerMenuOpenId(null);}}
                            >
                              Duplicate
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" 
                              onClick={(e)=>{e.stopPropagation(); const maxZ = Math.max(...layers.map(l => l.zIndex)); setLayers(layers.map(l=> l.id===layer.id ? { ...l, zIndex: maxZ + 1 } : l)); setLayerMenuOpenId(null);}}
                            >
                              Bring to front
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" 
                              onClick={(e)=>{e.stopPropagation(); const minZ = Math.min(...layers.map(l => l.zIndex)); setLayers(layers.map(l=> l.id===layer.id ? { ...l, zIndex: minZ - 1 } : l)); setLayerMenuOpenId(null);}}
                            >
                              Send to back
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100" 
                              onClick={(e)=>{e.stopPropagation(); deleteLayer(layer.id); setLayerMenuOpenId(null);}}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      case 'files':
        return (
          <DesignTools.UploadTool 
            onImageUpload={handleImageFromUploadedFile}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        );
      case 'text':
        return <DesignTools.TextTool onTextAdd={handleAddText} />;
      case 'branding':
        return <DesignTools.BrandingTool 
          brandingElements={brandingElements}
          setBrandingElements={setBrandingElements}
        />;
      case 'collections':
        return <DesignTools.TemplatesTool onTemplateSelect={handleSelectTemplate} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BackArrowIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {isLoadingProduct ? 'Loading...' : productData?.data?.title || 'Product Design Editor'}
            </h1>
            <p className="text-sm text-gray-500">
              {isLoadingProduct ? 'Loading product...' : 'Design your product'}
            </p>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <InfoIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <UndoIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <RedoIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsEditMode(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                isEditMode 
                  ? 'bg-[#8b5a3c] text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                !isEditMode 
                  ? 'bg-[#8b5a3c] text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation Icons Only */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-2 flex-shrink-0">
            <div className="space-y-2">
              {designTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition ${
                    activeTool === tool.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  title={tool.name}
                >
                  <tool.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] font-medium text-gray-700 mt-1 leading-tight">{tool.name}</span>
                </button>
              ))}
            </div>
            </div>
          </div>
          
        {/* Middle Panel - Tool Content */}
          {activeTool && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {renderActiveTool()}
            </div>
        </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 overflow-auto">
            <div className="relative max-w-2xl max-h-full">
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{ 
                  transform: `scale(0.7)`, 
                  transformOrigin: 'center',
                  width: `${garmentConfig.canvasWidth}px`,
                  height: `${garmentConfig.canvasHeight}px`
                }}
              >
                {/* Dynamic Product Model from Database */}
                {isLoadingProduct ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading product model...</p>
                    </div>
                  </div>
                ) : currentModelUrl ? (
                  <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={currentModelUrl}
                        alt={`${productData?.data?.title || 'Product'} ${currentView}`}
                        className="max-w-full max-h-full object-contain"
                      />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Model Available</h3>
                      <p className="text-sm text-gray-500">
                        {productData?.data?.title || 'This product'} doesn't have a {currentView} model uploaded.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Render layers on the mockup */}
                <div ref={canvasRef} className="absolute inset-0">
                  {/* Print Area Boundary */}
                  <div
                    className="absolute border-2 border-dashed border-blue-500 bg-blue-50 bg-opacity-30"
                    style={{
                      left: currentPrintArea.left,
                      top: currentPrintArea.top,
                      width: currentPrintArea.width,
                      height: currentPrintArea.height,
                      zIndex: 1
                    }}
                  >
                    {/* Print Area Label */}
                    <div className="absolute -top-8 left-0 text-xs text-blue-600 font-semibold bg-white px-2 py-1 rounded shadow-sm">
                      Print Area ({selectedPosition})
                    </div>
                    
                    {/* Print Area Dimensions */}
                    <div className="absolute -bottom-8 left-0 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                      {(() => {
                        const pc = printTypes.find((p: any) => p.name === selectedPrintType);
                        const loc = (pc?.locations || []).find((l: any) => l.location === selectedPosition);
                        const boundingBox = loc?.boundingBox;
                        
                        if (boundingBox && boundingBox.width && boundingBox.height) {
                          return `${boundingBox.width}" × ${boundingBox.height}"`;
                        }
                        return `${Math.round(currentPrintArea.width / 22)}" × ${Math.round(currentPrintArea.height / 22)}"`;
                      })()}
                    </div>
                    
                    {/* Print Area Corner Indicators */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => onLayerMouseDown(e, layer.id)}
                      onDoubleClick={() => {
                        if (layer.type === 'text') {
                          setSelectedLayer(layer.id);
                        }
                      }}
                      className={`absolute ${selectedLayer === layer.id ? 'border-2 border-blue-500' : 'border border-gray-400'} border-dashed`}
                      style={{
                        left: layer.x,
                        top: layer.y,
                        width: layer.width,
                        height: layer.height,
                        transform: `rotate(${layer.rotation}deg)`,
                        opacity: layer.opacity,
                        zIndex: layer.zIndex + 10, // Above print area boundary
                        cursor: layer.type === 'text' ? 'text' : 'move',
                      }}
                    >
                      {layer.type === 'text' ? (
                        <div 
                          className={`w-full h-full flex items-center text-sm font-medium rounded select-none ${layer.isBold ? 'font-bold' : ''} ${layer.isItalic ? 'italic' : ''} ${layer.isUnderline ? 'underline' : ''}`}
                          style={{
                            fontSize: `${layer.fontSize || 24}px`,
                            fontFamily: layer.fontFamily || 'Arial',
                            color: layer.color || '#000000',
                            fontWeight: layer.fontWeight || 'normal',
                            backgroundColor: 'transparent',
                            textAlign: (layer.textAlign || 'left') as 'left' | 'center' | 'right',
                            justifyContent: layer.textAlign === 'center' ? 'center' : 
                                           layer.textAlign === 'right' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          {layer.content}
                        </div>
                      ) : (
                        <img
                          src={typeof layer.content === 'string' ? layer.content : ''}
                          alt="design"
                          className="w-full h-full object-contain rounded select-none"
                          draggable={false}
                        />
                      )}

                      {/* Resize handles when selected */}
                      {selectedLayer === layer.id && (
                        <>
                          {['nw','ne','sw','se','rotate'].map((pos) => (
                            <div
                              key={pos}
                              onMouseDown={(e) => onHandleMouseDown(e, layer.id, pos as any)}
                              className={`absolute bg-white border border-blue-500 ${pos==='rotate' ? 'w-4 h-4 rounded-full -top-6 left-1/2 -ml-2 cursor-alias' : 'w-3 h-3 -ml-1.5 -mt-1.5 cursor-nwse-resize'} shadow`}
                              style={{
                                top: pos==='nw' ? 0 : pos==='ne' ? 0 : pos==='sw' ? '100%' : pos==='se' ? '100%' : undefined,
                                left: pos==='nw' ? 0 : pos==='ne' ? '100%' : pos==='sw' ? 0 : pos==='se' ? '100%' : '50%',
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>

        {/* Right Sidebar - Variant Selection and Layer Properties */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Variants Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Variant</h4>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 border-2 border-gray-300 rounded-full ${
                      selectedVariant?.color === 'white' ? 'bg-white' : 'bg-gray-800'
                    }`}></div>
                  <button
                      onClick={() => setShowVariantModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                      {selectedVariant ? selectedVariant.name : 'Select variant'}
                  </button>
                  </div>
                </div>
                  
                {/* Position Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Print Position</h4>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={selectedPosition} 
                    onChange={(e) => setSelectedPosition(e.target.value)}
                  >
                    {positions.map((position: any) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
              </div>

                {/* Print Area Information */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-xs font-semibold text-green-900 mb-2">Print Area Details</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-green-700">Position:</span>
                      <span className="text-green-900 font-medium">{selectedPosition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Size:</span>
                      <span className="text-green-900 font-medium">
                        {(() => {
                          const pc = printTypes.find((p: any) => p.name === selectedPrintType);
                          const loc = (pc?.locations || []).find((l: any) => l.location === selectedPosition);
                          const boundingBox = loc?.boundingBox;
                          
                          if (boundingBox && boundingBox.width && boundingBox.height) {
                            return `${boundingBox.width}" × ${boundingBox.height}"`;
                          }
                          return `${Math.round(currentPrintArea.width / 22)}" × ${Math.round(currentPrintArea.height / 22)}"`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Canvas Position:</span>
                      <span className="text-green-900 font-medium">
                        {Math.round(currentPrintArea.left)}, {Math.round(currentPrintArea.top)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Canvas Size:</span>
                      <span className="text-green-900 font-medium">
                        {Math.round(currentPrintArea.width)} × {Math.round(currentPrintArea.height)}px
                      </span>
                    </div>
                  </div>
                </div>

                        
                {/* Selected Layer Properties */}
                {selectedLayer && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Layer Properties</h4>
                    {(() => {
                      const layer = layers.find(l => l.id === selectedLayer);
                      if (!layer) return null;
                      
                      return (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Type</label>
                            <div className="text-sm text-gray-900 capitalize">{layer.type}</div>
                          </div>
                          
                          {/* Layer Position in Stack */}
                          {(() => {
                            const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
                            const position = sortedLayers.findIndex(l => l.id === selectedLayer) + 1;
                            const total = layers.length;
                            
                            return (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Layer Position</label>
                <div className="flex items-center space-x-2">
                                  <div className="text-sm text-gray-900">
                                    {position} of {total}
                                  </div>
                                  <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-blue-600 h-full transition-all"
                                      style={{ width: `${(position / total) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                  <button
                                    onClick={() => {
                                      const maxZ = Math.max(...layers.map(l => l.zIndex));
                                      setLayers(layers.map(l => l.id === selectedLayer ? { ...l, zIndex: maxZ + 1 } : l));
                                    }}
                                    disabled={position === 1}
                                    className={`flex-1 px-2 py-1 text-xs rounded-md ${
                                      position === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                                  >
                                    ⬆ Bring Forward
                  </button>
                  <button
                                    onClick={() => {
                                      const minZ = Math.min(...layers.map(l => l.zIndex));
                                      setLayers(layers.map(l => l.id === selectedLayer ? { ...l, zIndex: minZ - 1 } : l));
                                    }}
                                    disabled={position === total}
                                    className={`flex-1 px-2 py-1 text-xs rounded-md ${
                                      position === total
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                                  >
                                    ⬇ Send Backward
                  </button>
                </div>
                              </div>
                            );
                          })()}
                          
                          {/* DPI Quality Information for Image Layers */}
                          {layer.type === 'image' && layer.actualWidth && (() => {
                            const printWidthInches = 10; // Standard t-shirt print area width
                            const dpi = Math.round(layer.actualWidth / printWidthInches);
                            const qualityLevel = dpi >= 300 ? 'high' : dpi >= 150 ? 'medium' : 'low';
                            
                            return (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Image Quality</label>
                                <div className="text-[10px] text-gray-500 mb-1">
                                  Image Size: {layer.actualWidth} × {layer.actualHeight} px
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${
                                    qualityLevel === 'high' ? 'bg-green-100 text-green-700' :
                                    qualityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    <div className={`w-2 h-2 rounded-full mr-1 ${
                                      qualityLevel === 'high' ? 'bg-green-600' :
                                      qualityLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                                    }`}></div>
                                    {dpi} DPI
                                  </span>
                                  <span className={`text-xs font-medium ${
                                    qualityLevel === 'high' ? 'text-green-700' :
                                    qualityLevel === 'medium' ? 'text-yellow-700' : 'text-red-700'
                                  }`}>
                                    {qualityLevel === 'high' ? 'High Quality' :
                                     qualityLevel === 'medium' ? 'Medium Quality' : 'Low Quality'}
                                  </span>
              </div>

                                {/* Quality warning for low DPI */}
                                {qualityLevel === 'low' && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <div>
                                        <p className="text-xs font-medium text-red-800">Low Resolution Warning</p>
                                        <p className="text-xs text-red-700 mt-1">
                                          This image may appear blurry when printed. Consider using a higher resolution image (300+ DPI recommended).
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Quality recommendation for medium DPI */}
                                {qualityLevel === 'medium' && (
                                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div>
                                        <p className="text-xs font-medium text-yellow-800">Medium Quality</p>
                                        <p className="text-xs text-yellow-700 mt-1">
                                          Image quality is acceptable but could be improved with higher resolution (300+ DPI recommended for best results).
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          
                          {/* Text Content Editor for Text Layers */}
                          {layer.type === 'text' && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Text Content</label>
                              <div className="relative">
                                <textarea
                                  value={layer.content}
                                  onChange={(e) => {
                                    setLayers(layers.map(l => 
                                      l.id === selectedLayer ? { ...l, content: e.target.value } : l
                                    ));
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  rows={3}
                                  placeholder="Enter text here..."
                                />
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1">
                                Edit your text content directly here
                              </p>
                            </div>
                          )}
                          
                          {/* Text Styling for Text Layers */}
                          {layer.type === 'text' && (
                            <div className="space-y-2 pt-2 border-t border-gray-200">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                                <input
                                  type="range"
                                  min="8"
                                  max="72"
                                  value={layer.fontSize || 24}
                                  onChange={(e) => {
                                    setLayers(layers.map(l => 
                                      l.id === selectedLayer ? { ...l, fontSize: parseInt(e.target.value) } : l
                                    ));
                                  }}
                                  className="w-full"
                                />
                                <div className="text-xs text-gray-500 text-right">{layer.fontSize || 24}px</div>
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                                <select
                                  value={layer.fontFamily || 'Arial'}
                                  onChange={(e) => {
                                    setLayers(layers.map(l => 
                                      l.id === selectedLayer ? { ...l, fontFamily: e.target.value } : l
                                    ));
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                >
                                  <option value="Arial">Arial</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Courier New">Courier New</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Verdana">Verdana</option>
                                  <option value="Impact">Impact</option>
                                </select>
            </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={layer.color || '#000000'}
                                    onChange={(e) => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, color: e.target.value } : l
                                      ));
                                    }}
                                    className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={layer.color || '#000000'}
                                    onChange={(e) => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, color: e.target.value } : l
                                      ));
                                    }}
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md font-mono"
                                    placeholder="#000000"
                                  />
          </div>
        </div>

            <div>
                                <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
                                <select
                                  value={layer.fontWeight || 'normal'}
                                  onChange={(e) => {
                                    setLayers(layers.map(l => 
                                      l.id === selectedLayer ? { ...l, fontWeight: e.target.value } : l
                                    ));
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="bold">Bold</option>
                                  <option value="lighter">Light</option>
                                </select>
              </div>
              
                <div>
                                <label className="block text-xs text-gray-600 mb-2">Text Styling</label>
                                <div className="flex space-x-1">
                    <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, isBold: !(l.isBold || false) } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition font-bold ${
                                      layer.isBold
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Bold"
                                  >
                                    B
                                  </button>
                                  <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, isItalic: !(l.isItalic || false) } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition italic ${
                                      layer.isItalic
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Italic"
                                  >
                                    I
                                  </button>
                                  <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, isUnderline: !(l.isUnderline || false) } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition underline ${
                                      layer.isUnderline
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Underline"
                                  >
                                    U
                    </button>
                  </div>
                </div>

                <div>
                                <label className="block text-xs text-gray-600 mb-2">Text Alignment</label>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, textAlign: 'left' } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition ${
                                      (layer.textAlign || 'left') === 'left'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Align Left"
                                  >
                                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, textAlign: 'center' } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition ${
                                      layer.textAlign === 'center'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Align Center"
                                  >
                                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-8 6h8" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setLayers(layers.map(l => 
                                        l.id === selectedLayer ? { ...l, textAlign: 'right' } : l
                                      ));
                                    }}
                                    className={`flex-1 p-2 border rounded-md transition ${
                                      layer.textAlign === 'right'
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                                    title="Align Right"
                                  >
                                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-8 6h8" />
                                    </svg>
                                  </button>
                            </div>
                        </div>
                        </div>
                          )}
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Opacity</label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={layer.opacity}
                              onChange={(e) => {
                                const newOpacity = parseFloat(e.target.value);
                                setLayers(layers.map(l => 
                                  l.id === selectedLayer ? { ...l, opacity: newOpacity } : l
                                ));
                              }}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-right">{Math.round(layer.opacity * 100)}%</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Rotation</label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={layer.rotation}
                              onChange={(e) => {
                                const newRotation = parseInt(e.target.value);
                                setLayers(layers.map(l => 
                                  l.id === selectedLayer ? { ...l, rotation: newRotation } : l
                                ));
                              }}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 text-right">{layer.rotation}°</div>
                          </div>
                        <button
                          onClick={() => deleteLayer(layer.id)}
                            className="w-full mt-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition"
                        >
                            Delete Layer
                        </button>
                      </div>
                      );
                    })()}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                <h4 className="font-medium">Business Template</h4>
                <p className="text-sm text-gray-500">Professional design for business use</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                <h4 className="font-medium">Creative Template</h4>
                <p className="text-sm text-gray-500">Artistic design for creative projects</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Variants</h3>
              <button
                onClick={() => setShowVariantModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setShowVariantModal(false);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    selectedVariant?.id === variant.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{variant.name}</p>
                      <p className="text-sm text-gray-500">₹{variant.price.toFixed(2)}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      variant.color === 'white' ? 'bg-white border-gray-300' : 'bg-gray-800'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-gray-900">
            Subtotal: ₹{(calculateTotalPrice * orderQuantity).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Unit Price: ₹{calculateTotalPrice.toFixed(2)}</span>
            <span className="mx-2">×</span>
            <span>Qty: {orderQuantity}</span>
          </div>
          {layers.length === 0 && (
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Add design elements to enable save</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
        <button
            onClick={() => {
              const productConfig = {
                productId: id,
                design: layers,
                color: selectedOrderColor || '',
                size: selectedOrderSize || '',
                quantity: orderQuantity || 1,
                printType: selectedPrintType,
                position: selectedPosition,
                pricing: {
                  unitPrice: calculateTotalPrice,
                  totalPrice: calculateTotalPrice * orderQuantity
                }
              };
              navigate('/add-product/checkout', {
                state: {
                  productConfig,
                  productData: productData?.data,
                  orderValue: calculateTotalPrice * orderQuantity,
                  unitPrice: calculateTotalPrice
                }
              });
            }}
            disabled={layers.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              layers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>Order Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          <button
            onClick={() => setShowSaveTemplateModal(true)}
          disabled={layers.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            layers.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
            <span>Save as Template</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        </div>
      </div>

      {/* Order Modal - Enhanced with Real-Time Pricing */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Configure Your Order</h3>
                <p className="text-sm text-gray-500 mt-1">Set quantities and variants - pricing updates in real-time</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Configuration */}
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Product Configuration
                  </h4>
                  
                  {/* Product Info */}
                  <div className="mb-3 pb-3 border-b border-blue-200">
                    <p className="text-xs text-blue-700 mb-1">Product</p>
                    <p className="text-sm font-medium text-blue-900">{productData?.data?.title || 'Custom Product'}</p>
                  </div>

                  {/* Design Layers */}
                  <div className="mb-3 pb-3 border-b border-blue-200">
                    <p className="text-xs text-blue-700 mb-1">Design Elements</p>
                    <p className="text-sm font-medium text-blue-900">{layers.length} layer(s)</p>
                  </div>

                  {/* Print Configuration */}
              <div>
                    <p className="text-xs text-blue-700 mb-1">Print Configuration</p>
                    <p className="text-sm font-medium text-blue-900">{selectedPrintType || 'N/A'} - {selectedPosition || 'N/A'}</p>
                  </div>
                </div>

                {/* Variant Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Color <span className="text-red-500">*</span>
                  </label>
                <select
                  value={selectedOrderColor}
                  onChange={(e) => setSelectedOrderColor(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                    <option value="">Choose color...</option>
                  {availableColors.colors.map((color: any) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Size <span className="text-red-500">*</span>
                  </label>
                <select
                  value={selectedOrderSize}
                  onChange={(e) => setSelectedOrderSize(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                    <option value="">Choose size...</option>
                  {availableColors.sizes.map((size: any) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                <input
                  type="number"
                  min="1"
                  value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2.5 text-center text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Real-Time Pricing */}
              <div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-5 sticky top-0">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center text-lg">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Real-Time Pricing
                  </h4>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    {/* Base Product Price */}
                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                      <div>
                        <p className="text-xs text-green-700 font-medium">Base Product Price</p>
                        <p className="text-xs text-green-600">{selectedVariant?.name || 'Select variant'}</p>
                      </div>
                      <p className="text-lg font-bold text-green-900">₹{selectedVariant?.price?.toFixed(2) || '0.00'}</p>
                    </div>

                    {/* Print Costs */}
                    {selectedPrintType && selectedPosition && (() => {
                      const printType = availablePrintTypes.find((pt: any) => pt.name === selectedPrintType);
                      if (printType) {
                        const location = printType.locations?.find((loc: any) => loc.location === selectedPosition);
                        if (location) {
                          const printBasePrice = parseFloat(location.basePrice) || 0;
                          const fontRate = parseFloat(location.fontRate) || 0;
                          
                          return (
                            <div className="pb-3 border-b border-green-200 space-y-2">
                              <p className="text-xs text-green-700 font-medium">Print Charges</p>
                <div className="flex justify-between text-sm">
                                <span className="text-green-700">└ Print Cost:</span>
                                <span className="font-semibold text-green-900">₹{printBasePrice.toFixed(2)}</span>
                </div>
                              {fontRate > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-700">└ Font/Setup:</span>
                                  <span className="font-semibold text-green-900">₹{fontRate.toFixed(2)}</span>
                </div>
                              )}
                </div>
                          );
                        }
                      }
                      return null;
                    })()}

                    {/* Unit Price */}
                    <div className="flex justify-between items-center pb-3 border-b-2 border-green-300">
                      <p className="text-sm font-bold text-green-800">Unit Price:</p>
                      <p className="text-xl font-bold text-green-900">₹{calculateTotalPrice.toFixed(2)}</p>
              </div>

                    {/* Quantity */}
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-green-800">Quantity:</p>
                      <p className="text-lg font-bold text-green-900">× {orderQuantity}</p>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white rounded-lg p-4 mt-4 shadow-md border-2 border-green-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">Order Total</p>
                          <p className="text-xs text-gray-500">Inclusive of all charges</p>
                        </div>
                        <p className="text-3xl font-bold text-green-700">₹{(calculateTotalPrice * orderQuantity).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Breakdown Summary */}
                    <div className="bg-white bg-opacity-50 rounded-lg p-3 mt-3">
                      <p className="text-xs text-gray-600 mb-2 font-semibold">Price Calculation:</p>
                      <p className="text-xs text-gray-700">
                        ({selectedVariant?.price?.toFixed(2) || '0'} + {(() => {
                          const printType = availablePrintTypes.find((pt: any) => pt.name === selectedPrintType);
                          if (printType) {
                            const location = printType.locations?.find((loc: any) => loc.location === selectedPosition);
                            if (location) {
                              const total = (parseFloat(location.basePrice) || 0) + (parseFloat(location.fontRate) || 0);
                              return total.toFixed(2);
                            }
                          }
                          return '0.00';
                        })()}) × {orderQuantity} = ₹{(calculateTotalPrice * orderQuantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save product configuration to database
                  const productConfig = {
                    productId: id,
                    design: layers,
                    color: selectedOrderColor,
                    size: selectedOrderSize,
                    quantity: orderQuantity,
                    printType: selectedPrintType,
                    position: selectedPosition,
                    pricing: {
                      basePrice: selectedVariant?.price || 0,
                      printCost: (() => {
                        const printType = availablePrintTypes.find((pt: any) => pt.name === selectedPrintType);
                        if (printType) {
                          const location = printType.locations?.find((loc: any) => loc.location === selectedPosition);
                          if (location) {
                            return (parseFloat(location.basePrice) || 0) + (parseFloat(location.fontRate) || 0);
                          }
                        }
                        return 0;
                      })(),
                      unitPrice: calculateTotalPrice,
                      totalPrice: calculateTotalPrice * orderQuantity
                    }
                  };
                  
                  // Proceed to checkout step with configuration
                  navigate('/add-product/checkout', {
                    state: { 
                      productConfig,
                      productData: productData?.data,
                      orderValue: calculateTotalPrice * orderQuantity,
                      unitPrice: calculateTotalPrice
                    } 
                  });
                }}
                disabled={!selectedOrderColor || !selectedOrderSize || orderQuantity < 1}
                className={`px-8 py-2.5 rounded-lg font-bold transition-colors flex items-center space-x-2 text-lg ${
                  !selectedOrderColor || !selectedOrderSize || orderQuantity < 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg'
                }`}
              >
                <span>Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Save as Template</h3>
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSavingTemplate}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Summer Collection T-Shirt"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isSavingTemplate}
                  autoFocus
                />
              </div>

              {/* Template Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Add a description for this template..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  disabled={isSavingTemplate}
                />
              </div>

              {/* Template Info Summary */}
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Template Details</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium text-gray-900">{productData?.data?.title || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variant:</span>
                    <span className="font-medium text-gray-900">{selectedVariant?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Print Type:</span>
                    <span className="font-medium text-gray-900">{selectedPrintType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-medium text-gray-900">{selectedPosition || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Design Layers:</span>
                    <span className="font-medium text-gray-900">{layers.length} layer{layers.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSaveTemplateModal(false)}
                  disabled={isSavingTemplate}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={isSavingTemplate || !templateName.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSavingTemplate ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                      <span>Save Template</span>
                    </>
                  )}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}