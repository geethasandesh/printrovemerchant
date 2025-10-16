import { useState, useEffect } from 'react';
import { XIcon, CheckIcon } from '@shopify/polaris-icons';

interface TextEditorModalProps {
  isOpen: boolean;
  initialText: string;
  initialFontSize: number;
  initialFontFamily: string;
  initialColor: string;
  initialFontWeight: string;
  initialTextAlign: 'left' | 'center' | 'right';
  onClose: () => void;
  onSave: (textData: TextData) => void;
}

export interface TextData {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  fontStyle: 'normal' | 'italic';
}

const FONT_FAMILIES = [
  'Arial',
  'Arial Black',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Comic Sans MS',
  'Helvetica',
  'Lucida Sans',
  'Palatino',
  'Century Gothic',
  'Copperplate',
  'Papyrus',
];

export function TextEditorModal({
  isOpen,
  initialText,
  initialFontSize,
  initialFontFamily,
  initialColor,
  initialFontWeight,
  initialTextAlign,
  onClose,
  onSave,
}: TextEditorModalProps) {
  const [textData, setTextData] = useState<TextData>({
    text: initialText,
    fontSize: initialFontSize,
    fontFamily: initialFontFamily,
    color: initialColor,
    fontWeight: initialFontWeight,
    textAlign: initialTextAlign,
    letterSpacing: 0,
    lineHeight: 1.2,
    textTransform: 'none',
    textDecoration: 'none',
    fontStyle: 'normal',
  });
  
  useEffect(() => {
    if (isOpen) {
      setTextData({
        text: initialText,
        fontSize: initialFontSize,
        fontFamily: initialFontFamily,
        color: initialColor,
        fontWeight: initialFontWeight,
        textAlign: initialTextAlign,
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: 'none',
        textDecoration: 'none',
        fontStyle: 'normal',
      });
    }
  }, [isOpen, initialText, initialFontSize, initialFontFamily, initialColor, initialFontWeight, initialTextAlign]);
  
  const handleSave = () => {
    onSave(textData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  const previewStyle = {
    fontFamily: textData.fontFamily,
    fontSize: `${textData.fontSize}px`,
    color: textData.color,
    fontWeight: textData.fontWeight,
    textAlign: textData.textAlign,
    letterSpacing: `${textData.letterSpacing}px`,
    lineHeight: textData.lineHeight,
    textTransform: textData.textTransform,
    textDecoration: textData.textDecoration,
    fontStyle: textData.fontStyle,
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h3 className="text-lg font-semibold text-white">Edit Text</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3a3a3a] rounded-lg transition text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#1a1a1a] overflow-auto">
            <div
              className="max-w-full p-8 bg-white rounded-lg"
              style={previewStyle as any}
            >
              {textData.text || 'Enter your text...'}
            </div>
          </div>
          
          {/* Controls */}
          <div className="w-96 bg-[#252525] p-6 overflow-auto">
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Text Content</label>
                <textarea
                  value={textData.text}
                  onChange={(e) => setTextData({ ...textData, text: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg text-white text-sm resize-none"
                  rows={4}
                  placeholder="Enter your text..."
                />
              </div>
              
              {/* Font Family */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Font Family</label>
                <select
                  value={textData.fontFamily}
                  onChange={(e) => setTextData({ ...textData, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg text-white text-sm"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Font Size</label>
                  <span className="text-xs text-gray-400">{textData.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={textData.fontSize}
                  onChange={(e) => setTextData({ ...textData, fontSize: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              {/* Color */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textData.color}
                    onChange={(e) => setTextData({ ...textData, color: e.target.value })}
                    className="w-16 h-10 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textData.color}
                    onChange={(e) => setTextData({ ...textData, color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg text-white text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              {/* Font Weight */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Font Weight</label>
                <div className="grid grid-cols-3 gap-2">
                  {['normal', 'bold', '300', '400', '500', '600', '700', '800', '900'].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setTextData({ ...textData, fontWeight: weight })}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        textData.fontWeight === weight
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                      }`}
                      style={{ fontWeight: weight }}
                    >
                      {weight === 'normal' ? 'Regular' : weight === 'bold' ? 'Bold' : weight}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Text Align */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Text Align</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setTextData({ ...textData, textAlign: align })}
                      className={`px-3 py-2 rounded-lg text-sm transition capitalize ${
                        textData.textAlign === align
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Font Style */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Font Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTextData({ ...textData, fontStyle: textData.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                      textData.fontStyle === 'italic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                    }`}
                  >
                    Italic
                  </button>
                </div>
              </div>
              
              {/* Text Transform */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Text Transform</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((transform) => (
                    <button
                      key={transform}
                      onClick={() => setTextData({ ...textData, textTransform: transform })}
                      className={`px-3 py-2 rounded-lg text-sm transition capitalize ${
                        textData.textTransform === transform
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                      }`}
                    >
                      {transform}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Text Decoration */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">Text Decoration</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'underline', 'line-through'] as const).map((decoration) => (
                    <button
                      key={decoration}
                      onClick={() => setTextData({ ...textData, textDecoration: decoration })}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        textData.textDecoration === decoration
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
                      }`}
                    >
                      {decoration === 'none' ? 'None' : decoration === 'underline' ? 'U' : 'S'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Letter Spacing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Letter Spacing</label>
                  <span className="text-xs text-gray-400">{textData.letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="20"
                  step="0.1"
                  value={textData.letterSpacing}
                  onChange={(e) => setTextData({ ...textData, letterSpacing: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              {/* Line Height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300">Line Height</label>
                  <span className="text-xs text-gray-400">{textData.lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={textData.lineHeight}
                  onChange={(e) => setTextData({ ...textData, lineHeight: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
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

