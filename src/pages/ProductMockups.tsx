import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Page,
    Text,
    Button,
    Divider,
    Card,
    InlineStack,
} from "@shopify/polaris";
import pItem1 from '../assets/pitem1.png';
import {
    ArrowLeftIcon,
} from '@shopify/polaris-icons';
import Stepper from "../utilityComponents/Stepper";
import FixedFooter from "../components/common/Footer";

const mockupOptions = [
    { label: "Flat", value: "flat" },
    { label: "Wrinkled", value: "wrinkled" },
    { label: "Distressed", value: "distressed" },
    { label: "Model Cropped", value: "model-cropped" },
    { label: "Model - Full", value: "model-full" },
    { label: "Hanging - 1", value: "hanging" },
];

export function ProductMockups() {

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page title="Choose Mockups" titleHidden fullWidth>
                        <div style={{ padding: "20px 0" }}>
                            <InlineStack blockAlign="center" gap={"1200"}>
                                <InlineStack gap={"200"}>
                                    <Button icon={ArrowLeftIcon} />
                                    <Text as="p" variant="heading2xl">Choose Mockups</Text>
                                </InlineStack>
                                <Stepper />
                            </InlineStack>
                        </div>
                        {/* Stepper */}
                        <Divider borderColor="border" />

                        <div style={{ display: "flex", gap: 32, margin: "32px 80px" }}>
                            {/* Left - Preview Box */}
                            <div style={{ flex: 1 }}>
                                <Text as="h3" variant="headingSm" fontWeight="medium" alignment="start">
                                    Mockup Preview
                                </Text>
                                <div
                                    style={{
                                        marginTop: 16,
                                        border: "1px solid #ccc",
                                        borderRadius: 8,
                                        width: "100%",
                                        aspectRatio: "1/1",
                                        backgroundColor: "#fafafa",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontStyle: "italic",
                                        color: "#999",
                                    }}
                                >
                                    Preview Here
                                </div>
                            </div>

                            {/* Right - Mockup Options */}
                            <div style={{ flex: 2 }}>
                                <Text as="h3" variant="headingSm" fontWeight="medium">
                                    All Mockups
                                </Text>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
                                    {mockupOptions.map((option) => (
                                        <div key={option.value} className="choose-mockups-container">
                                            <Card
                                            // onClick={() => setSelectedMockup([option.value])}
                                            // sectioned
                                            // style={{
                                            //     cursor: "pointer",
                                            //     border:
                                            //         selectedMockup.includes(option.value) ? "2px solid #008060" : "1px solid #e1e3e5",
                                            // }}
                                            >
                                                <div className="choose-mockups-checkbox"><input type="checkbox" /></div>
                                                <div style={{ height: 80, background: "#eee", marginBottom: 8 }} />
                                                <Text as="p" alignment="center">{option.label}</Text>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Divider borderColor="border" />
                        {/* Bottom Bar */}
                        <FixedFooter primaryBtnText="Next" content={<div className="flex items-center gap-4">
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