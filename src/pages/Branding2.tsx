import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Page,
    Card,
    Text,
    Badge,
    BlockStack,
    Button as PolarisButton,
} from '@shopify/polaris';
import pItem1 from '../assets/templateimg1.png';
import pItem2 from '../assets/templateimg2.png';
import pItem3 from '../assets/templateimg3.png';
import { Button } from "../components/common/Button";


const brandingTemplates = [
    { title: 'Inner Necklable', img: pItem1, link: '#' },
    { title: 'Outer Necklable', img: pItem2, link: '#' },
    { title: 'Hangtag', img: pItem3, link: '#' },
    { title: 'Stickers', img: pItem1, link: '#' },
    { title: 'Packins', img: pItem2, link: '#' },
    { title: 'Polybags', img: pItem3, link: '#' },
];

export function Branding2() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: any = <div className="text-2xl font-bold text-[#121212]">Custom Branding</div>
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />

                <div className="flex-1 bg-white">
                    <Page
                        // backAction={
                        //     {
                        //         content: "Custom Branding",
                        //         onAction: () => {

                        //         },
                        //     }
                        // }
                        title={a}
                        fullWidth>
                        {/* Profile Section */}
                        <Card>
                            <div className="flex justify-between items-center px-4 py-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded">
                                            K
                                        </div>
                                        <div>
                                            <Text variant="headingMd" as="h2">Kalankikethan</Text>
                                            <Text as="p" tone="subdued">Contact@printrove.com</Text>
                                        </div>
                                        <Badge tone="new">NEW</Badge>
                                    </div>
                                </div>
                                <Button>View</Button>
                            </div>
                        </Card>

                        {/* Template Grid */}
                        <div className="mt-6 mb-4">
                            <BlockStack gap={"400"}>
                                <Text variant="headingLg" as="h3">My Template</Text>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-44">
                                    {brandingTemplates.map((item) => (
                                        <Card key={item.title}>
                                            <div className="space-y-2">
                                                <BlockStack gap={"400"}>
                                                    <div className="flex items-center">
                                                        <img src={item.img} alt={item.title} className="h-full object-contain" />
                                                    </div>
                                                    <BlockStack gap={"300"} inlineAlign="start">
                                                        <Text variant="headingXl" as="h4">{item.title}</Text>
                                                        <Text as="p" tone="subdued" variant="bodyLg">
                                                            Shopify is an attractive choice to small businesses, offering a
                                                            comprehensive platform with easy-to-use tools and affordable pricing.
                                                        </Text>
                                                        <PolarisButton variant="plain">Learn more</PolarisButton>
                                                    </BlockStack>
                                                </BlockStack>
                                                {/* <a href={item.link} className="text-blue-600 text-sm font-medium"></a> */}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </BlockStack>
                        </div>
                    </Page>
                </div>
            </div>
        </>
    );
}