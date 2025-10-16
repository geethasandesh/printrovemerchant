import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Page,
    Button,
    Text,
    Card,
    InlineStack,
    BlockStack,
    IndexTable,
    useIndexResourceState,
    Icon,
} from "@shopify/polaris";
import {
    ExternalIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@shopify/polaris-icons";
import productImg2 from '../assets/productImg2.png';
import pItem1 from '../assets/pitem1.png';
import pItem2 from '../assets/pitem2.png';
import { Button as CustomBtn } from "../components/common/Button";


const variantData = [
    {
        color: "White",
        size: "M",
        price: "$13.25–$13.75",
        selected: true,
        preview: [pItem1, pItem2], // Use actual image paths
    },
    {},
    {},
    {},
];

export const StoreConnect2 = () => {
    const resourceName = {
        singular: "variant",
        plural: "variants",
    };
    const variants = [
        {
            id: "1",
            title: "The Organic Cotton Long-Sleeve Turtleneck",
            subtitle: "Sleeve Turtle neck 23173214",
        },
        {
            id: "2",
            title: "The Organic Cotton Long-Sleeve Turtleneck",
            subtitle: "Sleeve Turtle neck 23173214",
        },
        {
            id: "3",
            title: "The Organic Cotton Long-Sleeve Turtleneck",
            subtitle: "Sleeve Turtle neck 23173214",
        },
    ];
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(variants);
    const colorImageMap = {
        white: { color: '#FFFFFF' },
        yellow: { color: '#FFD700' },
        red: { color: '#EF4D2F' },
        blue: { color: '#A4E8F2' }
    }
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page
                        backAction={{ content: '', onAction: () => console.log('Go back') }}
                        title="Store Connect / Store Name / Product Name"
                        fullWidth
                    >
                        {/* Breadcrumb */}
                        {/* <div className="text-sm text-gray-600 mb-3">
                            Store Connect /{" "}
                            <span className="text-green-600 font-medium">Store name</span> /{" "}
                            <span className="text-gray-900 font-medium">Product name</span>
                        </div> */}

                        {/* Product header */}
                        <Card>
                            <InlineStack gap="200" blockAlign="start">
                                <img src={productImg2} />
                                <div className="flex flex-1 items-start justify-between flex-wrap gap-4">
                                    <BlockStack gap="500" inlineAlign="start">
                                        <Text variant="headingLg" as="h1">
                                            The Organic Cotton Long-Sleeve Turtleneck
                                        </Text>
                                        <CustomBtn variant="primary" size="lg">Edit Details</CustomBtn>
                                    </BlockStack>
                                    <Button
                                        icon={ExternalIcon}
                                        size="slim"
                                        variant="plain"
                                        onClick={() => { }}
                                    >
                                        View In Shopify
                                    </Button>
                                </div>
                            </InlineStack>
                        </Card>
                        <div className="mt-6 mb-2">
                            <Text variant="headingMd" as="h2">
                                Variants
                            </Text>
                        </div>
                        {/* Variants Table */}
                        <Card padding={"0"}>
                            <IndexTable
                                resourceName={resourceName}
                                itemCount={variants.length}
                                selectedItemsCount={
                                    allResourcesSelected ? "All" : selectedResources.length
                                }
                                onSelectionChange={handleSelectionChange}
                                headings={[
                                    { title: "Variant" },
                                    { title: "Printrove Item" },
                                ]}
                            >
                                {variants.map((variant, index) => (
                                    <IndexTable.Row
                                        id={variant.id}
                                        key={variant.id}
                                        selected={selectedResources.includes(variant.id)}
                                        position={index}
                                    >
                                        <IndexTable.Cell>
                                            <InlineStack gap={"200"}>
                                                <img src={productImg2} width={72} />
                                                <div className="flex flex-col gap-1">
                                                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                                                        {variant.title}
                                                    </Text>
                                                    <Text as="p" variant="bodySm" tone="subdued">
                                                        {variant.subtitle}
                                                    </Text>
                                                </div>
                                            </InlineStack>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>

                                            <InlineStack gap={"400"} align="space-between">
                                                <InlineStack gap={"200"} blockAlign="start">
                                                    <img src={productImg2} width={72} />
                                                    <BlockStack gap={"200"}>
                                                        <div className="flex flex-col gap-1">
                                                            <Text variant="bodyMd" fontWeight="semibold" as="span">
                                                                {variant.title}
                                                            </Text>
                                                            <Text as="p" variant="bodySm" tone="subdued">
                                                                {variant.subtitle}
                                                            </Text>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            {index === 0 ? (
                                                                <>
                                                                    <div className="text-sm text-gray-500">
                                                                        Product Id: 910
                                                                        <div className="flex gap-2 mt-1">
                                                                            Color:
                                                                            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                                                                                {variantData[0].color}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            {Object.keys(colorImageMap).map((color) => (
                                                                                <button
                                                                                    key={color}

                                                                                    className={`w-6 h-6 border rounded-md border-[#DCDCDC]'}`}
                                                                                    style={{ backgroundColor: colorImageMap[color as keyof typeof colorImageMap].color }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <div className="mt-1">Size: {variantData[0].size}</div>
                                                                        <div className="mt-1">
                                                                            Printful Price: <strong>{variantData[0].price}</strong>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Button variant="plain" size="slim">
                                                                            Edit
                                                                        </Button>
                                                                        <Button variant="plain" size="slim">
                                                                            Unsync
                                                                        </Button>
                                                                    </div>
                                                                    <div className="flex gap-2 mt-2">
                                                                        {variantData[0]?.preview?.map((img, i) => (
                                                                            <img
                                                                                key={i}
                                                                                src={img}
                                                                                alt="mockup"
                                                                                className="w-16 h-16 rounded object-cover"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </BlockStack>
                                                </InlineStack>
                                                <span>
                                                    <Icon source={index === 0 ? ChevronUpIcon : ChevronDownIcon} />
                                                </span>
                                            </InlineStack>

                                        </IndexTable.Cell>
                                    </IndexTable.Row>
                                ))}
                            </IndexTable>
                        </Card>
                    </Page>
                </div>
            </div>
        </>

    );
};