import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import { useState } from "react";
import {
    Page,
    Button,
    Text,
    InlineStack,
    BlockStack,
    Divider,
} from "@shopify/polaris";
import productImg2 from '../assets/productImg2.png';
import pItem1 from '../assets/pitem1.png';
import {
    ArrowLeftIcon,
    HeartIcon,
} from '@shopify/polaris-icons';
import FixedFooter from "../components/common/Footer";
import { ProgressBar } from "./orders/ProgressBar";
import { useNavigate } from "react-router-dom";
const colors = [
    { name: "White", hex: "#ffffff" },
    { name: "Orange", hex: "#f97316" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Gray", hex: "#6b7280" },
    { name: "Green", hex: "#10b981" },
];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
export function ProductProgress({ currentStatus, statusSteps, nextPage }: { currentStatus: string, statusSteps: string[], nextPage: string }) {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState("White");
    const [selectedSize, setSelectedSize] = useState("S");
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />
                <div className="flex-1 bg-white">
                    <Page title="Add Product" titleHidden fullWidth>
                        <div style={{ padding: "20px 0" }}>
                            <InlineStack blockAlign="center" gap={"1200"}>
                                <InlineStack gap={"200"}>
                                    <Button icon={ArrowLeftIcon} />
                                    <Text as="p" variant="heading2xl">Add Product</Text>
                                </InlineStack>
                                <ProgressBar currentStatus={currentStatus} statusSteps={statusSteps} />
                            </InlineStack>
                        </div>
                        <Divider borderColor="border" />
                        {/* Product Details */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 32, maxWidth: "80%", marginLeft: "auto", marginRight: "auto" }}>
                            {/* Left Panel */}
                            <BlockStack gap="500">
                                <InlineStack gap={"200"} align="space-between" blockAlign="center">
                                    <Text as="h2" variant="headingMd">
                                        White Solid Tshirt half sleeves
                                    </Text>
                                    <Button icon={HeartIcon}></Button>
                                </InlineStack>

                                {/* Color Selection */}
                                <BlockStack gap="100">
                                    <Text as="span" variant="bodySm">
                                        Color ({selectedColor})
                                    </Text>
                                    <InlineStack gap="200">
                                        {colors.map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => setSelectedColor(c.name)}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "50%",
                                                    backgroundColor: c.hex,
                                                    border: selectedColor === c.name ? "2px solid black" : "1px solid #ccc",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ))}
                                    </InlineStack>
                                </BlockStack>

                                {/* Size Selection */}
                                <BlockStack gap="100">
                                    <InlineStack gap="200" align="start" blockAlign="center">
                                        <Text as="span" variant="bodySm">
                                            Size
                                        </Text>
                                        <a href="#" style={{ fontSize: 12, color: "#007bff" }}>
                                            Size chart
                                        </a>
                                    </InlineStack>
                                    <InlineStack gap="200">
                                        {sizes.map((size) => (
                                            <Button
                                                key={size}
                                                size="slim"
                                                pressed={selectedSize === size}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </Button>
                                        ))}
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>

                            {/* Right Panel - Product Image */}
                            <div>
                                <img
                                    src={productImg2}
                                    alt="Product"
                                    style={{
                                        width: "100%",
                                        height: "420px",
                                        objectFit: "contain",
                                        borderRadius: 8,
                                    }}
                                />
                            </div>
                        </div>
                        {/* Bottom Bar */}
                        <FixedFooter primaryBtnText="Next" onContinue={() => {
                            navigate(nextPage);
                        }} content={<div className="flex items-center gap-4">
                            <img
                                src={pItem1}
                                alt="Product"
                                className="w-12 h-12 rounded object-cover border"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-800">White Solid Tshirt half sleeves</p>
                                <p className="text-xl font-bold text-gray-900">$21.12</p>
                            </div>
                        </div>} />
                    </Page>
                </div>
            </div>
        </>
    );
}