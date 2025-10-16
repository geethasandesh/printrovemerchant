import { useState } from 'react';
import { Navbar } from "../../layout/Navbar";
import { SideMenu } from "../../layout/SideMenu";
import { Select, TextField, Badge, IndexTable, useBreakpoints, useIndexResourceState } from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';

interface InventoryItem {
    id: string;
    orderNumber: string;
    productImage: string;
    productName: string;
    sku: string;
    status: 'Not Listed' | 'Active';
    availableStock: number;
    amount: number;
    [key: string]: unknown;
}

export function Inventory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('7');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const inventoryItems: InventoryItem[] = [
        {
            id: '1',
            orderNumber: '#2050',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Butter Yellow 3XL Men Round',
            sku: '215454642',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '2',
            orderNumber: '#2049',
            productImage: '/thumbnail-pink-tshirt.png',
            productName: 'Butter Yellow 3XL Men Round',
            sku: '215454642',
            status: 'Active',
            availableStock: 50,
            amount: 500.00
        },
        {
            id: '3',
            orderNumber: '#2048',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Classic Black L Men Round',
            sku: '215454643',
            status: 'Active',
            availableStock: 25,
            amount: 450.00
        },
        {
            id: '4',
            orderNumber: '#2047',
            productImage: '/thumbnail-pink-tshirt.png',
            productName: 'Ocean Blue XL Women V-Neck',
            sku: '215454644',
            status: 'Not Listed',
            availableStock: 15,
            amount: 550.00
        },
        {
            id: '5',
            orderNumber: '#2046',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Active',
            availableStock: 30,
            amount: 600.00
        },
        {
            id: '6',
            orderNumber: '#2045',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '7',
            orderNumber: '#2044',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '8',
            orderNumber: '#2043',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '9',
            orderNumber: '#2042',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '10',
            orderNumber: '#2041',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '11',
            orderNumber: '#2040',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '12',
            orderNumber: '#2039',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '13',
            orderNumber: '#2038',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        },
        {
            id: '14',
            orderNumber: '#2037',
            productImage: '/thumbnail-maroon-tshirt.png',
            productName: 'Forest Green M Men Polo',
            sku: '215454645',
            status: 'Not Listed',
            availableStock: 10,
            amount: 500.00
        }
    ];

    const dateOptions = [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
    ];

    const getStatusBadge = (status: string) => {
        const tone = status === 'Active' ? 'success' : undefined;
        return <Badge tone={status === 'Not Listed' ? undefined : tone}>{status}</Badge>;
    };

    const getProductCell = (productImage: string, productName: string, sku: string) => (
        <div className="flex items-center gap-3">
            <img 
                src={productImage} 
                alt={productName} 
                className="w-12 h-12 rounded object-cover"
            />
            <div>
                <div className="font-semibold text-sm">{productName}</div>
                <div className="text-sm text-gray-500">SKU: {sku}</div>
            </div>
        </div>
    );

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(inventoryItems);

    const filteredItems = inventoryItems.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return searchQuery === "" || 
            item.orderNumber.toLowerCase().includes(searchLower) ||
            item.productName.toLowerCase().includes(searchLower) ||
            item.sku.toLowerCase().includes(searchLower) ||
            item.status.toLowerCase().includes(searchLower);
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const rowMarkup = paginatedItems.map(
        (
          {id, orderNumber, productImage, productName, sku, status, availableStock, amount},
          index,
        ) => (
          <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            position={index}
          >
            <IndexTable.Cell>
              <span className="font-bold">
                {orderNumber}
              </span>
            </IndexTable.Cell>
            <IndexTable.Cell>{getProductCell(productImage, productName, sku)}</IndexTable.Cell>
            <IndexTable.Cell>{getStatusBadge(status)}</IndexTable.Cell>
            <IndexTable.Cell>{availableStock}</IndexTable.Cell>
            <IndexTable.Cell>
              <span className="text-right">
                {amount}
              </span>
            </IndexTable.Cell>
          </IndexTable.Row>
        ),
      );

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideMenu activeTab="inventory" />
                <div className="flex-1 overflow-auto">
                    <div className="bg-[#F5F5F5] min-h-full p-8">
                        <div className="flex flex-col gap-8 max-w-[70vw]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-[#121212]">
                                    Inventory
                                </h1>
                            </div>

                            <div className="flex justify-between items-center gap-6">
                                <div className="min-w-[134px]">
                                    <Select
                                        label=""
                                        labelInline
                                        options={dateOptions}
                                        onChange={setDateFilter}
                                        value={dateFilter}
                                    />
                                </div>
                                <div className="flex-1 max-w-[360px]">
                                    <TextField
                                        label=""
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        prefix={<SearchIcon className="w-5 h-5 fill-gray-500"/>}
                                        placeholder="Search your order here"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="border border-[#E3E3E3] rounded-lg overflow-hidden">
                                <IndexTable
                                    condensed={useBreakpoints().smDown}
                                    resourceName={resourceName}
                                    itemCount={filteredItems.length}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    headings={[
                                        {title: 'Order'},
                                        {title: 'Product'},
                                        {title: 'Status'},
                                        {title: 'Available Stock'},
                                        {title: 'Amount'},
                                    ]}
                                    pagination={{
                                        hasNext: currentPage < totalPages,
                                        hasPrevious: currentPage > 1,
                                        onNext: () => setCurrentPage(prev => prev + 1),
                                        onPrevious: () => setCurrentPage(prev => prev - 1),
                                        label: `${startIndex + 1}-${endIndex} of ${filteredItems.length}`
                                    }}
                                >
                                    {rowMarkup}
                                </IndexTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 