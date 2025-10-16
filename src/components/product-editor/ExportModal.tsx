import { useState } from 'react';
import { XIcon } from '@shopify/polaris-icons';

const DownloadIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'jpg' | 'svg' | 'pdf', quality: number, scale: number) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format, quality / 100, scale);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <h3 className="text-lg font-semibold text-white">Export Design</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3a3a] rounded-lg transition text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm text-gray-300 block mb-3">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              {['png', 'jpg'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt as 'png' | 'jpg')}
                  className={`p-4 rounded-lg border-2 transition ${
                    format === fmt
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500 bg-[#3a3a3a]'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-white font-medium uppercase">{fmt}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {fmt === 'png' ? 'Transparent background' : 'Smaller file size'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-3">
              {['svg', 'pdf'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt as 'svg' | 'pdf')}
                  disabled
                  className={`p-4 rounded-lg border-2 transition opacity-50 cursor-not-allowed ${
                    format === fmt
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 bg-[#3a3a3a]'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-white font-medium uppercase">{fmt}</p>
                    <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Quality (for JPG only) */}
          {format === 'jpg' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-300">Quality</label>
                <span className="text-xs text-gray-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller</span>
                <span>Better quality</span>
              </div>
            </div>
          )}
          
          {/* Scale/Resolution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">Resolution</label>
              <span className="text-xs text-gray-400">{scale}x</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`py-2 px-3 rounded-lg text-sm transition ${
                    scale === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Higher resolution = better quality but larger file size
            </p>
          </div>
          
          {/* Preview Info */}
          <div className="p-4 bg-[#3a3a3a] rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Format:</span>
                <span className="text-white font-medium uppercase">{format}</span>
              </div>
              {format === 'jpg' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-white font-medium">{quality}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Resolution:</span>
                <span className="text-white font-medium">{scale}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated size:</span>
                <span className="text-white font-medium">
                  {format === 'png' ? `${Math.round(scale * 500)}KB - ${Math.round(scale * 2000)}KB` : `${Math.round(scale * 200)}KB - ${Math.round(scale * 800)}KB`}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3a3a3a]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition text-white flex items-center gap-2 disabled:opacity-50"
          >
            <DownloadIcon className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}

