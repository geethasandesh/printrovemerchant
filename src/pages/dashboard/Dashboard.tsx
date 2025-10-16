import { DataTable, Card, InlineGrid, Select } from '@shopify/polaris';
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { PLineChart } from '../../components/OrdersChart';
import { ProductRecommendation } from '../../components/ProductRecommendation';
import eightySixLogo from '../../assets/eighty-six-logo.png';
import exploreLogo from '../../assets/explore-logo.png';
import { useState } from 'react';
import { dashboardProducts } from '../../store/products';
export function Dashboard() {
    const rows = [
        [250, 250, 250, 250],
    ];

    const [selected, setSelected] = useState('30');

    const handleSelectChange = (value: string) => {
        setSelected(value);
    };

    const selectOptions = [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last 6 Months', value: '180' },
        { label: 'Last 1 Year', value: '365' },
    ];

    return (
        <div className="dashboard-page h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="dashboard" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#FFFFFF] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Dashboard
                                </h1>
                                <div className="flex items-center gap-4">
                                    <p className="text-[#616771] text-base">
                                        Last Updated : 10 minutes ago
                                    </p>
                                    <div className="min-w-[180px]">
                                        <Select
                                            label=""
                                            labelInline
                                            options={selectOptions}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <PLineChart
                                        chartName="Orders"
                                        currentValue={239}
                                        previousValue={228}
                                        changePercentage={2.25}
                                    />
                                    <PLineChart
                                        chartName="Revenue"
                                        prefix="$"
                                        currentValue={239.34}
                                        previousValue={228.17}
                                        changePercentage={2.25}
                                    />
                                    <PLineChart
                                        chartName="Profit"
                                        prefix="$"
                                        currentValue={1202.02}
                                        previousValue={1128.17}
                                        changePercentage={2.25}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1.5">
                                        <PLineChart 
                                            chartName="Expenses"
                                            prefix="$"
                                            currentValue={228.17}
                                            previousValue={239.34}
                                            changePercentage={-2.25}
                                        />
                                    </div>
                                    <div className="col-span-1.5">
                                        <PLineChart 
                                            chartName="Orders"
                                            currentValue={239}
                                            previousValue={228}
                                            changePercentage={2.25}                                        
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-[#121212]">
                                    COD Status
                                </h2>
                                <div className="bg-white rounded-xl border border-[#E3E3E3] overflow-hidden">
                                    <DataTable
                                        columnContentTypes={[
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                            'numeric',
                                        ]}
                                        headings={[
                                            'Delivery Pending',
                                            'Delivered',
                                            'Remittance Available',
                                            'Last Remittance',
                                        ]}
                                        rows={rows}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-[#121212]">
                                    Printrove Recommendations
                                </h2>
                                <div className="grid grid-cols-4 gap-6">
                                    {dashboardProducts.map((product) => (
                                    <ProductRecommendation
                                        key={product.id}
                                        id={product.id}
                                        title={product.name}
                                        price={product.price}
                                        discount={product.discount}
                                        sizes={product.sizes}
                                        currency={product.currency}
                                        colorImageMap={product.colorImageMap}
                                    />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-[#121212]">
                                    Your top selling products
                                </h2>
                                <div className="grid grid-cols-4 gap-6">
                                {dashboardProducts.map((product) => (
                                        <ProductRecommendation
                                            key={product.id}
                                            id={product.id}
                                            title={product.name}
                                            price={product.price}
                                            discount={product.discount}
                                            sizes={product.sizes}
                                            currency={product.currency}
                                            colorImageMap={product.colorImageMap}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-[#121212]">
                                    Your top selling designs
                                </h2>
                                <InlineGrid columns={4} gap="400">
                                    <Card>
                                        <div className="p-4 aspect-square flex items-center justify-center">
                                            <img src={eightySixLogo} alt="Eighty Six Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="p-4 aspect-square flex items-center justify-center">
                                            <img src={exploreLogo} alt="Explore Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="p-4 aspect-square flex items-center justify-center">
                                            <img src={eightySixLogo} alt="Eighty Six Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </Card>
                                    <Card>
                                        <div className="p-4 aspect-square flex items-center justify-center">
                                            <img src={exploreLogo} alt="Explore Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </Card>
                                </InlineGrid>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
