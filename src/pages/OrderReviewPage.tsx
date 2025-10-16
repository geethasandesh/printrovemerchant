import {
    Page,
    Card,
    Text,
    Icon,
    BlockStack,
    InlineStack,
} from '@shopify/polaris';
import { CreditCardIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import { Button as CustomBtn } from '../components/common/Button';

export function OrderReviewPage() {
    const orderItems = [
        { sn: 1, product: 'Inner Necklable', qty: 1000, rate: 5, gst: 220, total: 5000 },
        { sn: 2, product: 'Outer Necklable', qty: 1000, rate: 7, gst: 220, total: 7000 },
        { sn: 3, product: 'Packins', qty: 1000, rate: 7, gst: 50, total: 7000 },
    ];

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-[#F9FAFB] p-8">
                    <Page
                        // backAction={
                        //     {
                        //         content: `Order Review`,
                        //         onAction: () => {

                        //         },
                        //     }
                        // }
                        // title={`Order Review`}
                        fullWidth>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Section */}
                            <div className="col-span-2 space-y-4">
                                {/* Table */}
                                <div className="rounded-[15px] shadow-md">
                                    <Card padding="0">
                                        <div className="overflow-auto">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead className="text-xs font-semibold uppercase text-gray-600">
                                                    <tr>
                                                        <th className="p-3">S.NO</th>
                                                        <th className="p-3">Product</th>
                                                        <th className="p-3">Qty</th>
                                                        <th className="p-3">Rate</th>
                                                        <th className="p-3">GST</th>
                                                        <th className="p-3">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderItems.map((item, index) => (
                                                        <tr key={index} className="border-t">
                                                            <td className="p-3">{item.sn}</td>
                                                            <td className="p-3">{item.product}</td>
                                                            <td className="p-3">{item.qty}</td>
                                                            <td className="p-3">{item.rate}</td>
                                                            <td className="p-3">{item.gst}</td>
                                                            <td className="p-3">{item.total}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="border-t font-semibold">
                                                        <td colSpan={5} className="p-3 text-right">Total Rs.</td>
                                                        <td className="p-3">500</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                </div>

                                {/* Printrove Credit */}
                                <Card>
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span><Icon source={CreditCardIcon} tone="base" /></span>
                                            <div className='text-xl font-bold'>Printrove Credit</div>
                                        </div>
                                        <Card background='bg'>
                                            <InlineStack gap={"500"} blockAlign='center'>
                                                <Text variant="headingMd" as="h5">Credit</Text>
                                                <BlockStack gap={"050"}>
                                                    <Text variant="headingMd" as="h5" tone='subdued'>Balance</Text>
                                                    <Text as='p' variant='headingMd'>₹ 20.00</Text>
                                                </BlockStack>
                                            </InlineStack>
                                        </Card>
                                        <Text as="p" tone="subdued">
                                            If your credit amount is less, please add credits here to complete the order.
                                        </Text>
                                        <CustomBtn variant='primary' size='lg'>Recharge</CustomBtn>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Section - Summary */}
                                <div className="self-start">
                                <Card padding="0">
                                    <div className="p-[30px] space-y-6">
                                    <div className="text-2xl font-semibold">Order Summary</div>
                                    <div className="text-sm space-y-3">
                                        <div className="flex justify-between">
                                        <span>Subtotal for the Product (3 items)</span>
                                        <span>202</span>
                                        </div>
                                        <div className="flex justify-between">
                                        <span>Other Charges</span>
                                        <span>20</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between font-bold text-base">
                                        <span>Total Order Value</span>
                                        <span>202</span>
                                        </div>
                                        <p className="text-xs">
                                            <p className="text-xs">
                                                <Text as="span" tone="subdued">
                                                    *This price isn’t final. Shipping and VAT will be added in the next step.
                                                </Text>
                                            </p>
                                        </p>
                                    </div>
                                    <CustomBtn variant="primary" size="lg" className="w-full">
                                        Continue to Checkout
                                    </CustomBtn>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Page>
                </div>
            </div>
        </>
    );
}
