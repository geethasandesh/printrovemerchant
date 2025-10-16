import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Card, DataTable, Tabs, Select, Spinner } from "@shopify/polaris";
import { Button } from "../../components/common/Button";
import { CashRupeeIcon, SearchIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from '../../hooks/useFetch';

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
        return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date >= yesterday && date < today) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

export function Credits() {
    const [selected, setSelected] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [lastUpdated, setLastUpdated] = useState("7");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const navigate = useNavigate();

    // Fetch credits data from API
    const { data, isLoading } = useFetch(`/store-credits?page=${currentPage}&limit=${itemsPerPage}`, currentPage);
    //@ts-ignore
    const credits = Array.isArray(data?.data) ? data.data : [];

    //@ts-ignore
    const totalCredits = typeof data?.total === 'number' ? data.total : 0;
    const totalPages = Math.ceil(totalCredits / itemsPerPage);

    const handleTabChange = (selectedTabIndex: number) => {
        setSelected(selectedTabIndex);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleLastUpdatedChange = (value: string) => {
        setLastUpdated(value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => prev - 1);
    };

    // Filter by search and date
    const getDateRangeFilter = (days: number) => {
        const now = Date.now();
        const startDate = now - (days * 24 * 60 * 60 * 1000);
        return (row: any) => {
            const created = new Date(row.createdAt).getTime();
            return created >= startDate && created <= now;
        };
    };

    const filteredRows = credits
        .filter(getDateRangeFilter(parseInt(lastUpdated)))
        .filter((row:any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                formatTimestamp(row.createdAt).toLowerCase().includes(searchLower) ||
                `#${row.bill_number}`.toLowerCase().includes(searchLower) ||
                row.bill_type.toLowerCase().includes(searchLower) ||
                row.amount.toString().toLowerCase().includes(searchLower) ||
                row.payment_status.toLowerCase().includes(searchLower)
            );
        });

    const paginatedRows = filteredRows;

    const tabs = [
        {
            id: 'credits',
            content: 'Credits',
        },
        {
            id: 'payment',
            content: 'Payment',
        },
        {
            id: 'remittance',
            content: 'Remittance',
        },
        {
            id: 'invoice',
            content: 'Invoice',
        },
    ];

    const lastUpdatedOptions = [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last 6 Months', value: '180' },
        { label: 'Last 1 Year', value: '365' },
    ];

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="credits" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#F5F5F5] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Store Credit
                                </h1>
                                <Button 
                                    variant="primary"
                                    size="lg"
                                    className="flex items-center gap-2"
                                    onClick={() => navigate('/credits/billing')}
                                >
                                    <CashRupeeIcon className="w-5 h-5 fill-white" />
                                    Recharge Now
                                </Button>
                            </div>

                            <div className="flex flex-col gap-6">
                            <div className="bg-[#FBFBFB] border border-[#E3E3E3] shadow-[inset_0px_1.2px_0px_rgba(204,204,204,0.5),inset_0px_-1.2px_0px_rgba(0,0,0,0.17)] rounded-lg px-6 py-5">
                                    <h2 className="text-sm font-medium text-[#121212] mb-2">
                                    Balance
                                    </h2>
                                    <div className="text-[28px] font-bold text-[#444444] leading-[36px]">
                                        ₹{data?.balance_amount}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-xl font-bold text-[#000000]">
                                        Balance History
                                    </h2>
                                    
                                    <div className="flex justify-between items-center gap-6">
                                        <div className="min-w-[134px]">
                                            <Select
                                                label=""
                                                labelInline
                                                options={lastUpdatedOptions}
                                                onChange={handleLastUpdatedChange}
                                                value={lastUpdated}
                                            />
                                        </div>
                                        <div className="flex-1 max-w-[360px]">
                                            <div className="relative">
                                            <SearchIcon className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                                <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                                placeholder="Search your order here"
                                                className="w-full h-[32px] px-3 pl-10 text-[13px] text-[#303030] placeholder-[#999999] bg-[#F5F5F5] border border-[#E3E3E3] rounded-[8px] shadow-[inset_0_1px_0_#CCCCCC,inset_0_-1px_0_#0000002C] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Card>
                                        <div className="flex justify-start">
                                            <Tabs
                                                tabs={tabs}
                                                selected={selected}
                                                onSelect={handleTabChange}
                                            />
                                        </div>
                                        <Card>
                                            {isLoading ? (
                                                <div className="flex justify-center py-10"><Spinner size="large" /></div>
                                            ) : (
                                            <DataTable
                                                columnContentTypes={[
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'text',
                                                    'numeric',
                                                ]}
                                                headings={[
                                                    <b>Date issued</b>,
                                                    <b>Bill number</b>,
                                                    <b>Bill type</b>,
                                                    <b>Payment status</b>,
                                                    <b>Amount</b>,
                                                ]}
                                                rows={paginatedRows.map((row: any) => [
                                                    formatTimestamp(row.createdAt),
                                                    `#${row.bill_number}`,
                                                    row.bill_type,
                                                    <span key={row.bill_number} style={{
                                                        backgroundColor: row.payment_status === 'Paid' ? '#CDFEE1' : '#FFE5E5',
                                                        color: row.payment_status === 'Paid' ? '#0C5132' : '#D82C0D',
                                                        padding: '2px 8px',
                                                        borderRadius: '8px',
                                                        fontSize: '12px',
                                                        fontWeight: 550
                                                    }}>
                                                        {row.payment_status}
                                                    </span>,
                                                    <span style={{ textAlign: 'right' }}>
                                                        ₹{row.amount}
                                                    </span>
                                                ])}
                                                hoverable
                                                increasedTableDensity
                                            />
                                            )}
                                            {/* Custom pagination controls */}
                                            <div className="flex justify-end items-center p-4">
                                                <button
                                                    className="px-2 py-1 rounded border text-sm"
                                                    onClick={handlePreviousPage}
                                                    disabled={currentPage === 1}
                                                >
                                                    &lt;
                                                </button>
                                                <span className="mx-2 text-sm text-[#444]">
                                                    {/* Page {currentPage} of {totalPages} */}
                                                </span>
                                                <button
                                                    className="px-2 py-1 rounded border text-sm ml-1"
                                                    onClick={handleNextPage}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        </Card>
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
