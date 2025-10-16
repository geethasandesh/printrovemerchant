import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    BlockStack,
    Icon,
    InlineStack,
    Page,
    Select,
    Text,
    TextField,
} from "@shopify/polaris";
import { useState } from "react";
import {
    InfoIcon,
} from '@shopify/polaris-icons';
import { Button as CustomBtn } from "../components/common/Button";


interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    order?: number;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, order = "" }) => {
    return (
        <div className="flex items-center gap-2 py-2">
            {label && <span className="text-sm" style={{ order: order }}>{label}</span>}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-custom-blue' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                ></span>
            </button>
        </div>
    );
};

export function StoreConnectSettings() {
    const [storeName, setStoreName] = useState('');
    const [website, setWebsite] = useState('');
    const [customBranding, setCustomBranding] = useState(true);

    const [pullOrders, setPullOrders] = useState(true);
    const [autoPlace1, setAutoPlace1] = useState(true);
    const [autoPlace2, setAutoPlace2] = useState(false);
    const [autoPlace3, setAutoPlace3] = useState(false);

    const storeOptions = [
        { label: 'Select a store', value: '' },
        { label: 'Shopify', value: 'shopify' },
        { label: 'Shopline', value: 'shopline' },
    ];

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page title="Store Connect Settings" fullWidth>
                        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
                            {/* Store Default */}
                            <div className="space-y-4" style={{ maxWidth: "40%" }}>
                                <Text variant="headingMd" as="h2">
                                    Store Default
                                </Text>
                                <BlockStack gap={"200"}>
                                    <Select
                                        label={<InlineStack gap={"100"}>
                                            <Text as="p">Choose Store</Text>
                                            <Icon source={InfoIcon} />
                                        </InlineStack>}
                                        options={storeOptions}
                                        onChange={() => { }}
                                        value=""
                                    />
                                    <TextField
                                        autoComplete="off"
                                        label={<InlineStack gap={"100"}>
                                            <Text as="p">Store Name</Text>
                                            <Icon source={InfoIcon} />
                                        </InlineStack>}
                                        value={storeName}
                                        onChange={setStoreName}
                                    />
                                    <TextField
                                        label={<InlineStack gap={"100"}>
                                            <Text as="p">Website</Text>
                                            <Icon source={InfoIcon} />
                                        </InlineStack>}
                                        value={website}
                                        onChange={setWebsite}
                                        autoComplete="off"
                                        placeholder="www.xyz.com"
                                    />
                                    <ToggleSwitch
                                        checked={customBranding}
                                        onChange={setCustomBranding}
                                        label="Custom Branding"
                                    />
                                </BlockStack>
                                <CustomBtn variant="primary" size="lg">Save</CustomBtn>
                            </div>

                            {/* Store Settings */}
                            <div className="space-y-4">
                                <Text variant="headingMd" as="h2">
                                    Store Settings
                                </Text>

                                <ToggleSwitch
                                    checked={pullOrders}
                                    onChange={setPullOrders}
                                    label="Pull orders from your store automatically"
                                    order={1}
                                />
                                <ToggleSwitch
                                    checked={autoPlace1}
                                    onChange={setAutoPlace1}
                                    label="Place prepaid orders automatically without the manual confirmation"
                                    order={1}
                                />
                                <ToggleSwitch
                                    checked={autoPlace2}
                                    onChange={setAutoPlace2}
                                    label="Place prepaid orders automatically without the manual confirmation"
                                    order={1}
                                />
                                <ToggleSwitch
                                    checked={autoPlace3}
                                    onChange={setAutoPlace3}
                                    label="Place prepaid orders automatically without the manual confirmation"
                                    order={1}
                                />

                                <CustomBtn variant="primary" size="lg">Save</CustomBtn>
                            </div>

                            {/* Remove Store */}
                            <div className="space-y-2">
                                <Text variant="headingMd" as="h2">
                                    Remove Store
                                </Text>
                                <Text as={"p"}>
                                    Removing your store will completely remove all the content associated with it. There is no way back, please be careful with this option.
                                </Text>
                                <CustomBtn variant="secondary" size="lg" className="custom-tertiary-btn">Remove</CustomBtn>
                            </div>
                        </div>
                    </Page>
                </div>
            </div>
        </>
    );
}