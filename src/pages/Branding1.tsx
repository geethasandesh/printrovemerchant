import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";

import {
    Page,
    Card,
    Text,
    BlockStack,
} from '@shopify/polaris';
import pItem1 from '../assets/templateimg1.png';
import pItem2 from '../assets/templateimg2.png';
import pItem3 from '../assets/templateimg3.png';
import pItem4 from '../assets/onboarding-setup.png';


const brandingTemplates = [
    { title: 'Inner Necklable', img: pItem1, link: '#' },
    { title: 'Outer Necklable', img: pItem2, link: '#' },
    { title: 'Hangtag', img: pItem3, link: '#' },
    { title: 'Stickers', img: pItem1, link: '#' },
    { title: 'Packins', img: pItem2, link: '#' },
    { title: 'Polybags', img: pItem3, link: '#' },
];

export function Branding1() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: any = <div className="text-2xl font-bold text-[#121212]">Custom Branding</div>
    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="branding" />

                <div className="flex-1 bg-white">
                    <Page
                        title={a}
                        // backAction={
                        //     {
                        //         content: "Custom Branding",
                        //         onAction: () => {

                        //         },
                        //     }
                        // }
                        // title={"Custom Branding"}
                        fullWidth>
                        <div className="flex items-center justify-between p-8 bg-purple-700 rounded-2xl text-white mx-auto">
                            {/* Left Content */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">Custom Branded Product Kit</h2>
                                <p className="text-sm mb-4">
                                    Get your branded sample branded kit to see the custom branded items
                                </p>
                                <button className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded">
                                    Order now
                                </button>
                            </div>

                            {/* Right Image */}
                            <div className="flex-1 flex justify-center">
                                <img
                                    src={pItem4}// replace with actual image path
                                    alt="Branded Kit"
                                    className="max-w-xs"
                                />
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="mt-6 mb-4">
                            <BlockStack gap={"400"}>
                                <Text variant="headingLg" as="h3">My Template</Text>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-44">
                                    {brandingTemplates.map((item) => (
                                        <Card key={item.title}>
                                            <div className="space-y-2">
                                                <div className="bg-gray-100 h-32 flex items-center justify-center">
                                                    <img src={item.img} alt={item.title} className="h-full object-contain" />
                                                </div>
                                                <Text variant="headingSm" as="h4">{item.title}</Text>
                                                <Text as="p" tone="subdued">
                                                    Shopify is an attractive choice to small businesses, offering a
                                                    comprehensive platform with easy-to-use tools and affordable pricing.
                                                </Text>
                                                <a href={item.link} className="text-blue-600 text-sm font-medium">Learn more</a>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </BlockStack>
                        </div>
                    </Page>
                </div>
            </div >
        </>
    );
}