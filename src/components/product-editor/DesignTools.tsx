import React, { useState } from 'react';
import { 
  DocumentIcon
} from './PrintifyIcons';

export interface UploadedFile {
  id: string;
  name: string;
  preview: string;
  size: number;
}

interface UploadToolProps {
  onImageUpload: (dataUrl: string, filename: string) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const UploadTool: React.FC<UploadToolProps> = ({ 
  onImageUpload, 
  uploadedFiles, 
  setUploadedFiles 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      alert('Please upload a valid image file (JPG, PNG, SVG)');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      alert('File size must be less than 10MB');
      return;
    }

    console.log('✅ File validation passed, starting upload...');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('✅ Preview generated, length:', result.length);
      
      // Simulate processing time
      setTimeout(() => {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          preview: result,
          size: file.size
        };

        console.log('✅ Adding file to uploadedFiles:', file.name);
        setUploadedFiles(prev => {
          console.log('📊 Current files:', prev.length, '→ New total:', prev.length + 1);
          return [...prev, newFile];
        });
        
        console.log('✅ Upload complete!');
        setIsUploading(false);
      }, 1000);
    };

    reader.onerror = () => {
      console.error('❌ FileReader error');
      alert('Failed to read the file');
      setIsUploading(false);
    };

    console.log('📖 Starting FileReader...');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileSelect);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-4">Files</h3>
      
        {/* Simple Add Button */}
        <label className="inline-block w-full">
      <div
            className={`border-2 border-dashed rounded-lg p-2 text-center transition cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
            <span className="text-sm text-blue-600 font-medium">
              {isUploading ? 'Uploading...' : '+ Add Image'}
            </span>
          </div>
        <input
          type="file"
            accept="image/jpeg,image/png,image/svg+xml"
            multiple
          onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => handleFileSelect(file));
              e.target.value = '';
          }}
          className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {/* Uploaded Files Gallery */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 flex-1 overflow-hidden flex flex-col">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
              {uploadedFiles.map((uploadedFile, index) => {
                // Get file type from name
                const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
                const fileType = fileExtension === 'svg' ? 'SVG' : 
                               fileExtension === 'png' ? 'PNG' : 
                               fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'JPEG' : 'Image';
                
                return (
                  <div key={uploadedFile.id || index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-400 transition-all duration-200 group">
                    {/* Clickable Thumbnail */}
                    <div 
                      className="aspect-square cursor-pointer relative overflow-hidden"
                      onClick={() => onImageUpload(uploadedFile.preview, uploadedFile.name)}
                      title="Click to add to design"
                    >
                      <img 
                        src={uploadedFile.preview} 
                        alt={uploadedFile.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* File type badge */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {fileType}
                      </div>
                    </div>
                    
                    {/* File Information */}
                    <div className="p-2">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-xs text-gray-800 truncate flex-1 mr-1" title={uploadedFile.name}>
                          {uploadedFile.name}
                        </p>
                        <span className="text-[10px] text-gray-500 flex-shrink-0">
                          {formatFileSize(uploadedFile.size)}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 mt-2">
                        <button 
                          onClick={() => onImageUpload(uploadedFile.preview, uploadedFile.name)}
                          className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition font-medium"
                          title="Add to design"
                        >
                          Use
                        </button>
                        <button 
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter(f => f.id !== uploadedFile.id));
                          }}
                          className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition font-medium"
                          title="Remove file"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
      </div>
      
            {/* Gallery Footer Info */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-[11px] text-gray-500 text-center">
                💡 Click any thumbnail to add it to your design
              </p>
            </div>
          </div>
        )}

        {/* Uploading State */}
        {isUploading && (
          <div className="mt-4 flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-sm text-blue-700">Processing and optimizing image...</span>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Tool Component
export const AITool: React.FC<{ onAIGenerate: (prompt: string) => void }> = ({ onAIGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await onAIGenerate(prompt);
      setPrompt('');
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your design idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Create a vintage logo with mountains and a sunset'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Design'}
        </button>
      </div>
    </div>
  );
};

// Text Tool Component
export const TextTool: React.FC<{ onTextAdd: (text: string, style: any) => void }> = ({ onTextAdd }) => {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontWeight, setFontWeight] = useState('Regular');
  const [fontSize, setFontSize] = useState('24');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState('#000000');

  const fontFamilies = [
    'Inter',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Poppins',
    'Lato',
    'Source Sans Pro',
    'Playfair Display',
    'Merriweather',
    'Oswald',
    'Raleway'
  ];

  const fontWeights = [
    'Light',
    'Regular',
    'Medium',
    'Semi Bold',
    'Bold',
    'Extra Bold',
    'Black'
  ];

  const fontSizes = [
    '12', '14', '16', '18', '20', '22', '24', '26', '28', '30',
    '32', '36', '40', '44', '48', '52', '56', '60', '64', '72'
  ];

  const handleAddText = () => {
    if (text.trim()) {
      onTextAdd(text.trim(), { 
        fontSize: parseInt(fontSize), 
        fontFamily: fontFamily, 
        color: textColor, 
        fontWeight: fontWeight.toLowerCase().replace(' ', ''),
        textAlign: textAlign,
        isBold: isBold,
        isItalic: isItalic,
        isUnderline: isUnderline
      });
      setText('');
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add Text</h3>
      <div className="space-y-4">
        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add Text Here"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
        
        {/* Text Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <div className="flex items-center space-x-3">
            {/* Color Picker */}
          <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
              title="Select text color"
            />
            
            {/* Color Preview Swatch */}
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: textColor }}
                title="Color preview"
              ></div>
              
              {/* Hex Code Display */}
              <div className="flex items-center space-x-1">
                <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {textColor.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">hex</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Font Configuration */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Font Configuration</h4>
          
          {/* Font Family */}
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
            Font Family
          </label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
          </select>
        </div>
        
          {/* Font Weight */}
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
            Font Weight
          </label>
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontWeights.map(weight => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
          </select>
        </div>
        
          {/* Text Alignment */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Text Alignment
            </label>
            <div className="flex space-x-1">
              <button
                onClick={() => setTextAlign('left')}
                className={`flex-1 p-2 border rounded-lg transition ${
                  textAlign === 'left'
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
                onClick={() => setTextAlign('center')}
                className={`flex-1 p-2 border rounded-lg transition ${
                  textAlign === 'center'
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
                onClick={() => setTextAlign('right')}
                className={`flex-1 p-2 border rounded-lg transition ${
                  textAlign === 'right'
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

          {/* Text Styling */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Text Styling
            </label>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`flex-1 p-2 border rounded-lg transition font-bold ${
                  isBold
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`flex-1 p-2 border rounded-lg transition italic ${
                  isItalic
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`flex-1 p-2 border rounded-lg transition underline ${
                  isUnderline
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}
                title="Underline"
              >
                U
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {text.trim() && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Preview
            </label>
            <div 
              className={`break-words ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
              style={{
                fontFamily: fontFamily,
                fontWeight: fontWeight.toLowerCase().replace(' ', ''),
                fontSize: `${fontSize}px`,
                textAlign: textAlign as React.CSSProperties['textAlign'],
                color: textColor
              }}
            >
              {text}
            </div>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddText}
          disabled={!text.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Add Text to Design
        </button>
      </div>
    </div>
  );
};

// Templates Tool Component
export const TemplatesTool: React.FC<{ onTemplateSelect: (template: any) => void }> = ({ onTemplateSelect }) => {
  const templates = [
    { id: 1, name: 'Business Logo', thumbnail: '/templates/business-logo.png' },
    { id: 2, name: 'Holiday Design', thumbnail: '/templates/holiday-design.png' },
    { id: 3, name: 'Sports Team', thumbnail: '/templates/sports-team.png' },
    { id: 4, name: 'Vintage Style', thumbnail: '/templates/vintage-style.png' },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Templates</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition text-left"
          >
            <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
              <DocumentIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">{template.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Branding Tool Component
interface BrandingElements {
  innerNecklabel: boolean;
  outerNecklabel: boolean;
  hangTag: boolean;
}

interface BrandingToolProps {
  brandingElements: BrandingElements;
  setBrandingElements: React.Dispatch<React.SetStateAction<BrandingElements>>;
}

export const BrandingTool: React.FC<BrandingToolProps> = ({ 
  brandingElements, 
  setBrandingElements 
}) => {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const toggleBrandingElement = (element: keyof BrandingElements) => {
    setBrandingElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const handleResetToDefaults = () => {
    setBrandingElements({
      innerNecklabel: false,
      outerNecklabel: false,
      hangTag: false
    });
    setShowResetConfirmation(true);
    // Hide confirmation after 3 seconds
    setTimeout(() => setShowResetConfirmation(false), 3000);
  };

  const brandingOptions = [
    {
      id: 'innerNecklabel' as keyof BrandingElements,
      name: 'Inner Necklabel',
      description: 'Brand label inside the neck area',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      id: 'outerNecklabel' as keyof BrandingElements,
      name: 'Outer Necklabel',
      description: 'Brand label on the outside neck area',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      id: 'hangTag' as keyof BrandingElements,
      name: 'Hang Tag',
      description: 'Branded hang tag attached to the product',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Custom Branding</h3>
      <p className="text-sm text-gray-600 mb-6">
        Configure custom branding elements for your products
      </p>
      
      <div className="space-y-4">
        {brandingOptions.map((option) => (
          <div key={option.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {option.icon}
                </div>
        <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {option.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {option.description}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => toggleBrandingElement(option.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  brandingElements[option.id]
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
                aria-pressed={brandingElements[option.id]}
                aria-label={`Toggle ${option.name}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    brandingElements[option.id]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
        </div>
        
            {/* Visual confirmation */}
            {brandingElements[option.id] && (
              <div className="mt-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-blue-600 font-medium">
                  {option.name} enabled
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">
          Active Branding Elements
        </h5>
        <div className="text-xs text-blue-700">
          {Object.values(brandingElements).filter(Boolean).length === 0 ? (
            <span>No branding elements enabled</span>
          ) : (
            <ul className="space-y-1">
              {brandingOptions
                .filter(option => brandingElements[option.id])
                .map(option => (
                  <li key={option.id} className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>{option.name}</span>
                  </li>
                ))
              }
            </ul>
          )}
        </div>
        </div>
        
      {/* Reset Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
            <button
          onClick={handleResetToDefaults}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset To Default Settings</span>
            </button>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirmation && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Settings have been reset to default
            </span>
        </div>
      </div>
      )}
    </div>
  );
};

// Collections Tool Component
export const CollectionsTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-collections' | 'library'>('my-collections');

  // My Collections - Personal saved designs
  const myCollections = [
    { id: 1, name: 'My Designs', count: 12, type: 'personal', description: 'Your custom designs' },
    { id: 2, name: 'Favorites', count: 8, type: 'personal', description: 'Starred designs' },
    { id: 3, name: 'Recent', count: 5, type: 'personal', description: 'Recently edited' },
  ];

  // Library - Shared templates and resources
  const libraryCollections = [
    { id: 4, name: 'Brand Templates', count: 15, type: 'shared', description: 'Pre-made brand templates' },
    { id: 5, name: 'Seasonal Designs', count: 20, type: 'shared', description: 'Holiday and seasonal themes' },
    { id: 6, name: 'Typography Sets', count: 10, type: 'shared', description: 'Font combinations' },
    { id: 7, name: 'Graphics Library', count: 30, type: 'shared', description: 'Stock graphics and icons' },
  ];

  const currentCollections = activeTab === 'my-collections' ? myCollections : libraryCollections;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Collections</h3>
      
      {/* Two-Tab Interface */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-collections')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-collections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Collections
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Library
          </button>
        </div>
      </div>

      {/* Collections List */}
      <div className="space-y-2">
        {currentCollections.map((collection) => (
          <button
            key={collection.id}
            className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activeTab === 'my-collections' ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  {activeTab === 'my-collections' ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                    {collection.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {collection.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{collection.count}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab Information */}
      <div className="mt-6 p-3 rounded-lg" style={{
        backgroundColor: activeTab === 'my-collections' ? 'rgb(239 246 255)' : 'rgb(240 253 244)',
      }}>
        <div className="flex items-start space-x-2">
          <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
            activeTab === 'my-collections' ? 'text-blue-600' : 'text-green-600'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className={`text-sm font-medium ${
              activeTab === 'my-collections' ? 'text-blue-900' : 'text-green-900'
            }`}>
              {activeTab === 'my-collections' ? 'Personal Collections' : 'Shared Library'}
            </p>
            <p className={`text-xs mt-1 ${
              activeTab === 'my-collections' ? 'text-blue-700' : 'text-green-700'
            }`}>
              {activeTab === 'my-collections' 
                ? 'Your personal designs, favorites, and recent projects. Private to you.'
                : 'Shared templates, design resources, and pre-made assets available to all users.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main DesignTools object
export const DesignTools = {
  UploadTool,
  AITool,
  TextTool,
  TemplatesTool,
  BrandingTool,
  CollectionsTool,
};