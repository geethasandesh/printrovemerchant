import {
    Page,
    InlineStack,
    Text,
    Divider,
    Button,
    BlockStack,
    Select,
    TextField,
    ButtonGroup,
    Card,
} from "@shopify/polaris";
import { useState } from "react";
import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import {
    ArrowLeftIcon,
    MinusIcon,
    PlusIcon
} from '@shopify/polaris-icons';

import pItem1 from '../assets/pitem1.png';
import Stepper from "../utilityComponents/Stepper";
import FixedFooter from "../components/common/Footer";
import { Button as CustomBtn } from "../components/common/Button";

export function ProductPricing() {
    const [increaseBy, setIncreaseBy] = useState("percentage");
    const [value, setValue] = useState("10");

    const variants = [
        { size: "S", printPrice: "$10.00", retailPrice: "$12.24", earnings: "$1.24" },
        { size: "M", printPrice: "$10.00", retailPrice: "$12.24", earnings: "$1.24" },
    ];

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
                        <Divider borderColor="border" />

                        {/* Pricing Box */}
                        <Card>
                            <div
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: 12,
                                }}
                            >
                                <BlockStack gap="200">
                                    <Text as="p" variant="headingMd" fontWeight="medium">
                                        Product pricing
                                    </Text>
                                    <Text as="p" variant="bodySm" tone="subdued">
                                        Taxes aren’t included. For more info check out our page
                                    </Text>
                                </BlockStack>

                                {/* Pricing Control */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "end",
                                        gap: 8,
                                        marginTop: 16,
                                        marginBottom: 16,
                                    }}
                                >
                                    <Select
                                        options={[
                                            { label: "increase retail price", value: "percentage" },
                                            { label: "increase retail value", value: "fixed" },
                                        ]}
                                        value={increaseBy}
                                        placeholder="increase retail price"
                                        onChange={setIncreaseBy} label={undefined} />
                                    <Select
                                        options={[
                                            { label: "%", value: "percentage" },
                                            { label: "$", value: "fixed" },
                                        ]}
                                        value={increaseBy}
                                        onChange={setIncreaseBy} label={undefined} />
                                    <TextField label labelHidden type="number" value={value} onChange={setValue} autoComplete="off" />
                                    <CustomBtn variant="primary">Set</CustomBtn>
                                </div>
                                <Divider />
                                {/* Table Header */}
                                <div style={{ display: "flex", fontWeight: 600, marginTop: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">Variant</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">By Size</Text>
                                        </BlockStack>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">Printrove price</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">Range varies by color, size, and fulfilment locatiion</Text>
                                        </BlockStack>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">Retails Price</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">How much customer will pay</Text>
                                        </BlockStack>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">Estimated Earning</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">Retail price minus printrove price</Text>
                                        </BlockStack>
                                    </div>
                                </div>
                                <Divider />
                                {/* All Variants Summary */}
                                <div style={{ display: "flex", marginTop: 12 }}>
                                    <div style={{ flex: 1 }}>All Variants</div>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">$4.36 – $6.48</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">$44.96 - $46.71 with growth</Text>
                                        </BlockStack>
                                    </div>
                                    <div style={{ flex: 1 }}>$12.24 – $17.32</div>
                                    <div style={{ flex: 1 }}>
                                        <BlockStack gap={"200"}>
                                            <Text as="p" variant="headingMd">$3.45-$16.85</Text>
                                            <Text as="p" variant="bodyMd" tone="subdued">$44.96 - $46.71 with growth</Text>
                                        </BlockStack>
                                    </div>
                                </div>

                                {/* Per Variant */}
                                {variants.map((variant, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 12,
                                            paddingTop: 12,
                                            borderTop: "1px solid #eee",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>{variant.size}</div>
                                        <div style={{ flex: 1 }}>{variant.printPrice}</div>
                                        <div style={{ flex: 1 }}>
                                            <ButtonGroup>
                                                <Button size="slim" icon={MinusIcon} />
                                                <TextField label labelHidden value="12.24" onChange={() => { }} autoComplete="off" />
                                                <Button size="slim" icon={PlusIcon} />
                                            </ButtonGroup>
                                        </div>
                                        <div style={{ flex: 1 }}>{variant.earnings}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

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
