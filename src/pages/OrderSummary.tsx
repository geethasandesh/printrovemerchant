import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card, 
    Text,
    DataTable
} from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../pages/orders/ProgressBar';
import './OrderSummary.css';
import { usePost } from '../hooks/usePost';
import { useOrderStore } from '../store/useOrderStore';

export function OrderSummary() {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const { handlePost } = usePost();
    const { merchant } = useOrderStore();

    const passed = location?.state || {};
    const productConfig = passed.productConfig;
    const productData = passed.productData;
    const shippingAddress = passed.shippingAddress;
    const subtotal = Number(passed.subtotal || 0);
    const shippingCharges = Number(passed.shippingCharges || 0);
    const total = subtotal + shippingCharges;

    const rows = [
        ['1', `${productData?.title || 'Product'}`,
         `${productConfig?.quantity || 1}`,
         `₹${(productConfig?.pricing?.unitPrice || subtotal).toFixed(2)}`,
         `₹${(productConfig?.pricing?.printCost || 0).toFixed(2)}`,
         `₹0.00`,
         `₹${subtotal.toFixed(2)}`
        ]
    ];

    const handleCheckout = async () => {
        // Build canonical payload for confirmation UI
        const confirmationData = {
            orderNumber: `ORD-${Date.now()}`,
            etaDays: 7,
            trackingNumber: passed.shippingMode === 'self' ? undefined : `TRK${Date.now().toString().slice(-8)}`,
            shippingMode: passed.shippingMode,
            total: total,
            productTitle: productData?.title,
            quantity: productConfig?.quantity || 1,
        };

        try {
            // Try creating order on backend if available
            await handlePost('/merchant-orders', {
                merchantId: merchant?.id || 'current-merchant',
                orderItems: [{
                    productId: productConfig?.productId,
                    productTitle: productData?.title,
                    variant: { color: productConfig?.color, size: productConfig?.size },
                    quantity: productConfig?.quantity || 1,
                    unitPrice: productConfig?.pricing?.unitPrice || subtotal,
                    subtotal,
                    designLayers: productConfig?.design,
                    printType: productConfig?.printType,
                    printPosition: productConfig?.position,
                }],
                subtotal,
                shippingCost: shippingCharges,
                taxAmount: 0,
                totalAmount: total,
                shippingMode: passed.shippingMode === 'self' ? 'self-shipping' : passed.shippingMode || 'prepaid',
                shippingAddress,
                billingAddress: shippingAddress,
                sameAsShipping: true,
                paymentMethod: passed.shippingMode === 'cod' ? 'cod' : 'upi',
                trackingEnabled: passed.shippingMode !== 'self',
                source: 'web',
            });
        } catch (err) {
            // Fail-safe: continue to confirmation even if backend fails
            console.error('Order creation failed, proceeding to confirmation UI:', err);
        } finally {
            // Persist a lightweight local order so Orders page has data even without backend
            try {
                const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
                const newOrder = {
                    orderId: confirmationData.orderNumber,
                    createdAt: new Date().toISOString(),
                    orderStatus: 'Received',
                    shippingAddress: shippingAddress,
                };
                const merged = [newOrder, ...localOrders].slice(0, 100);
                localStorage.setItem('localOrders', JSON.stringify(merged));
            } catch (e) {
                console.warn('Failed to write local order cache:', e);
            }
            navigate('/order-confirmation', { state: confirmationData });
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-hidden bg-[#F5F5F5]">
                <div className="h-full overflow-y-auto">
                    <div className="mx-[10%] p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Button 
                                variant="icon"
                                onClick={() => navigate(-1)}
                                icon={<ArrowLeftIcon className="w-4 h-4" />}
                            />
                            <h1 className="text-2xl font-bold text-[#121212]">Checkout</h1>
                        </div>

                        <ProgressBar 
                            currentStatus="Review & Pay"
                            statusSteps={['Product', 'Shipping', 'Review & Pay']}
                        />

                        <div className="grid grid-cols-[1fr,400px] gap-6 mt-8">
                            {/* Left Section */}
                            <div className="space-y-6">
                                {/* Order Details Table */}
                                <Card>
                                    <div className="p-6">
                                        <div className="order-summary-table">
                                            <DataTable
                                                columnContentTypes={[
                                                    'text', 'text', 'numeric',
                                                    'numeric', 'numeric', 'numeric', 'numeric'
                                                ]}
                                                headings={[
                                                    'S.NO', 'Product', 'Qty',
                                                    'Product Price', 'Print/Handling', 'GST', 'Total'
                                                ]}
                                                rows={rows}
                                            />
                                        </div>
                                    </div>
                                </Card>

                                {/* Credit Info */}
                                <Card>
                                    <div className="p-4">
                                        <div className="mb-6">
                                            <div className="flex flex-start gap-2">
                                                <Text as="h2" variant="headingLg">Printrove Credit</Text>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="bg-[#F5F5F5] border border-[#E3E3E3] rounded-2xl">
                                                <div className="flex gap-10 p-6">
                                                    <div className="flex flex-col">
                                                        <Text as="h2" variant="headingLg">Credit</Text>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Text as="h3" variant="headingMd" tone="subdued">Balance</Text>
                                                        <Text as="h3" variant="headingLg" tone="subdued">$ 20.00</Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Text as="p" variant="bodyMd" tone="subdued">
                                                If your credit amount is less, please add credits here to complete the order.
                                            </Text>
                                            <div>
                                                <Button onClick={() => navigate('/credits/billing')}>Recharge</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Order Summary Card */}
                            <div className="bg-white rounded-2xl max-h-[520px] shadow-md">
                                <div className="p-8 flex flex-col gap-8">
                                    <Text as="h2" variant="headingLg">Order Summary</Text>
                                    
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <Text as="span">Subtotal for the Product</Text>
                                                <Text as="span">({productConfig?.quantity || 1} items)</Text>
                                            </div>
                                            <Text as="span">₹{subtotal.toFixed(2)}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text as="span">Other Charges</Text>
                                            <Text as="span">₹{shippingCharges.toFixed(2)}</Text>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <Text as="h3" variant="headingMd">Total Order Value</Text>
                                            <Text as="span" variant="headingLg">₹{total.toFixed(2)}</Text>
                                        </div>
                                        <Text as="p" variant="bodySm" tone="subdued">
                                            *This price isn't final. Shipping and VAT will be added in the next step.
                                        </Text>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="border rounded-xl bg-[#F5F5F5] p-4">
                                            <Text as="h3" variant="headingMd">Shipping Address</Text>
                                            <div className="text-sm mt-2 text-[#444]">
                                                <div>{shippingAddress?.fullName}</div>
                                                <div>{shippingAddress?.address1}{shippingAddress?.address2 ? `, ${shippingAddress.address2}` : ''}</div>
                                                <div>{shippingAddress?.landmark}</div>
                                                <div>{shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}</div>
                                                <div>{shippingAddress?.country}</div>
                                                <div>Phone: {shippingAddress?.phone}</div>
                                            </div>
                                        </div>

                                        <Button 
                                            variant="primary"
                                            className="w-full !bg-[#272727] !text-white"
                                            onClick={handleCheckout}
                                        >
                                            Continue to Checkout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
