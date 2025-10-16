import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Card, Badge, DataTable, Divider, Spinner } from "@shopify/polaris";
import { ChevronDownIcon, BulletIcon } from '@shopify/polaris-icons';
import { useParams } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';
import { Button } from "../../components/common/Button";
import { useFetch } from '../../hooks/useFetch';

export function Info() {
    const {orderId} = useParams();
    const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({});


    // Fetch order details from API
    const { data, isLoading } = useFetch(`/merchant-orders/6831e61f2aad0c7057421664/orders/${orderId}`, orderId ? 1 : 0);
    const apiOrder = (data && typeof data === 'object' && 'data' in data) ? (data as any).data : undefined;
    // Fallback to local order cache created during checkout if API returns nothing
    const localOrder = (() => {
        try {
            const arr = JSON.parse(localStorage.getItem('localOrders') || '[]');
            return Array.isArray(arr) ? arr.find((o: any) => o.orderId === orderId) : undefined;
        } catch { return undefined; }
    })();
    const orderDetails = apiOrder || localOrder;
    console.log({orderDetails});
    const statusSteps = ['Created', 'In Production', 'Fulfilled', 'Delivered'];
    const products: any[] = Array.isArray(orderDetails?.products) ? orderDetails!.products : [];

    const toggleCollapsible = (productId: string) => {
        setOpenCollapsibles(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="orders" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#F5F5F5] min-h-full p-8">
                        <div className="flex gap-8">
                            <div className="flex flex-col gap-8 w-[50vw]">
                                <Card>
                                    <div className="p-6">
                                        {isLoading || !orderDetails ? (
                                            <div className="flex justify-center py-10"><Spinner size="large" /></div>
                                        ) : (
                                        <div className="flex flex-col gap-3">
                                            <h2 className="text-lg font-bold text-[#121212]">Order #{orderDetails.orderId}</h2>
                                            <div className="flex items-center gap-3">
                                                <p className="text-base text-gray-800">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                                                <Badge tone="info" size="large">{orderDetails.orderStatus}</Badge>
                                            </div>
                                            <p className="text-base text-gray-800">Estimated Dispatch date: {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : '-'}</p>

                                            <Button 
                                                variant="primary"
                                                size="lg"
                                                className="flex items-center gap-2 w-[150px]"
                                            >
                                                More Actions
                                                <ChevronDownIcon className="w-5 h-5 fill-white" />
                                            </Button>

                                            <h2 className="text-lg font-bold text-[#121212] mt-6">Order Status</h2>
                                            <ProgressBar currentStatus={orderDetails.orderStatus} statusSteps={statusSteps} />
                                        </div>
                                        )}
                                    </div>
                                </Card>

                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-bold text-[#121212]">Product Information</h2>
                                    <Card>
                                        <div className="">
                                            {isLoading || !orderDetails ? (
                                                <div className="flex justify-center py-10"><Spinner size="large" /></div>
                                            ) : (
                                            <DataTable
                                                columnContentTypes={['text','text','text','text']}
                                                headings={['ID','Name','Status','Price']}
                                                rows={products.map((product: any,index:number) => [
                                                    index + 1,
                                                    product?.sku || product?.name || '-',
                                                    <Badge tone={'info'}>Kitting</Badge>,
                                                    `₹${product?.price || 0}`
                                                ])}
                                                increasedTableDensity
                                            />
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-bold text-[#121212]">Custom Branding</h2>
                                    <div className="flex gap-4">
                                        {/* No branding info in API, so show nothing or placeholder */}
                                        <span className="text-gray-400">No custom branding</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-bold text-[#121212]">Timeline</h2>
                                    <div className="flex flex-col gap-2">
                                        {isLoading || !orderDetails ? (
                                            <div className="flex justify-center py-10"><Spinner size="large" /></div>
                                        ) : (
                                            products.map((product: any) => (
                                                <Card key={product.id}>
                                                    <div className="">
                                                        <button
                                                            onClick={() => toggleCollapsible(product.id)}
                                                            className="w-full text-left"
                                                        >
                                                            <div className="p-4 flex justify-between items-center">
                                                                <span className="text-base font-semibold">{product.id}</span>
                                                                <ChevronDownIcon className={`w-6 h-6 fill-slate-600 ${openCollapsibles[product.id] ? 'rotate-180' : ''}`} />
                                                            </div>
                                                        </button>
                                                        {openCollapsibles[product.id] && (
                                                            <div className="p-4">
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-base flex items-center gap-2"> <BulletIcon className="w-8 h-8 fill-blue-600" /> The product has been shipped</span>
                                                                        <span className="text-sm text-gray-500">-</span>
                                                                    </div>
                                                                    <Divider />
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-base flex items-center gap-2"> <BulletIcon className="w-8 h-8 fill-red-700" /> Quality check completed</span>
                                                                        <span className="text-sm text-gray-500">-</span>
                                                                    </div>
                                                                    <Divider />
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-base flex items-center gap-2"> <BulletIcon className="w-8 h-8 fill-red-700" /> Production started</span>
                                                                        <span className="text-sm text-gray-500">-</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-8 w-[15vw]">
                                <div className="flex flex-col gap-4">
                                    <Card>
                                        <div className="p-1">
                                        <h2 className="text-base font-bold text-[#121212]">Customer Information</h2>
                                            <div className="flex flex-col">
                                                <div className="flex flex-col py-3 border-b border-[#EBEBEB]">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Name</span>
                                                    <span className="text-base font-normal text-[#303030]">{orderDetails?.shippingAddress?.fullName || '-'}</span>
                                                </div>
                                                <div className="flex flex-col py-3 border-b border-[#EBEBEB]">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Customer mail</span>
                                                    <span className="text-base font-normal text-[#303030]">-</span>
                                                </div>
                                                <div className="flex flex-col py-3 border-b border-[#EBEBEB]">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Customer Contact</span>
                                                    <span className="text-base font-normal text-[#303030]">-</span>
                                                </div>
                                                <div className="flex flex-col py-3">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Shipping address</span>
                                                    <span className="text-base font-normal text-[#303030]">{orderDetails?.shippingAddress ? `${orderDetails.shippingAddress.address1}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.country}, ${orderDetails.shippingAddress.zip}` : '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Card>
                                        <div className="p-1">
                                        <h2 className="text-base font-bold text-[#121212]">Order Information</h2>
                                            <div className="flex flex-col">
                                                <div className="flex flex-col py-3 border-b border-[#EBEBEB]">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Reference Number</span>
                                                    <span className="text-base font-normal text-[#303030]">{orderDetails?.orderId || '-'}</span>
                                                </div>
                                                <div className="flex flex-col py-3">
                                                    <span className="text-xs font-bold text-[#272727] opacity-80">Shipping Mode</span>
                                                    <span className="text-base font-normal text-[#303030]">-</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
