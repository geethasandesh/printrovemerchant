import { useState } from 'react';
import { XIcon, SearchIcon } from '@shopify/polaris-icons';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  layers: any[];
}

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Vintage Badge',
    category: 'Badges',
    thumbnail: '/product-img-white.png',
    layers: [],
  },
  {
    id: '2',
    name: 'Modern Typography',
    category: 'Text',
    thumbnail: '/product-img-blue.png',
    layers: [],
  },
  {
    id: '3',
    name: 'Geometric Pattern',
    category: 'Patterns',
    thumbnail: '/product-img-red.png',
    layers: [],
  },
  {
    id: '4',
    name: 'Minimalist Logo',
    category: 'Logos',
    thumbnail: '/product-img-yellow.png',
    layers: [],
  },
  {
    id: '5',
    name: 'Retro Sunset',
    category: 'Graphics',
    thumbnail: '/product-img-white.png',
    layers: [],
  },
  {
    id: '6',
    name: 'Bold Statement',
    category: 'Text',
    thumbnail: '/product-img-blue.png',
    layers: [],
  },
];

const CATEGORIES = ['All', 'Badges', 'Text', 'Patterns', 'Logos', 'Graphics'];

export function TemplateLibraryModal({ isOpen, onClose, onSelectTemplate }: TemplateLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  if (!isOpen) return null;
  
  const filteredTemplates = SAMPLE_TEMPLATES.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-4">Template Library</h3>
            
            {/* Search */}
            <div className="relative">
              <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-[#3a3a3a] rounded-lg transition text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Categories */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#3a3a3a] overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Templates Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {filteredTemplates.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">No templates found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-[#3a3a3a] hover:ring-2 hover:ring-blue-500 transition"
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition text-center px-4">
                      <p className="text-white font-medium mb-1">{template.name}</p>
                      <p className="text-gray-300 text-sm">{template.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#3a3a3a]">
          <p className="text-sm text-gray-400">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg text-sm transition text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

