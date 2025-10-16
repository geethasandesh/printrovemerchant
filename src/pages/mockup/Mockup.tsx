import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CircleDownIcon } from '@shopify/polaris-icons';
import { Button } from '../../components/common/Button';
import { Checkbox } from '@shopify/polaris';

const mockups = [
  { key: 'flat', label: 'Flat', img: '/product-img-white.png' },
  { key: 'wrinkled', label: 'Wrinkled', img: '/product-img-white.png' },
  { key: 'distressed', label: 'Distressed', img: '/product-img-white.png' },
  { key: 'model-cropped', label: 'Model Cropped', img: '/product-img-white.png' },
  { key: 'model-full', label: 'Model – Full', img: '/product-img-white.png' },
  { key: 'hanging-1', label: 'Hanging – 1', img: '/product-img-white.png' },
  { key: 'hanging-2', label: 'Hanging – 2', img: '/product-img-white.png' },
];

export default function Mockup() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('flat');

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="icon" onClick={() => navigate(-1)} icon={<ArrowLeftIcon />} />
          <span className="text-2xl font-semibold text-[#232323]">Choose Mockup</span>
        </div>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-none"
          onClick={() => {}}
        >
          <CircleDownIcon className="w-6 h-6 fill-white" />
          Download Mockup
        </Button>
      </div>

      {/* Mockup Grid */}
      <div className="grid grid-cols-4 gap-10 max-w-7xl mx-auto">
        {mockups.map((mockup) => (
          <div
            key={mockup.key}
            className={
              'relative bg-white rounded-2xl shadow-sm flex flex-col items-center p-8 transition border-2 border-transparent'
            }
            style={{ minHeight: 320, minWidth: 240, cursor: 'pointer' }}
            onClick={() => setSelected(mockup.key)}
          >
            {/* Polaris Checkbox */}
            <div className="absolute left-5 top-5 z-10">
              <Checkbox
                label=""
                checked={selected === mockup.key}
                onChange={() => setSelected(mockup.key)}
              />
            </div>
            {/* Image */}
            <img src={mockup.img} alt={mockup.label} className="w-48 h-48 object-contain mb-6 mt-2" />
            {/* Label */}
            <span className="text-lg font-medium text-[#232323] mt-auto">{mockup.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 