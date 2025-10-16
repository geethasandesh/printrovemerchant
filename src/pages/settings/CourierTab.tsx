import { useState } from 'react';
import { RadioButton, Select } from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';

interface CourierSettings {
    priority: 'auto' | 'manual';
    standardShipping: string[];
    codShipping: string[];
    internationalShipping: string[];
}

export function CourierTab() {
    const [settings, setSettings] = useState<CourierSettings>({
        priority: 'auto',
        standardShipping: ['', '', ''],
        codShipping: ['', '', ''],
        internationalShipping: ['', '', '']
    });

    const shippingOptions = [
        { label: 'DTDC', value: 'dtdc' },
        { label: 'Delhivery', value: 'delhivery' },
        { label: 'BlueDart', value: 'bluedart' }
    ];

    const handlePriorityChange = (checked: boolean, value: 'auto' | 'manual') => {
        if (checked) {
            setSettings(prev => ({ ...prev, priority: value }));
        }
    };

    const handleShippingChange = (
        type: keyof Omit<CourierSettings, 'priority'>,
        idx: number
    ) => (value: string) => {
        setSettings(prev => ({
            ...prev,
            [type]: prev[type].map((v, i) => (i === idx ? value : v))
        }));
    };

    return (
        <div className="p-6 border border-[#E3E3E3] rounded-xl bg-[#FFFFFF]">
            <h2 className="text-lg font-bold text-[#303030] mb-6">
                Courier Information
            </h2>
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-medium text-[#303030]">Courier Priority</span>
                    <div className="flex gap-4">
                        <RadioButton
                            label="Auto"
                            checked={settings.priority === 'auto'}
                            onChange={(checked) => handlePriorityChange(checked, 'auto')}
                        />
                        <RadioButton
                            label="Manual"
                            checked={settings.priority === 'manual'}
                            onChange={(checked) => handlePriorityChange(checked, 'manual')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Standard Shipping */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#303030]">Standard Shipping</span>
                            <div className="group relative">
                                <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                    Select your preferred shipping partner for standard delivery
                                    <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                </div>
                            </div>
                        </div>
                        {[0, 1, 2].map(idx => (
                            <div className="relative z-10" key={idx}>
                                <Select
                                    label=""
                                    labelHidden
                                    options={shippingOptions}
                                    onChange={handleShippingChange('standardShipping', idx)}
                                    value={settings.standardShipping[idx]}
                                    placeholder="Select shipping partner"
                                />
                            </div>
                        ))}
                    </div>
                    {/* COD */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#303030]">COD</span>
                            <div className="group relative">
                                <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                    Select your preferred shipping partner for Cash on Delivery
                                    <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                </div>
                            </div>
                        </div>
                        {[0, 1, 2].map(idx => (
                            <div className="relative z-10" key={idx}>
                                <Select
                                    label=""
                                    labelHidden
                                    options={shippingOptions}
                                    onChange={handleShippingChange('codShipping', idx)}
                                    value={settings.codShipping[idx]}
                                    placeholder="Select shipping partner"
                                />
                            </div>
                        ))}
                    </div>
                    {/* International */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#303030]">International</span>
                            <div className="group relative">
                                <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                                    Select your preferred shipping partner for international delivery
                                    <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                                </div>
                            </div>
                        </div>
                        {[0, 1, 2].map(idx => (
                            <div className="relative z-10" key={idx}>
                                <Select
                                    label=""
                                    labelHidden
                                    options={shippingOptions}
                                    onChange={handleShippingChange('internationalShipping', idx)}
                                    value={settings.internationalShipping[idx]}
                                    placeholder="Select shipping partner"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-start">
                    <button className="px-3 py-[6px] bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-[#1a1a1a] transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}