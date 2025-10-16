import { useRef, useState, DragEvent } from 'react';
import { ImageIcon } from '@shopify/polaris-icons';

const UploadIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function DragDropUpload({
  onFileSelect,
  accept = 'image/*',
  maxSizeMB = 10,
  className = '',
}: DragDropUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };
  
  const handleFile = (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onFileSelect(file);
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center
          min-h-[200px]
          ${
            isDragging
              ? 'border-blue-500 bg-blue-500 bg-opacity-10'
              : 'border-gray-600 hover:border-gray-500 bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }
          ${error ? 'border-red-500' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {isDragging ? (
            <>
              <UploadIcon className="w-12 h-12 text-blue-500 animate-bounce" />
              <p className="text-blue-500 font-medium">Drop your image here</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-gray-400" />
              
              <div>
                <p className="text-white font-medium mb-1">
                  Drop your image here or click to browse
                </p>
                <p className="text-gray-400 text-sm">
                  Supports: JPG, PNG, GIF, WebP (Max {maxSizeMB}MB)
                </p>
              </div>
              
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
              >
                Choose File
              </button>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

