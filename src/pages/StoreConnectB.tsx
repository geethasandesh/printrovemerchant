import { useState } from "react";
import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import {
    Page,
    Text,
    Card,
    Button,
    Popover,
    ActionList,
    Icon,
    TextField,
    Tabs,
    Select,
    InlineStack,
} from "@shopify/polaris";
import {
    ArrowLeftIcon,
    SearchIcon, MenuVerticalIcon,
    SettingsIcon,
    RefreshIcon
} from '@shopify/polaris-icons';
import shirtImg from '../assets/productImg1.png';
import { Button as CustomBtn } from "../components/common/Button";

const tabs = [
    { id: "all", content: "All" },
    { id: "synced", content: "Synced" },
    { id: "not_synced", content: "Not Synced" },
    { id: "imported", content: "Imported" },
    { id: "out_of_stock", content: "Out Of Stock" },
];

export const StoreConnectB = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [search, setSearch] = useState("");

    const products = Array(5).fill({
        title: "White Solid Tshirt half sleeves",
        sku: "79066160",
        image: "/shirt.png", // Replace with your actual image
    });
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page
                        backAction={{ content: '', onAction: () => console.log('Go back') }}
                        title="Store Connect | Store Name"
                        titleHidden
                        // primaryAction={{ content: 'Add Products' }}
                        // secondaryActions={[
                        //     {
                        //         content: 'Sync with Shopify',
                        //     },
                        // ]}
                        fullWidth
                    >
                        <div className="mb-4">
                        <InlineStack gap={"400"} align="space-between" blockAlign="center">
                            <div className="flex items-center gap-4 text-gray-500 mb-4 pt-4">
                                <Button icon={<Icon source={ArrowLeftIcon} />} />
                                <span className="text-xl font-medium">Store Connect</span> | <span className="font-medium text-black text-xl">Store name</span>
                            </div>
                            <InlineStack gap={"400"}>
                                <CustomBtn variant="secondary" className="px-2">
                                    <Icon source={SettingsIcon} />
                                </CustomBtn>
                                <CustomBtn variant="secondary" className="px-2">
                                    <Icon source={RefreshIcon} />
                                </CustomBtn>
                                <Select
                                    label=""
                                    labelHidden
                                    options={[
                                        { label: 'Today', value: 'today' },
                                        { label: 'Yesterday', value: 'yesterday' },
                                        { label: 'Last 7 days', value: 'lastWeek' },
                                    ]}
                                    placeholder="Sync with Shopify"
                                />
                            </InlineStack>
                        </InlineStack>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <Text variant="headingXl" as="h1">
                                Store Name
                            </Text>

                            <div className="flex gap-2 items-center">
                                {/* <Button icon="SettingsMinor" variant="tertiary" />
                                <Button icon="RefreshMinor" variant="tertiary" />
                                <Button variant="tertiary" disclosure>
                                    Sync with Shopify
                                </Button> */}
                                <CustomBtn variant="primary" size="lg">Add Products</CustomBtn>
                            </div>
                        </div>

                        {/* Filter and search */}
                        <div className="flex justify-between items-center mb-4">
                            <Select
                                label=""
                                labelHidden
                                options={[
                                    { label: 'Today', value: 'today' },
                                    { label: 'Yesterday', value: 'yesterday' },
                                    { label: 'Last 7 days', value: 'lastWeek' },
                                ]}
                                placeholder="All Products"
                            />
                            <TextField
                                prefix={<Icon source={SearchIcon} />}
                                label=""
                                labelHidden
                                autoComplete="off"
                                value={search}
                                onChange={setSearch}
                                placeholder="Search your order here"
                            />
                        </div>
                        {/* Table */}
                        <Card padding={"0"}>
                            <div>
                                <Tabs
                                    tabs={tabs}
                                    selected={selectedTab}
                                    onSelect={setSelectedTab}
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="w-8 px-4 py-2">
                                                <input type="checkbox" />
                                            </th>
                                            <th className="px-4 py-2">Product</th>
                                            <th className="px-4 py-2">Synced</th>
                                            <th className="px-4 py-2">Not Synced</th>
                                            <th className="px-4 py-2">Ignored</th>
                                            <th className="px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <ProductRow key={index} product={product} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Page>
                </div>
            </div>
        </>
    );
};

function ProductRow({ product }: { product: any }) {
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopover = () => setPopoverActive((active) => !active);

    return (
        <tr className="bg-white rounded shadow-sm">
            <td className="px-4 py-3 align-top">
                <input type="checkbox" />
            </td>
            <td className="px-4 py-3 flex items-center gap-3 align-top">
                <img src={shirtImg} className="w-16 h-14 rounded border" alt="product" />
                <div>
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-gray-500 text-xs">SKU: {product.sku}</div>
                </div>
            </td>
            <td className="px-4 py-3 align-top">NA</td>
            <td className="px-4 py-3 align-top">NA</td>
            <td className="px-4 py-3 align-top">NA</td>
            <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                    <CustomBtn variant="primary" size="lg">Connect</CustomBtn>
                    <Popover
                        active={popoverActive}
                        activator={
                            <CustomBtn variant="secondary" size="lg">
                                <Icon source={MenuVerticalIcon} />
                            </CustomBtn>
                        }
                        onClose={togglePopover}
                        autofocusTarget="first-node"
                    >
                        <ActionList
                            items={[
                                { content: "Disconnected" },
                                { content: "Ignore" },
                                {
                                    content: "Delete",
                                    destructive: true,
                                },
                            ]}
                        />
                    </Popover>
                </div>
            </td>
        </tr>
    );
}