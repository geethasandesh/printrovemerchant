import { useState } from 'react';
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Button } from "../../components/common/Button";
import { PageAddIcon, SearchIcon } from '@shopify/polaris-icons';
import { useParams } from 'react-router-dom';
import { collections } from './collections';
import { Select } from '@shopify/polaris';
import { ProductRecommendation } from '../../components/ProductRecommendation';

export function Collection() {
    const { collectionId } = useParams();
    const [sortValue, setSortValue] = useState('newest');
    const [searchValue, setSearchValue] = useState('');

    const sampleProducts = [
        {
            id: "1",
            title: "Classic T-Shirt",
            sizes: ["S", "M", "L", "XL", "2XL"],
            colorImageMap: {
                "white": {
                    color: "#FFFFFF",
                    path: "/product-img-white.png"
                },
                "red": {
                    color: "#FF0000",
                    path: "/product-img-red.png"
                },
                "blue": {
                    color: "#0000FF",
                    path: "/product-img-blue.png"
                }
            },
            hoverImage: "/blue-hoodie.png",
            showCheckbox: true
        },
        {
            id: "2",
            title: "Classic T-Shirt",
            sizes: ["S", "M", "L", "XL", "2XL"],
            colorImageMap: {
                "white": {
                    color: "#FFFFFF",
                    path: "/product-img-white.png"
                },
                "red": {
                    color: "#FF0000",
                    path: "/product-img-red.png"
                },
                "blue": {
                    color: "#0000FF",
                    path: "/product-img-blue.png"
                }
            },
            hoverImage: "/blue-hoodie.png",
            showCheckbox: true
        },
        {
            id: "3",
            title: "Classic T-Shirt",
            sizes: ["S", "M", "L", "XL", "2XL"],
            colorImageMap: {
                "white": {
                    color: "#FFFFFF",
                    path: "/product-img-white.png"
                },
                "red": {
                    color: "#FF0000",
                    path: "/product-img-red.png"
                },
                "blue": {
                    color: "#0000FF",
                    path: "/product-img-blue.png"
                }
            },
            hoverImage: "/blue-hoodie.png",
            showCheckbox: true
        },
        {
            id: "4",
            title: "Classic T-Shirt",
            sizes: ["S", "M", "L", "XL", "2XL"],
            colorImageMap: {
                "white": {
                    color: "#FFFFFF",
                    path: "/product-img-white.png"
                },
                "red": {
                    color: "#FF0000",
                    path: "/product-img-red.png"
                },
                "blue": {
                    color: "#0000FF",
                    path: "/product-img-blue.png"
                }
            },
            hoverImage: "/blue-hoodie.png",
            showCheckbox: true
        },
        {
            id: "5",
            title: "Classic T-Shirt",
            sizes: ["S", "M", "L", "XL", "2XL"],
            colorImageMap: {
                "white": {
                    color: "#FFFFFF",
                    path: "/product-img-white.png"
                },
                "red": {
                    color: "#FF0000",
                    path: "/product-img-red.png"
                },
                "blue": {
                    color: "#0000FF",
                    path: "/product-img-blue.png"
                }
            },
            hoverImage: "/blue-hoodie.png",
            showCheckbox: true
        }
    ];

    return (
        <div className="dashboard-page h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="templates" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#FFFFFF] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    <span className="text-[#6B7280] mr-2">Collection |</span>
                                    {collectionId && (
                                        <span className="text-[#121212]">{collections.find(c => c.id === collectionId)?.name}</span>
                                    )}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Button 
                                        variant="primary"
                                        size="lg"
                                        className="flex items-center gap-2"
                                    >
                                        <PageAddIcon className="w-5 h-5 fill-white" />
                                        Create Product Templates
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <div className="w-48">
                                        <Select
                                            label=""
                                            options={[
                                                {label: 'New to Old', value: 'newest'},
                                                {label: 'Old to New', value: 'oldest'},
                                            ]}
                                            value={sortValue}
                                            onChange={setSortValue}
                                        />
                                    </div>
                                    <div className="w-[360px]">
                                        <div className="flex items-center h-[32px] px-3 bg-[#F3F3F3] border border-[#E1E1E1] rounded-md">
                                            <SearchIcon className="w-4 h-4 text-gray-500" />
                                            <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="Search your order here"
                                            className="ml-2 flex-1 bg-transparent outline-none text-sm text-[#121212] placeholder-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {sampleProducts.map((product) => (
                                        <ProductRecommendation
                                            key={product.id}
                                            {...product}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 