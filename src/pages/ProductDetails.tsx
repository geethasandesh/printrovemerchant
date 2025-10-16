import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import { useState } from "react";
import {
    Page,
    Text,
    Button,
    InlineStack,
    BlockStack,
    Divider,
    TextField,
    Checkbox,
    Tooltip,
    Icon,
    Card,
    DataTable,
} from "@shopify/polaris";
import pItem1 from '../assets/pitem1.png';
import {
    ArrowLeftIcon,
    InfoIcon
} from '@shopify/polaris-icons';
import Stepper from "../utilityComponents/Stepper";
import FixedFooter from "../components/common/Footer";

export function ProductDetails() {
    const [description, setDescription] = useState("");
    const [attachSizeTable, setAttachSizeTable] = useState(false);
    const [attachCareInstructions, setAttachCareInstructions] = useState(true);
    const metricRows = [
        ['S', '71.1', '91.4', '45.7'],
        ['M', '73.7', '101.6', '50.8'],
        ['L', '76.2', '111.8', '55.9'],
        ['XL', '78.7', '122', '61'],
        ['2XL', '81.3', '132', '66'],
        ['3XL', '83.8', '142.2', '71.1'],
        ['4XL', '85', '152', '76'],
        ['5XL', '88.8', '162.6', '81.3'],
    ];

    const imperialRows = [
        ['S', '28', '36', '18'],
        ['M', '29', '40', '20'],
        ['L', '30', '44', '22'],
        ['XL', '31', '48', '24'],
        ['2XL', '32', '52', '26'],
        ['3XL', '33', '56', '28'],
        ['4XL', '33.5', '59.8', '29.9'],
        ['5XL', '35', '64', '32'],
    ];

    const careInstructionRows = [
        [
            'General',
            'A top-choice garment known for its softness, durability, and compatibility with DTG printing, making it a favorite in both retail and promotional markets.',
        ],
        [
            'Wash',
            "Maintain the tee's quality by washing it in cold water, which helps preserve the fabric and the vibrancy of the print.",
        ],
        [
            'Dry',
            'Tumble dry on a low setting or hang dry to retain the shape and size of the tee post-wash.',
        ],
        [
            'Store',
            'Store in a cool, dry place away from direct sunlight to maintain the integrity of the fabric and colors.',
        ],
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

                        {/* Content Section */}
                        <div
                            style={{
                                marginTop: 32,
                                background: "#fff",
                                padding: 24,
                                borderRadius: 12,
                                display: "flex",
                                gap: 32,
                            }}
                        >
                            {/* Left Side Preview Box */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
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
                                    Preview
                                </div>
                            </div>

                            {/* Right Side Form */}
                            <div style={{ flex: 2 }}>
                                <BlockStack gap="500">
                                    {/* <div>
                                        <InlineStack align="start" gap="100">
                                            <Text as="p" variant="bodyMd" fontWeight="medium">Choose Product Language</Text>
                                            <Tooltip content="Select the language for your product details">
                                                <Icon source={InfoIcon} tone="base" />
                                            </Tooltip>
                                        </InlineStack>
                                        <TextField label="" labelHidden autoComplete="off" />
                                    </div> */}

                                    <div>
                                        <InlineStack align="start" gap="100">
                                            <Text as="p" variant="bodyMd" fontWeight="medium">Product Title</Text>
                                            <Tooltip content="Enter the title that will appear in your listing">
                                                <Icon source={InfoIcon} tone="base" />
                                            </Tooltip>
                                        </InlineStack>
                                        <TextField label="" labelHidden autoComplete="off" placeholder="Enter your last name here" />

                                    </div>

                                    <div>
                                        <InlineStack align="start" gap="100">
                                            <Text as="p" variant="bodyMd" fontWeight="medium">Description</Text>
                                            <Tooltip content="Give your product a clear and concise description">
                                                <Icon source={InfoIcon} tone="base" />
                                            </Tooltip>
                                        </InlineStack>
                                        <TextField
                                            label
                                            labelHidden
                                            autoComplete="off"
                                            multiline={4}
                                            placeholder="Value"
                                            value={description}
                                            onChange={setDescription}
                                        />
                                    </div>
                                </BlockStack>

                                <Divider borderColor="border" />

                            </div>
                        </div>

                        <Divider borderColor="border" />

                        <div style={{ display: 'grid', gap: '1rem' }} className="mb-20">
                            <Card>
                                <Checkbox
                                    label="Attach size table"
                                    checked={attachSizeTable}
                                    onChange={setAttachSizeTable}
                                />
                                {attachSizeTable && (
                                    <>
                                        <Card>
                                            <Text variant="headingSm" as="h3">Choose metric measurement system</Text>
                                            <DataTable
                                                columnContentTypes={['text', 'text', 'text', 'text']}
                                                headings={['', 'Length (cm)', 'Width (cm)', 'Half Chest (cm)']}
                                                rows={metricRows}
                                            />
                                        </Card>

                                        <Card>
                                            <Text variant="headingSm" as="h3">Choose imperial measurement system</Text>
                                            <DataTable
                                                columnContentTypes={['text', 'text', 'text', 'text']}
                                                headings={['', 'Length (inches)', 'Width (inches)', 'Half Chest (inches)']}
                                                rows={imperialRows}
                                            />
                                        </Card>
                                    </>
                                )}
                            </Card>

                            <Card>
                                <Checkbox
                                    label="Attach care instructions"
                                    checked={attachCareInstructions}
                                    onChange={setAttachCareInstructions}
                                />
                                {attachCareInstructions && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                            <Text as="span" fontWeight="regular" variant="bodySm">
                                                Care Instructions
                                            </Text>
                                            <Text as="span" variant="bodySm" tone="subdued">
                                                You can edit care instructions in your store’s platform
                                            </Text>
                                        </div>

                                        <div style={{ marginTop: '16px' }}>
                                            <DataTable
                                                columnContentTypes={['text', 'text']}
                                                headings={['', '']}
                                                rows={careInstructionRows}
                                                verticalAlign="top"
                                            />
                                        </div>
                                    </>
                                )}
                            </Card>
                        </div>

                        {/* Bottom Summary Bar */}
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