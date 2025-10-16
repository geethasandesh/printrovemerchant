import {
    Page,
    Card,
} from '@shopify/polaris';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import pItem1 from '../assets/customBrandImg.png';
import pItem2 from '../assets/customBrandImg1.png';


const product = {
    name: 'Inner Necklable',
    sku: '79066160',
    image: pItem1,
    variants: [
        {
            id: 1,
            name: 'Inner Necklable 1',
            image: pItem2,
            quantity: 12,
            total: 200,
        },
        {
            id: 2,
            name: 'Inner Necklable 2',
            image: pItem2,
            quantity: 12,
            total: 200,
        },
        {
            id: 3,
            name: 'Inner Necklable 3',
            image: pItem2,
            quantity: 12,
            total: 200,
        },
        {
            id: 4,
            name: 'Inner Necklable 4',
            image: pItem2,
            quantity: 12,
            total: 200,
        },
    ],
};

export const ProductVariantPage = () => {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-[#F5F6F8]">
                    <Page
                        backAction={
                            {
                                content: "Custom Branding / Brand Name / Inner Necklable",
                                onAction: () => {

                                },
                            }
                        }
                        title={"Custom Branding / Brand Name / Inner Necklable"}
                        fullWidth={false}>
                        {/* <div className="flex items-center gap-2 px-4 pb-4">
                            <Button icon={ArrowLeftIcon} variant='plain' onClick={() => { }}>
                                Custom Branding
                            </Button>
                            <span className="text-gray-500">/ Brand Name /</span>
                            <span className="font-semibold text-black">Inner Necklable</span>
                        </div> */}

                        {/* Main Product Info */}
                        <div>
                            <Card>
                                <div className="flex items-center gap-4 p-4">
                                    <img src={product.image} alt={product.name} />
                                    <div>
                                        <div className="text-lg font-semibold">{product.name}</div>
                                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Variants Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 mt-6 custom-branding-grid">
                            {product.variants.map((variant) => (
                                <Card key={variant.id}>
                                    <div className="flex flex-col">
                                        <img
                                            src={variant.image}
                                            alt={variant.name}
                                            className="object-cover rounded mb-2"
                                        />
                                        <div className="font-medium">{variant.name}</div>
                                        <div className="text-sm text-blue-600">
                                            {variant.quantity}/{variant.total}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Page>
                </div>
            </div>
        </>
    );
};

export default ProductVariantPage;