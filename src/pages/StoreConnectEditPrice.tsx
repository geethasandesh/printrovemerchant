import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Badge,
    Text,
    Modal,
} from "@shopify/polaris";
import { useState } from "react";

export function StoreConnectEditPrice() {
    const [retailPrices, setRetailPrices] = useState<any>({
        S: 1224,
        M: 1224,
    });

    const handleRetailChange = (size: string, type: "inc" | "dec") => {
        setRetailPrices((prev: any) => ({
            ...prev,
            [size]: type === "inc" ? prev[size] + 1 : Math.max(prev[size] - 1, 0),
        }));
    };

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Modal
                        open={true}
                        onClose={() => { }}
                        title="Edit Prices"
                        primaryAction={{ content: "Continue", onAction: () => { } }}
                        secondaryActions={[{ content: "Back", onAction: () => { } }]}
                    >
                        <Modal.Section>
                            <div className="space-y-4">
                                <Text variant="headingMd" as="h2">
                                    Product pricing
                                </Text>

                                <Badge tone="info">
                                    Taxes aren’t included. For more info check out our page
                                </Badge>

                                {/* Table header */}
                                <div className="grid grid-cols-3 mt-4 font-medium text-sm text-gray-700 border-b pb-2">
                                    <span>Variant</span>
                                    <span>Printrove price</span>
                                    <span>Retails Price</span>
                                </div>

                                {/* All variants summary row */}
                                <div className="grid grid-cols-3 items-start py-3 border-b text-sm">
                                    <div>All Variants</div>
                                    <div>
                                        <div className="font-semibold">$49.36–$69.48</div>
                                        <div className="text-xs text-gray-500">$44.96 – $46.71 with growth</div>
                                    </div>
                                    <div className="font-medium">$1224 – $1732</div>
                                </div>

                                {/* Individual variant rows */}
                                {["S", "M"].map((size) => (
                                    <div key={size} className="grid grid-cols-3 items-center py-3 border-b text-sm">
                                        <div>{size}</div>
                                        <div>$1,100</div>
                                        <div className="flex items-center gap-2 border rounded px-2 py-1 max-w-[160px]">
                                            <button
                                                className="text-xl px-1"
                                                onClick={() => handleRetailChange(size, "dec")}
                                            >
                                                −
                                            </button>
                                            <span className="flex-1 text-center">${retailPrices[size]}</span>
                                            <button
                                                className="text-xl px-1"
                                                onClick={() => handleRetailChange(size, "inc")}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Section>
                    </Modal>
                </div>
            </div>
        </>
    );
}