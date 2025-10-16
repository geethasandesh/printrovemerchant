import React from 'react';

// Product name to model mapping
export interface ProductModelConfig {
  type: 'tshirt' | 'hoodie' | 'tank-top' | 'polo' | 'sweatshirt' | 'long-sleeve' | 'cap' | 'mug' | 'tote-bag';
  color: string;
  size: string;
  printAreas: {
    front: { x: number; y: number; width: number; height: number };
    back: { x: number; y: number; width: number; height: number };
    leftSleeve?: { x: number; y: number; width: number; height: number };
    rightSleeve?: { x: number; y: number; width: number; height: number };
    neckLabel?: { x: number; y: number; width: number; height: number };
  };
}

// Parse product name to determine model type
export function parseProductName(productName: string): ProductModelConfig['type'] {
  const name = productName.toLowerCase();
  
  if (name.includes('hoodie') || name.includes('sweatshirt')) return 'hoodie';
  if (name.includes('tank') || name.includes('tank-top')) return 'tank-top';
  if (name.includes('polo')) return 'polo';
  if (name.includes('long sleeve') || name.includes('long-sleeve')) return 'long-sleeve';
  if (name.includes('cap') || name.includes('hat')) return 'cap';
  if (name.includes('mug') || name.includes('cup')) return 'mug';
  if (name.includes('tote') || name.includes('bag')) return 'tote-bag';
  
  // Default to t-shirt
  return 'tshirt';
}

// Extract color from product name
export function extractColorFromName(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('white')) return 'white';
  if (name.includes('black')) return 'black';
  if (name.includes('red')) return 'red';
  if (name.includes('blue')) return 'blue';
  if (name.includes('green')) return 'green';
  if (name.includes('yellow')) return 'yellow';
  if (name.includes('pink')) return 'pink';
  if (name.includes('gray') || name.includes('grey')) return 'gray';
  
  return 'white'; // Default color
}

// Extract size from product name
export function extractSizeFromName(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('xs')) return 'XS';
  if (name.includes('s ')) return 'S';
  if (name.includes('m ')) return 'M';
  if (name.includes('l ')) return 'L';
  if (name.includes('xl')) return 'XL';
  if (name.includes('xxl')) return 'XXL';
  
  return 'M'; // Default size
}

// Realistic T-Shirt Model Component (Printify Style)
const TShirtModel: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = '#000000';
  const shadowColor = color === 'white' ? '#f0f0f0' : '#333333';
  const neckbandColor = color === 'white' ? '#e8e8e8' : '#444444';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Background */}
        <rect width="300" height="400" fill="#f5f5f5" />
        
        {/* T-shirt shadow/outline */}
        <path
          d="M40 70 L40 110 Q40 130 60 130 L240 130 Q260 130 260 110 L260 70 Q260 50 240 50 L210 50 L210 30 Q210 10 190 10 L110 10 Q90 10 90 30 L90 50 L60 50 Q40 50 40 70 Z"
          fill={shadowColor}
          stroke="none"
        />
        
        {/* T-shirt body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Neckband (ribbed texture) */}
        <path
          d="M120 40 Q150 60 180 40"
          fill={neckbandColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Left sleeve */}
        <path
          d="M50 120 Q30 140 50 160 L50 180 Q50 200 70 200 L70 160 Q70 140 50 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Right sleeve */}
        <path
          d="M250 120 Q270 140 250 160 L250 180 Q250 200 230 200 L230 160 Q230 140 250 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Sleeve cuffs stitching */}
        <line x1="50" y1="180" x2="70" y2="180" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="50" y1="185" x2="70" y2="185" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="230" y1="180" x2="250" y2="180" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="230" y1="185" x2="250" y2="185" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Bottom hem stitching */}
        <line x1="70" y1="140" x2="230" y2="140" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="70" y1="145" x2="230" y2="145" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Print area - Perfect rectangle for printing */}
        <rect
          x="110"
          y="90"
          width="80"
          height="100"
          fill="none"
          stroke="#999999"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        
        {/* Print area label */}
        <text x="150" y="200" textAnchor="middle" fontSize="10" fill="#666666">
          Perfect place for printing
        </text>
      </svg>
    );
  }

  if (view === 'back') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Background */}
        <rect width="300" height="400" fill="#f5f5f5" />
        
        {/* T-shirt shadow/outline */}
        <path
          d="M40 70 L40 110 Q40 130 60 130 L240 130 Q260 130 260 110 L260 70 Q260 50 240 50 L210 50 L210 30 Q210 10 190 10 L110 10 Q90 10 90 30 L90 50 L60 50 Q40 50 40 70 Z"
          fill={shadowColor}
          stroke="none"
        />
        
        {/* T-shirt body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Neckband (ribbed texture) */}
        <path
          d="M120 40 Q150 60 180 40"
          fill={neckbandColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Left sleeve */}
        <path
          d="M50 120 Q30 140 50 160 L50 180 Q50 200 70 200 L70 160 Q70 140 50 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Right sleeve */}
        <path
          d="M250 120 Q270 140 250 160 L250 180 Q250 200 230 200 L230 160 Q230 140 250 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Sleeve cuffs stitching */}
        <line x1="50" y1="180" x2="70" y2="180" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="50" y1="185" x2="70" y2="185" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="230" y1="180" x2="250" y2="180" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="230" y1="185" x2="250" y2="185" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Bottom hem stitching */}
        <line x1="70" y1="140" x2="230" y2="140" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="70" y1="145" x2="230" y2="145" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Print area - Perfect rectangle for printing */}
        <rect
          x="110"
          y="90"
          width="80"
          height="100"
          fill="none"
          stroke="#999999"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        
        {/* Print area label */}
        <text x="150" y="200" textAnchor="middle" fontSize="10" fill="#666666">
          Perfect place for printing
        </text>
      </svg>
    );
  }

  if (view === 'left-sleeve') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        {/* Background */}
        <rect width="200" height="300" fill="#f5f5f5" />
        
        {/* Sleeve shadow */}
        <path
          d="M40 40 Q20 60 40 80 L40 140 Q40 160 60 160 L140 160 Q160 160 160 140 L160 80 Q180 60 160 40 L60 40 Q40 40 40 40 Z"
          fill={shadowColor}
          stroke="none"
        />
        
        {/* Sleeve body */}
        <path
          d="M50 50 Q30 70 50 90 L50 150 Q50 170 70 170 L130 170 Q150 170 150 150 L150 90 Q170 70 150 50 L70 50 Q50 50 50 50 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Sleeve cuff stitching */}
        <line x1="50" y1="150" x2="150" y2="150" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="50" y1="155" x2="150" y2="155" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Print area */}
        <rect
          x="80"
          y="80"
          width="40"
          height="60"
          fill="none"
          stroke="#999999"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        
        <text x="100" y="30" textAnchor="middle" fontSize="10" fill="#666666">
          Left Sleeve
        </text>
      </svg>
    );
  }

  if (view === 'right-sleeve') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        {/* Background */}
        <rect width="200" height="300" fill="#f5f5f5" />
        
        {/* Sleeve shadow */}
        <path
          d="M40 40 Q20 60 40 80 L40 140 Q40 160 60 160 L140 160 Q160 160 160 140 L160 80 Q180 60 160 40 L60 40 Q40 40 40 40 Z"
          fill={shadowColor}
          stroke="none"
        />
        
        {/* Sleeve body */}
        <path
          d="M50 50 Q30 70 50 90 L50 150 Q50 170 70 170 L130 170 Q150 170 150 150 L150 90 Q170 70 150 50 L70 50 Q50 50 50 50 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Sleeve cuff stitching */}
        <line x1="50" y1="150" x2="150" y2="150" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="50" y1="155" x2="150" y2="155" stroke="#999999" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Print area */}
        <rect
          x="80"
          y="80"
          width="40"
          height="60"
          fill="none"
          stroke="#999999"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        
        <text x="100" y="30" textAnchor="middle" fontSize="10" fill="#666666">
          Right Sleeve
        </text>
      </svg>
    );
  }

  return null;
};

// Enhanced 2D Hoodie Model Component
const HoodieModel: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = color === 'white' ? '#e5e7eb' : '#374151';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Hoodie body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Hood */}
        <path
          d="M120 40 Q100 20 80 40 Q80 60 100 80 Q120 100 140 80 Q160 60 160 40 Q140 20 120 40"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Kangaroo pocket */}
        <path
          d="M100 200 Q100 180 120 180 L180 180 Q200 180 200 200 L200 240 Q200 260 180 260 L120 260 Q100 260 100 240 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Sleeves */}
        <path
          d="M50 120 Q30 140 50 160 L50 180 Q50 200 70 200 L70 160 Q70 140 50 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        <path
          d="M250 120 Q270 140 250 160 L250 180 Q250 200 230 200 L230 160 Q230 140 250 120"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Print area indicator */}
        <rect
          x="100"
          y="100"
          width="100"
          height="80"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        {/* Product label */}
        <text x="150" y="30" textAnchor="middle" fontSize="12" fill="#666666">
          Black Hoodie with Pocket
        </text>
      </svg>
    );
  }

  return <TShirtModel color={color} view={view} />;
};

// Enhanced 2D Tank Top Model Component
const TankTopModel: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = color === 'white' ? '#e5e7eb' : '#374151';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Tank top body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Straps */}
        <path
          d="M120 40 Q110 20 100 40"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
        />
        <path
          d="M180 40 Q190 20 200 40"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
        />
        {/* Print area indicator */}
        <rect
          x="100"
          y="100"
          width="100"
          height="120"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        {/* Product label */}
        <text x="150" y="30" textAnchor="middle" fontSize="12" fill="#666666">
          Red Tank Top Women's
        </text>
      </svg>
    );
  }

  return <TShirtModel color={color} view={view} />;
};

// Enhanced 2D Cap Model Component
const CapModel: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = color === 'white' ? '#e5e7eb' : '#374151';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Cap crown */}
        <ellipse
          cx="150"
          cy="120"
          rx="80"
          ry="60"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Cap bill */}
        <ellipse
          cx="150"
          cy="180"
          rx="100"
          ry="20"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Print area indicator */}
        <rect
          x="100"
          y="80"
          width="100"
          height="60"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        {/* Product label */}
        <text x="150" y="30" textAnchor="middle" fontSize="12" fill="#666666">
          Blue Baseball Cap
        </text>
      </svg>
    );
  }

  return <TShirtModel color={color} view={view} />;
};

// Enhanced 2D Mug Model Component
const MugModel: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = color === 'white' ? '#e5e7eb' : '#374151';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* Mug body */}
        <rect
          x="80"
          y="100"
          width="140"
          height="200"
          rx="10"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Mug handle */}
        <path
          d="M220 150 Q260 150 260 200 Q260 250 220 250"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Print area indicator */}
        <rect
          x="100"
          y="120"
          width="100"
          height="160"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        {/* Product label */}
        <text x="150" y="50" textAnchor="middle" fontSize="12" fill="#666666">
          White Ceramic Mug
        </text>
      </svg>
    );
  }

  return <TShirtModel color={color} view={view} />;
};

// Main Enhanced 2D Product Model Component
export const ProductModelMapper: React.FC<{
  productName: string;
  view: 'front' | 'back' | 'left-sleeve' | 'right-sleeve' | 'neck-label';
  width?: number;
  height?: number;
}> = ({ productName, view, width = 400, height = 500 }) => {
  const modelType = parseProductName(productName);
  const color = extractColorFromName(productName);
  
  const renderModel = () => {
    switch (modelType) {
      case 'tshirt':
        return <TShirtModel color={color} view={view} />;
      case 'hoodie':
        return <HoodieModel color={color} view={view} />;
      case 'tank-top':
        return <TankTopModel color={color} view={view} />;
      case 'cap':
        return <CapModel color={color} view={view} />;
      case 'mug':
        return <MugModel color={color} view={view} />;
      default:
        return <TShirtModel color={color} view={view} />;
    }
  };

  return (
    <div 
      className="product-model bg-gray-100 rounded-lg flex items-center justify-center"
      style={{ width, height }}
    >
      {renderModel()}
    </div>
  );
};

export default ProductModelMapper;