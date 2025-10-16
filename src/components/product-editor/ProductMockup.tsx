import React from 'react';

export interface ProductMockupProps {
  productType: string;
  color: string;
  view: 'front' | 'back' | 'left-sleeve' | 'right-sleeve' | 'neck-label';
  width?: number;
  height?: number;
  className?: string;
}

// Product mockup SVG components for different product types
const TShirtMockup: React.FC<{ color: string; view: string }> = ({ color, view }) => {
  const baseColor = color === 'white' ? '#ffffff' : 
                   color === 'black' ? '#000000' :
                   color === 'red' ? '#dc2626' :
                   color === 'blue' ? '#2563eb' :
                   color === 'green' ? '#16a34a' : '#ffffff';

  const strokeColor = color === 'white' ? '#e5e7eb' : '#374151';

  if (view === 'front') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* T-shirt body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Neckline */}
        <path
          d="M120 40 Q150 60 180 40"
          fill="none"
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
          height="120"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  }

  if (view === 'back') {
    return (
      <svg viewBox="0 0 300 400" className="w-full h-full">
        {/* T-shirt body */}
        <path
          d="M50 80 L50 120 Q50 140 70 140 L230 140 Q250 140 250 120 L250 80 Q250 60 230 60 L200 60 L200 40 Q200 20 180 20 L120 20 Q100 20 100 40 L100 60 L70 60 Q50 60 50 80 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        {/* Neckline */}
        <path
          d="M120 40 Q150 60 180 40"
          fill="none"
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
          height="120"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  }

  if (view === 'left-sleeve') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        <path
          d="M50 50 Q30 70 50 90 L50 150 Q50 170 70 170 L130 170 Q150 170 150 150 L150 90 Q170 70 150 50 L70 50 Q50 50 50 50 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        <rect
          x="80"
          y="80"
          width="40"
          height="60"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  }

  if (view === 'right-sleeve') {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        <path
          d="M50 50 Q30 70 50 90 L50 150 Q50 170 70 170 L130 170 Q150 170 150 150 L150 90 Q170 70 150 50 L70 50 Q50 50 50 50 Z"
          fill={baseColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        <rect
          x="80"
          y="80"
          width="40"
          height="60"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  }

  return null;
};

const HoodieMockup: React.FC<{ color: string; view: string }> = ({ color, view }) => {
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
      </svg>
    );
  }

  return <TShirtMockup color={color} view={view} />;
};

const TankTopMockup: React.FC<{ color: string; view: string }> = ({ color, view }) => {
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
      </svg>
    );
  }

  return <TShirtMockup color={color} view={view} />;
};

export const ProductMockup: React.FC<ProductMockupProps> = ({
  productType,
  color,
  view,
  width = 300,
  height = 400,
  className = ''
}) => {
  const renderMockup = () => {
    switch (productType.toLowerCase()) {
      case 't-shirt':
      case 'tshirt':
        return <TShirtMockup color={color} view={view} />;
      case 'hoodie':
        return <HoodieMockup color={color} view={view} />;
      case 'tank-top':
      case 'tanktop':
        return <TankTopMockup color={color} view={view} />;
      default:
        return <TShirtMockup color={color} view={view} />;
    }
  };

  return (
    <div 
      className={`product-mockup ${className}`}
      style={{ width, height }}
    >
      {renderMockup()}
    </div>
  );
};

export default ProductMockup;
