import { useState } from 'react';
import {
    Page,
    Card,
    Button,
    Thumbnail,
    TextField,
    Icon,
    InlineStack,
    Text,
} from '@shopify/polaris';
import { PlusIcon, XIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import pItem1 from '../assets/customBrandImg.png';
import pItem2 from '../assets/productImg2.png';
import { Button as CustomButton } from '../components/common/Button';
import FixedFooter from '../components/common/Footer';

interface initialProducts {
    id: number | string,
    title: string,
    sku: string,
    image: string,
    isNew?: boolean
}

const initialProducts = [
    {
        id: 1,
        title: 'Butter Yellow 3XL Men Round',
        sku: '215456442',
        image: pItem2,
    },
    {
        id: 2,
        title: 'Butter Yellow 3XL Men Round',
        sku: '215456442',
        image: pItem2,
    },
    {
        id: 3,
        title: 'Butter Yellow 3XL Men Round',
        sku: '215456442',
        image: pItem2,
    },
];

const variant = {
    name: 'Inner Necklable',
    sku: '79066160',
    image: pItem1,
};

export const EditAssociatedProductsPage = () => {
    const [products, setProducts] = useState<any>(initialProducts);

    const handleRemove = (index: number) => {
        const updated = [...products];
        updated.splice(index, 1);
        setProducts(updated);
    };

    const handleAddNewRow = () => {
        setProducts([...products, { id: Date.now(), title: '', sku: '', image: '', isNew: true }]);
    };

    const handleChange = (index: number, value: string) => {
        const updated = [...products];
        updated[index].title = value;
        setProducts(updated);
    };

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
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
                        {/* Breadcrumb */}
                        {/* <div className="flex items-center gap-2 px-4 pb-4">
                            <Button icon={ArrowLeftIcon} variant='plain' onClick={() => { }}>
                                Custom Branding
                            </Button>
                            <span className="text-gray-500">/ Brand Name /</span>
                            <span className="font-semibold text-black">{variant.name}</span>
                        </div> */}

                        {/* Header Card */}
                        <Card>
                            <div className="flex items-center p-4 gap-4">
                                <Thumbnail source={variant.image} alt={variant.name} size="large" />
                                <div>
                                    <div className="text-lg font-semibold">{variant.name}</div>
                                    <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Editable Product List */}
                        <div className="mt-6 px-4">
                            <div className="text-base font-medium mb-2">Associated Products</div>
                            <Card padding={"0"}>
                                <div className="divide-y">
                                    {/* Header */}
                                    <div className="grid grid-cols-6 font-medium text-sm p-3 bg-gray-50">
                                        <div className="col-span-5">
                                            <InlineStack gap={"200"}>
                                                <span>Product</span>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.6339 4.36612C10.1457 3.87796 9.35427 3.87796 8.86612 4.36612L6.21967 7.01256C5.92678 7.30546 5.92678 7.78033 6.21967 8.07322C6.51256 8.36612 6.98744 8.36612 7.28033 8.07322L9.75 5.60355L12.2197 8.07322C12.5126 8.36612 12.9874 8.36612 13.2803 8.07322C13.5732 7.78033 13.5732 7.30546 13.2803 7.01256L10.6339 4.36612Z" fill="#CCCCCC" />
                                                    <path d="M13.2803 13.0734L10.6339 15.7198C10.1457 16.208 9.35427 16.208 8.86612 15.7198L6.21967 13.0734C5.92678 12.7805 5.92678 12.3056 6.21967 12.0127C6.51256 11.7198 6.98744 11.7198 7.28033 12.0127L9.75 14.4824L12.2197 12.0127C12.5126 11.7198 12.9874 11.7198 13.2803 12.0127C13.5732 12.3056 13.5732 12.7805 13.2803 13.0734Z" fill="#4A4A4A" />
                                                </svg>
                                            </InlineStack>
                                        </div>
                                        <div className="text-right">Actions</div>
                                    </div>

                                    {products.map((prod: any, index: any) => (
                                        <div key={prod.id} className="grid grid-cols-6 items-center p-3">
                                            <div className="col-span-5 flex items-center gap-3">
                                                {prod.image && (
                                                    <img src={prod.image} alt="product" className="w-10 h-10 object-cover rounded" />
                                                )}
                                                {prod.isNew ? (
                                                    <TextField
                                                        label
                                                        labelHidden
                                                        placeholder="Type or select an item"
                                                        value={prod.title}
                                                        onChange={(val) => handleChange(index, val)}
                                                        autoComplete="off"
                                                    />
                                                ) : (
                                                    <div>
                                                        <div className="font-medium">{prod.title}</div>
                                                        <div className="text-sm text-gray-500">SKU: {prod.sku}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <Button icon={XIcon} variant='plain' onClick={() => handleRemove(index)} tone='critical' />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-3">
                                        <CustomButton onClick={handleAddNewRow} variant='secondary' className='custom-tertiary-btn'>
                                            <InlineStack gap={"200"}>
                                                <Icon source={PlusIcon} />
                                                <Text as="p">Add New Row</Text>
                                            </InlineStack>
                                        </CustomButton>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Footer */}
                        {/* <div className="flex justify-end items-center px-4 py-6 gap-4">
                            <Button onClick={() => { }}>Cancel</Button>
                            <Button variant='primary' onClick={() => { }}>Save</Button>
                        </div> */}
                        <FixedFooter primaryBtnText='Save' secondaryBtnText='Cancel' />
                    </Page>
                </div>
            </div>
        </>
    );
};