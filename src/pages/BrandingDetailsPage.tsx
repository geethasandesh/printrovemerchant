import {
    Page,
    Card,
    IndexTable,
    Thumbnail,
    Badge,
    useIndexResourceState,
    BlockStack,
    InlineStack,
} from '@shopify/polaris';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import pItem1 from '../assets/customBrandImg.png';
const items = [
    {
        id: '1',
        image: pItem1,
        name: 'Inner Necklable',
        sku: '79066160',
        status: 'Printing',
        variants: 5,
        available: 200,
    },
    {
        id: '2',
        image: pItem1,
        name: 'Outer Necklable',
        sku: '79066160',
        status: 'Printing',
        variants: 4,
        available: 100,
    },
    {
        id: '3',
        image: pItem1,
        name: 'Hangtag',
        sku: '79066160',
        status: 'Printing',
        variants: 4,
        available: 200,
    },
    {
        id: '4',
        image: pItem1,
        name: 'Packins',
        sku: '79066160',
        status: 'Printing',
        variants: 4,
        available: 200,
    },
    {
        id: '5',
        image: pItem1,
        name: 'Polybags',
        sku: '79066160',
        status: 'Printing',
        variants: 4,
        available: 200,
    },
];

export const BrandingDetailsPage = () => {
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(items);

    const handleReorder = () => {
        console.log('Reorder:', selectedResources);
    };

    const handleDelete = () => {
        console.log('Delete:', selectedResources);
    };

    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page
                        backAction={
                            {
                                content: "Custom Branding",
                                onAction: () => { },
                            }
                        }
                        title={"Custom Branding"}
                        fullWidth={false}>
                        <BlockStack gap="800">
                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button icon={ArrowLeftIcon} onClick={() => { }} />
                                    <span className="font-semibold text-gray-800">
                                        Custom Branding | Brand Name
                                    </span>
                                </div>
                                <Button variant="primary">Add new</Button>
                            </div> */}

                            {selectedResources.length > 0 && (
                                <div className="ml-6 mt-4 mb-4">
                                    <InlineStack gap="200">
                                        <button
                                            onClick={handleReorder}
                                            className="bg-[#EBEBEB] text-[#333] px-[10px] py-[8px] rounded-[6.5px] text-sm font-medium"
                                        >
                                            Reorder
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="bg-[#EBEBEB] text-[#333] px-[10px] py-[8px] rounded-[6.5px] text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </InlineStack>
                                </div>
                            )}

                            <Card padding={"0"}>
                                <IndexTable
                                    resourceName={{ singular: 'custom branding', plural: 'custom brandings' }}
                                    itemCount={items.length}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    headings={[
                                        { title: 'S.NO' },
                                        { title: 'Custom Branding' },
                                        { title: 'Status' },
                                        { title: 'Variants Available' },
                                        { title: 'Products Available' },
                                    ]}
                                >
                                    {items.map((item, index) => (
                                        <IndexTable.Row
                                            id={item.id}
                                            key={item.id}
                                            selected={selectedResources.includes(item.id)}
                                            position={index}
                                        >
                                            <IndexTable.Cell>{index + 1}</IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <div className="flex items-center gap-3">
                                                    <Thumbnail
                                                        source={item.image}
                                                        alt={item.name}
                                                        size="small"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            SKU: {item.sku}
                                                        </div>
                                                    </div>
                                                </div>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Badge tone="success">{item.status}</Badge>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>{item.variants}</IndexTable.Cell>
                                            <IndexTable.Cell>{item.available}</IndexTable.Cell>
                                        </IndexTable.Row>
                                    ))}
                                </IndexTable>
                            </Card>
                        </BlockStack>
                    </Page>
                </div>
            </div>
        </>
    );
};

export default BrandingDetailsPage;