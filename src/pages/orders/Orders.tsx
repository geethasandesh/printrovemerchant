import { useState } from 'react';
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Button } from "../../components/common/Button";
import { Card, DataTable, Select, TextField, Tabs, Badge, Spinner } from "@shopify/polaris";
import { SearchIcon, OutboundIcon, IncomingIcon, SortAscendingIcon, SortDescendingIcon } from '@shopify/polaris-icons';
import { StatsRow } from '../../components/StatsRow';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';

export function Orders() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("7");
    const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch orders from API
    const { data, isLoading } = useFetch(`/merchant-orders/6831e61f2aad0c7057421664/orders?page=${currentPage}&limit=${itemsPerPage}`, currentPage);

    //@ts-ignore
    const orders = Array.isArray(data?.data) ? data.data : [];
    console.log(orders);
    //@ts-ignore
    const totalOrders = typeof data?.total === 'number' ? data.total : 0;

    // Filtering and sorting (client-side for now)
    const filteredOrders = orders.filter((order: any) => {
        const searchLower = searchQuery.toLowerCase();
        return searchQuery === "" ||
            order.orderId?.toLowerCase().includes(searchLower) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
            order.orderStatus?.toLowerCase().includes(searchLower);
    });

    const sortedOrders = [...filteredOrders].sort((a: any, b: any) => {
        if (sortDirection === 'ascending') {
            return a.orderId.localeCompare(b.orderId);
        } else {
            return b.orderId.localeCompare(a.orderId);
        }
    });

    const totalPages = Math.ceil(totalOrders / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalOrders);

    const handleSort = () => {
        setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        setCurrentPage(1);
    };

    const dateOptions = [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last 6 Months', value: '180' },
        { label: 'Last 1 Year', value: '365' },
    ];

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Sample stats data (can be replaced with API stats if available)
    const stats = {
        allOrders: totalOrders,
        fulfilled: 0,
        inProduction: 0,
        returnedItems: 0,
        delivered: 0
    };

    const handleOrderClick = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="orders" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#F5F5F5] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Manage Orders
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center gap-2"
                                    >
                                        <IncomingIcon className="w-5 h-5" />
                                        Import Data
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="flex items-center gap-2"
                                    >
                                        <OutboundIcon className="w-5 h-5" />
                                        Export Data
                                    </Button>
                                </div>
                            </div>

                            <StatsRow stats={stats} />

                            <div className="flex justify-between items-center gap-6">
                                <div className="min-w-[134px]">
                                    <Select
                                        label=""
                                        labelInline
                                        options={dateOptions}
                                        onChange={handleDateFilterChange}
                                        value={dateFilter}
                                    />
                                </div>
                                <div className="flex-1 max-w-[360px]">
                                    <TextField
                                        label=""
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        prefix={<SearchIcon className="w-5 h-5 fill-gray-500" />}
                                        placeholder="Search orders"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <Card>
                                <div className="p-5">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex justify-start">
                                            <Tabs
                                                tabs={[
                                                    { id: 'all', content: 'All' },
                                                    { id: 'received', content: 'Received' },
                                                    { id: 'out_of_stock', content: 'Out of stock' },
                                                    { id: 'on_hold', content: 'On hold' },
                                                    { id: 'in_production', content: 'In Production' },
                                                    { id: 'qc_passed', content: 'QC Passed' },
                                                    { id: 'ready_to_dispatch', content: 'Ready to Dispatch' }
                                                ]}
                                                selected={selected}
                                                onSelect={setSelected}
                                            />
                                        </div>

                                        {isLoading ? (
                                            <div className="flex justify-center py-10">
                                                <Spinner size="large" />
                                            </div>
                                        ) : (
                                            <DataTable
                                                columnContentTypes={[
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text'
                                                ]}
                                                headings={[
                                                    '',
                                                    <div
                                                        className="flex items-center gap-1 cursor-pointer"
                                                        onClick={handleSort}
                                                    >
                                                        Orders
                                                        {sortDirection === 'ascending' ?
                                                            <SortAscendingIcon className="w-4 h-4" /> :
                                                            <SortDescendingIcon className="w-4 h-4" />
                                                        }
                                                    </div>,
                                                    'Reference Number',
                                                    'Customer',
                                                    'Status',
                                                    'Shipping mode',
                                                    'Tracking',
                                                    'Delivery'
                                                ]}
                                                rows={sortedOrders.map((order: any) => [
                                                    <input type="checkbox" className="rounded border-gray-400" />,
                                                    <span
                                                        className="text-[#006FEE] cursor-pointer hover:underline"
                                                        onClick={() => handleOrderClick(order.orderId)}
                                                    >
                                                        #{order.orderId}
                                                    </span>,
                                                    <span>ref:34592823</span>,
                                                    order.shippingAddress?.fullName || '',
                                                    <Badge tone={
                                                        order.orderStatus === 'In Transit' ? 'warning' :
                                                            order.orderStatus === 'Out for Delivery' ? 'warning' :
                                                                order.orderStatus === 'Delivered' ? 'success' :
                                                                    order.orderStatus === 'RTO initiated' ? 'info' :
                                                                        order.orderStatus === 'In Production' ? 'info' :
                                                                            order.orderStatus === 'Reversed' ? 'critical' :
                                                                                'critical'
                                                    }>{order.orderStatus}</Badge>,
                                                    'Blue dart air',
                                                    <span className="text-[#005BD3]">1234567890</span>,
                                                    formatDate(order.createdAt)
                                                ])}
                                                hoverable
                                                increasedTableDensity
                                                pagination={{
                                                    hasNext: currentPage < totalPages,
                                                    hasPrevious: currentPage > 1,
                                                    onNext: () => handlePageChange(currentPage + 1),
                                                    onPrevious: () => handlePageChange(currentPage - 1),
                                                    label: `${startIndex + 1}-${endIndex} of ${totalOrders}`
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
