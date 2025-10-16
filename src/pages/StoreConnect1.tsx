import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Page,
    Text,
    IndexTable,
    Card,
    useIndexResourceState,
    Button,
    InlineStack,
    BlockStack,
} from "@shopify/polaris";
import { ExternalIcon } from '@shopify/polaris-icons';
import productImg2 from '../assets/productImg2.png';
import { Button as CustomBtn } from "../components/common/Button";

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

export const StoreConnect1 = () => {
    const resourceName = {
        singular: "variant",
        plural: "variants",
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(variants);
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
                                            <CustomBtn variant="primary" size="lg">Connect</CustomBtn>
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