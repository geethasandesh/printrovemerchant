import {
    Page,
    Card,
    Button,
    Thumbnail,
    InlineStack,
    BlockStack,
} from '@shopify/polaris';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import pItem1 from '../assets/customBrandImg.png';
import pItem2 from '../assets/productImg2.png';

const variant = {
    name: 'Inner Necklable 1',
    sku: '79066160',
    image: pItem1,
    products: [
        {
            id: 1,
            title: 'Tshirt Yellow - M, Hem Round',
            image: pItem2,
            updatedAt: '12-09-2024',
        },
        {
            id: 2,
            title: 'Button Yellow - M, Hem Round',
            image: pItem2,
            updatedAt: '12-09-2024',
        },
        {
            id: 3,
            title: 'Outer Necklable',
            image: pItem2,
            updatedAt: '12-09-2024',
        },
        {
            id: 4,
            title: 'Tshirt Yellow - M, Hem Round',
            image: pItem2,
            updatedAt: '12-09-2024',
        },
    ],
};

export const AssociatedProductsPage = () => {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-[#F5F6F8]">
                    <Page
                        backAction={
                            {
                                content: `Custom Branding / Brand Name / ${variant.name}`,
                                onAction: () => {

                                },
                            }
                        }
                        title={`Custom Branding / Brand Name / ${variant.name}`}
                        fullWidth={false}>
                        {/* <div className="flex items-center gap-2 px-4 pb-4">
                            <Button icon={ArrowLeftIcon} variant='plain' onClick={() => { }}>
                                Custom Branding
                            </Button>
                            <span className="text-gray-500">/ Brand Name /</span>
                            <span className="font-semibold text-black">{variant.name}</span>
                        </div> */}

                        {/* Variant Header */}
                        <Card>
                            <div className="flex items-center justify-between p-4">

                                <div className="flex gap-4 items-center">
                                    <Thumbnail source={variant.image} alt={variant.name} size="large" />
                                    <BlockStack inlineAlign='start' gap={"300"}>
                                        <div>
                                            <div className="text-lg font-semibold">{variant.name}</div>
                                            <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                                        </div>
                                        <Button variant='plain'> Edit Products </Button>
                                    </BlockStack>
                                </div>

                            </div>
                        </Card>

                        {/* Associated Products Table */}
                        <div className="mt-6 px-4">
                            <div className="text-base font-medium mb-2">Associated Products</div>
                            <Card padding={"0"}>
                                <div className="divide-y">
                                    <div className="grid grid-cols-2 sm:grid-cols-6 font-medium text-sm p-3 bg-gray-50">
                                        <div className="col-span-4">
                                            <InlineStack gap={"200"}>
                                                <span>Product</span>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.6339 4.36612C10.1457 3.87796 9.35427 3.87796 8.86612 4.36612L6.21967 7.01256C5.92678 7.30546 5.92678 7.78033 6.21967 8.07322C6.51256 8.36612 6.98744 8.36612 7.28033 8.07322L9.75 5.60355L12.2197 8.07322C12.5126 8.36612 12.9874 8.36612 13.2803 8.07322C13.5732 7.78033 13.5732 7.30546 13.2803 7.01256L10.6339 4.36612Z" fill="#CCCCCC" />
                                                    <path d="M13.2803 13.0734L10.6339 15.7198C10.1457 16.208 9.35427 16.208 8.86612 15.7198L6.21967 13.0734C5.92678 12.7805 5.92678 12.3056 6.21967 12.0127C6.51256 11.7198 6.98744 11.7198 7.28033 12.0127L9.75 14.4824L12.2197 12.0127C12.5126 11.7198 12.9874 11.7198 13.2803 12.0127C13.5732 12.3056 13.5732 12.7805 13.2803 13.0734Z" fill="#4A4A4A" />
                                                </svg>
                                            </InlineStack>
                                        </div>
                                        <div className="col-span-2 text-right pr-4">Last Updated</div>
                                    </div>
                                    {variant.products.map((prod) => (
                                        <div
                                            key={prod.id}
                                            className="grid grid-cols-2 sm:grid-cols-6 items-center p-3 hover:bg-gray-50 transition"
                                        >
                                            <div className="col-span-4 flex gap-3 items-center">
                                                <img
                                                    src={prod.image}
                                                    alt={prod.title}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <span>{prod.title}</span>
                                            </div>
                                            <div className="col-span-2 text-sm text-gray-600 text-right pr-4">
                                                {prod.updatedAt}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Page>
                </div>
            </div>
        </>
    );
};