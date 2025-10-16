import {
    Page,
    Card,
    TextField,
    Icon,
    Select,
    Text,
} from '@shopify/polaris';
import { MinusCircleIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';

const data = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    placedOn: '31 Jul 2024',
    name: 'John D’Souza',
    brandName: 'John D’Souza',
    email: 'john@gmail.com',
    qty: 125,
}));

export const CustomBrandingPage = () => {
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />
                <div className="flex-1 bg-[#F5F6F8]">
                    <Page
                        // backAction={
                        //     {
                        //         content: `Custom Branding`,
                        //         onAction: () => {

                        //         },
                        //     }
                        // }
                        // title={`Custom Branding`}
                        fullWidth>
                        <div className="flex justify-between items-center pt-4 pb-4 border-b border-gray-200">
                            <Text as="p" variant='heading2xl'>Custom Branding</Text>
                            <div className="w-96">
                                <TextField
                                    label=""
                                    labelHidden
                                    placeholder="Search by Merchant Id, Phone number or Email..."
                                    prefix={<Icon source={MinusCircleIcon} />}
                                    onChange={() => { }}
                                    value=""
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <Card padding={"0"}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-50 border-b text-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">S.NO</th>
                                            <th className="px-4 py-3 font-medium">Placed On</th>
                                            <th className="px-4 py-3 font-medium">Name</th>
                                            <th className="px-4 py-3 font-medium">Brand Name</th>
                                            <th className="px-4 py-3 font-medium">Email ID</th>
                                            <th className="px-4 py-3 font-medium">Available QTY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((entry) => (
                                            <tr key={entry.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{entry.id}</td>
                                                <td className="px-4 py-3">{entry.placedOn}</td>
                                                <td className="px-4 py-3">{entry.name}</td>
                                                <td className="px-4 py-3">{entry.brandName}</td>
                                                <td className="px-4 py-3">{entry.email}</td>
                                                <td className="px-4 py-3">{entry.qty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-3 border-t bg-[#FFFFFF]">
                                <span className="text-sm text-[#4A4A4A]">
                                    Total Count: <span className="text-[#006FEE] font-medium">20</span>
                                </span>

                                <div className="flex items-center gap-4">
                                    {/* Styled Select */}
                                    <div className="flex items-center justify-between px-2 py-1 rounded-[6px] bg-[#FFFFFF] h-[40px] w-[152px]">

                                        <Select
                                            label=""
                                            labelHidden
                                            options={['10 per Page', '25 per Page', '50 per Page']}
                                            onChange={() => {}}
                                            value="50 per Page"
                                        />
                                    </div>
                                    {/* Custom Pagination UI */}
                                    <div className="flex items-center gap-2 px-3 py-1 rounded border border-[#CCCCCC] bg-white text-sm text-[#4A4A4A]">
                                    <button className="cursor-pointer">&lt;</button>
                                    <span className="text-[13px] font-[450] leading-[20px] text-[#303030]">1 - 49</span>
                                    <button className="cursor-pointer">&gt;</button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Page>
                </div>
            </div>
        </>
    );
};

export default CustomBrandingPage;