import { useState } from 'react';
import { Navbar } from "../layout/Navbar";
import { ArrowLeftIcon, MeasurementSizeIcon, MenuVerticalIcon } from '@shopify/polaris-icons';
import { Card, Icon, TextField } from '@shopify/polaris';
import { Button } from "../components/common/Button";
import { useNavigate } from 'react-router-dom';

export function AddProduct() {
    const navigate = useNavigate();
    const [selectedPrintingType, setSelectedPrintingType] = useState<'dtf' | 'dtg'>('dtf');
    const [selectedColor, setSelectedColor] = useState('white');
    const [selectedSize, setSelectedSize] = useState('S');

    const colors = [
        { label: 'White', value: 'white', hex: '#FFFFFF', border: '#D0D0D0' },
        { label: 'Red', value: 'red', hex: '#EF4D2F' },
        { label: 'Orange', value: 'orange', hex: '#FFD79D' },
        { label: 'Blue', value: 'blue', hex: '#A4E8F2' },
        { label: 'Black', value: 'black', hex: '#303030' },
        { label: 'Grey', value: 'grey', hex: '#E3E3E3' }
    ];

    const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            
            <div className="flex-1 overflow-hidden bg-[#F5F5F5]">
                <div className="h-full overflow-y-auto">
                    <div className="mx-[10%] p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Button 
                                variant="icon"
                                onClick={() => navigate(-1)}
                                icon={<ArrowLeftIcon className="w-4 h-4" />}
                            />
                            <h1 className="text-2xl font-bold text-[#121212]">Add New Product</h1>
                        </div>

                        <Card>
                            <div className="w-[70vw] h-[60vh] p-6">
                                <div className="grid grid-cols-2 gap-8 h-[calc(100%-4rem)]">
                                    {/* Left half - Image Upload */}
                                    <div className="flex flex-col gap-4">
                                        <div className="border-2 border-dashed border-[#E1E1E1] rounded-lg h-[50vh] flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-[#616161] mb-2">Drag and drop your product images here</p>
                                                <Button>Upload Images</Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#616161]">Supported formats: PNG, JPG, JPEG. Max size: 5MB</p>
                                    </div>

                                    {/* Right half - Product details */}
                                    <div className="flex flex-col gap-5">
                                        <TextField
                                            label="Product Title"
                                            autoComplete="off"
                                            placeholder="Enter product title"
                                        />

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">Printing Type</span>
                                                <span className="text-sm text-[#616161]">({selectedPrintingType.toUpperCase()})</span>
                                            </div>
                                            <div className="inline-flex gap-6 bg-[#F5F5F5] p-1.5 rounded-xl">
                                                <button
                                                    onClick={() => setSelectedPrintingType('dtf')}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                                        selectedPrintingType === 'dtf'
                                                        ? 'bg-[#D1D1D1]'
                                                        : 'bg-[#DDDDDD] hover:bg-[#D8D8D8]'
                                                    }`}
                                                >
                                                    <span className="text-sm font-medium">DTF Printing</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedPrintingType('dtg')}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                                        selectedPrintingType === 'dtg'
                                                        ? 'bg-[#D1D1D1]'
                                                        : 'bg-[#DDDDDD] hover:bg-[#D8D8D8]'
                                                    }`}
                                                >
                                                    <span className="text-sm font-medium">DTG Printing</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">Color</span>
                                                <span className="text-sm text-[#616161]">({selectedColor})</span>
                                            </div>
                                            <div className="flex gap-2.5">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color.value}
                                                        onClick={() => setSelectedColor(color.value)}
                                                        className={`w-7 h-7 rounded-lg ${
                                                            selectedColor === color.value 
                                                            ? 'ring-2 ring-[#005BD3]' 
                                                            : 'border border-[#E3E3E3]'
                                                        }`}
                                                        style={{ 
                                                            backgroundColor: color.hex,
                                                            borderColor: color.border || '#E3E3E3'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">Size</span>
                                                <button className="inline-flex items-center gap-1 text-[#005BD3] text-xs font-medium">
                                                    <Icon source={MeasurementSizeIcon} />
                                                    Size chart
                                                </button>
                                            </div>
                                            <div className="flex gap-2.5">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center ${
                                                            selectedSize === size
                                                            ? 'border-2 border-[#005BD3] text-[#005BD3]'
                                                            : 'border border-[#505050] text-[#434343]'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <TextField
                                            label="Price"
                                            type="number"
                                            prefix="$"
                                            autoComplete="off"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-8">
                                    <Button 
                                        variant="primary" 
                                        className="flex-1 !bg-black !text-white hover:!bg-black/90"
                                    >
                                        Create Product
                                    </Button>
                                    <Button 
                                        variant="secondary"
                                        className="flex-1 border border-[#DCDCDC] bg-[#F4F4F5]"
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button 
                                        variant="icon"
                                        icon={<MenuVerticalIcon className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 