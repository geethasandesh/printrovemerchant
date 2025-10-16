import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Card,
    Text,
    Box,
    Badge,
    Icon,
    BlockStack,
    InlineStack,
    InlineGrid,
    Page
} from '@shopify/polaris';
import { CheckSmallIcon } from '@shopify/polaris-icons';
import shopifystore from '../assets/shopifystore.png';
import customstore from '../assets/customstore.png';
import woocommercestore from '../assets/woocommercestore.png';
import { Button as CustomBtn } from "../components/common/Button";


const storeData = [
    {
        title: 'Shopify',
        badge: 'NEW',
        description:
            'Shopify is an attractive choice to small businesses, offering a comprehensive platform with easy to use tools and affordable pricing',
        features: [
            'Customized themes and templates',
            'Integrated payment processing',
            'Extensive app store'
        ],
        type: 'Platform',
        cost: '$500',
        subscription: 'Yes',
        image: shopifystore
    },
    {
        title: 'WooCommerce',
        description:
            'Woocommerce is a flexible, open-source ecommerce platform on WordPress, ideal for businesses of all sizes with extensive customization and plugins.',
        features: [
            'Seamless integration with WordPress',
            'Extensive library of plugins and extensions',
            'Strong community support and documentation'
        ],
        type: 'Platform',
        cost: '$500',
        subscription: 'No',
        image: woocommercestore

    },
    {
        title: 'Custom',
        description:
            'Its not an integrated store. Use it to test creating products, save them and add them to future orders or store.',
        features: [
            'Create and save products to future',
            'Add saved products to existing stores',
            'Free to use'
        ],
        type: 'Custom',
        cost: 'Free',
        subscription: 'No',
        image: customstore
    },
    // {
    //     title: 'API',
    //     description:
    //         'The Printrove API uses REST, with research oriented URLs, HTTP response codes for errors, and JSON for responses',
    //     features: [
    //         'REST API with JSON responses',
    //         'Compatible with common HTTP clients',
    //         'Total flexibility'
    //     ],
    //     type: 'Custom',
    //     cost: 'Free',
    //     subscription: 'No',
    //     image: apistore
    // }
];

export const StoreConnect = () => {
    const a: any = <div className="text-2xl font-bold text-[#121212]">Store Connect</div>
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    {/* <Box padding="400">
                        <Text variant="headingLg" as="h2" alignment="start">
                            Store Connect
                        </Text> */}
                    <Page
                        title={a}
                        // backAction={
                        //     {
                        //         content: "Custom Branding",
                        //         onAction: () => {

                        //         },
                        //     }
                        // }
                        // title={"Custom Branding"}
                        fullWidth>
                        <Box>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {storeData.map((store, idx) => (
                                    <Card key={idx} roundedAbove="sm">
                                        <BlockStack gap={"400"}>
                                            <BlockStack gap={"100"}>
                                                <InlineStack align="start" gap={"200"} blockAlign="center">
                                                    <img src={store.image} />
                                                    {store.badge && <Badge tone="success">{store.badge}</Badge>}
                                                </InlineStack>
                                                <Text as="p" variant="bodySm" tone="subdued">
                                                    {store.description}
                                                </Text>
                                            </BlockStack>
                                            <Box padding="200" borderRadius="200" background="bg">
                                                <BlockStack gap="100">
                                                    {store.features.map((feature, i) => (
                                                        <InlineStack key={i} gap="100">
                                                            <span><Icon source={CheckSmallIcon} tone="subdued" /></span>
                                                            <Text as="span" variant="bodySm">
                                                                {feature}
                                                            </Text>
                                                        </InlineStack>
                                                    ))}
                                                </BlockStack>
                                            </Box>
                                            <Card>
                                                <InlineStack align="space-between">
                                                    <BlockStack gap="100">
                                                        <Text as="span" fontWeight="medium">
                                                            Type
                                                        </Text>
                                                        <Text as="span" tone="subdued">
                                                            {store.type}
                                                        </Text>
                                                    </BlockStack>
                                                    <BlockStack gap="100">
                                                        <Text as="span" fontWeight="medium">
                                                            Cost
                                                        </Text>
                                                        <Text as="span" tone="subdued">
                                                            {store.cost}
                                                        </Text>
                                                    </BlockStack>
                                                    <BlockStack gap="100">
                                                        <Text as="span" fontWeight="medium">
                                                            Subscription
                                                        </Text>
                                                        <Text as="span" tone="subdued">
                                                            {store.subscription}
                                                        </Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            </Card>
                                            <InlineGrid gap="200" columns={2}>
                                                <CustomBtn variant="primary" size="lg">Connect Store</CustomBtn>
                                                <span className="learn-more-btn"><CustomBtn variant="secondary" className="custom-tertiary-btn" size="lg">Learn more</CustomBtn></span>
                                            </InlineGrid>
                                        </BlockStack>
                                    </Card>
                                ))}
                            </div>
                        </Box>
                    </Page>
                    {/* </Box> */}
                </div>
            </div>
        </>
    );
};
