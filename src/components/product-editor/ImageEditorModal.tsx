import { useState, useRef, useEffect } from 'react';
import { XIcon, CheckIcon } from '@shopify/polaris-icons';

interface ImageEditorModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (editedImage: string, filters: ImageFilters) => void;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

export function ImageEditorModal({ isOpen, imageSrc, onClose, onSave }: ImageEditorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });
  
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  
  const [activeTab, setActiveTab] = useState<'filters' | 'crop'>('filters');
  
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters
      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hueRotate}deg)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
        invert(${filters.invert}%)
      `;
      
      ctx.drawImage(img, 0, 0);
      
      // Draw crop overlay if in crop mode
      if (activeTab === 'crop') {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          (crop.x / 100) * img.width,
          (crop.y / 100) * img.height,
          (crop.width / 100) * img.width,
          (crop.height / 100) * img.height
        );
      }
    };
    img.src = imageSrc;
  }, [imageSrc, filters, crop, activeTab, isOpen]);
  
  const handleSave = () => {
    if (!canvasRef.current) return;
    const editedImage = canvasRef.current.toDataURL('image/png');
    onSave(editedImage, filters);
  };
  
  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h3 className="text-lg font-semibold text-white">Edit Image</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3a3a] rounded-lg transition text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3a]">
          <button
            onClick={() => setActiveTab('filters')}
            className={`px-6 py-3 text-sm font-medium transition ${
              activeTab === 'filters'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Filters
          </button>
          <button
            onClick={() => setActiveTab('crop')}
            className={`px-6 py-3 text-sm font-medium transition ${
              activeTab === 'crop'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Crop
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#1a1a1a] overflow-auto">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border border-[#3a3a3a] rounded"
            />
          </div>
          
          {/* Controls */}
          <div className="w-80 bg-[#252525] p-6 overflow-auto">
            {activeTab === 'filters' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Brightness</label>
                    <span className="text-xs text-gray-400">{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Contrast</label>
                    <span className="text-xs text-gray-400">{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Saturation</label>
                    <span className="text-xs text-gray-400">{filters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Blur</label>
                    <span className="text-xs text-gray-400">{filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.blur}
                    onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Hue Rotate</label>
                    <span className="text-xs text-gray-400">{filters.hueRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={filters.hueRotate}
                    onChange={(e) => setFilters({ ...filters, hueRotate: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Grayscale</label>
                    <span className="text-xs text-gray-400">{filters.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={(e) => setFilters({ ...filters, grayscale: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Sepia</label>
                    <span className="text-xs text-gray-400">{filters.sepia}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={(e) => setFilters({ ...filters, sepia: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-300">Invert</label>
                    <span className="text-xs text-gray-400">{filters.invert}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.invert}
                    onChange={(e) => setFilters({ ...filters, invert: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}
            
            {activeTab === 'crop' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-400">
                  Adjust the crop area using the sliders below. The blue dashed box on the image shows the crop area.
                </p>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-2">X Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crop.x}
                    onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{crop.x}%</span>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Y Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crop.y}
                    onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{crop.y}%</span>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Width</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={crop.width}
                    onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{crop.width}%</span>
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Height</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={crop.height}
                    onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{crop.height}%</span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 100 })}
                    className="w-full px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
                  >
                    Reset Crop
                  </button>
                  
                  <button
                    onClick={() => setCrop({ x: 25, y: 25, width: 50, height: 50 })}
                    className="w-full px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
                  >
                    Center 50%
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#3a3a3a]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition text-white flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

