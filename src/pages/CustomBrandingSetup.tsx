import { useCallback, useState } from 'react';
import {
    Page,
    Card,
    Text,
    Select,
    Button,
    Thumbnail,
    DropZone,
    LegacyStack,
    InlineStack,
    Icon,
    InlineGrid,
    BlockStack,
    Tooltip,
    TextContainer,
    Popover,
    OptionList,
    Tag,
} from '@shopify/polaris';
import { InfoIcon, NoteIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { SideMenu } from '../layout/SideMenu';
import FixedFooter from '../components/common/Footer';

const brandingFields = [
    'Outer Necklable Printfile',
    'Left Sleeve Printfile',
    'Right Sleeve Printfile',
    'Hangtags Printfile',
    'Polybags Printfile',
];

const brandingOptions = [
    { value: 'inner', label: 'Inner Necklable' },
    { value: 'outer', label: 'Outer Necklable' },
    { value: 'hangtags', label: 'Hangtags' },
    { value: 'polybags', label: 'Polybags' },
    { value: 'packins', label: 'Packins' },
    { value: 'stickers', label: 'Stickers' },
];

export const CustomBrandingSetup = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopover = useCallback(() => setPopoverActive((active) => !active), []);

    const handleChange = useCallback((value: string[]) => {
        setSelected(value);
    }, []);

    const removeTag = (tag: string) => {
        setSelected((prev) => prev.filter((item) => item !== tag));
    };

    const [files, setFiles] = useState<File[]>([]);

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
            setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />
    );

    const uploadedFiles = files.length > 0 && (
        <LegacyStack vertical>
            {files.map((file, index) => (
                <LegacyStack alignment="center" key={index}>
                    <Thumbnail
                        size="small"
                        alt={file.name}
                        source={
                            validImageTypes.includes(file.type)
                                ? window.URL.createObjectURL(file)
                                : NoteIcon
                        }
                    />
                    <div>
                        {file.name}{' '}
                        <Text variant="bodySm" as="p">
                            {file.size} bytes
                        </Text>
                    </div>
                </LegacyStack>
            ))}
        </LegacyStack>
    );


    return (
        <>
            <Navbar />
            <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
                <SideMenu activeTab="store-connect" />
                <div className="flex-1 bg-white">
                    <Page
                        backAction={
                            {
                                content: "Custom Branding Setup",
                                onAction: () => {

                                },
                            }
                        }
                        title={"Custom Branding Setup"}
                        fullWidth={false}>
                        <div className="space-y-6">
                            {/* <Card>
                                <div className="space-y-4">
                                    <Select
                                        label={<InlineStack gap={"100"}>
                                            <Text as='p'>Custom Branding Options</Text>
                                            <Tooltip content={"Custom Branding Options"}>
                                                <span><Icon source={InfoIcon} /></span>
                                            </Tooltip>
                                        </InlineStack>}
                                        options={brandOptions}
                                        value={selectedPlatform}
                                        placeholder='Select the custom branding options you want to have'
                                        onChange={setSelectedPlatform} />
                                </div>
                            </Card> */}

                            <Card>
                                <TextContainer>
                                    <p>Custom Branding Options</p>
                                    <Popover
                                        active={popoverActive}
                                        activator={
                                            <Button onClick={togglePopover} disclosure>
                                                Select the custom branding options you want to have
                                            </Button>
                                        }
                                        onClose={togglePopover}
                                    >
                                        <OptionList
                                            onChange={handleChange}
                                            options={brandingOptions}
                                            selected={selected}
                                            allowMultiple
                                        />
                                    </Popover>
                                    <InlineStack gap="200">
                                        {selected.map((item) => {
                                            const label = brandingOptions.find((opt) => opt.value === item)?.label || item;
                                            return <Tag key={item} onRemove={() => removeTag(item)}>{label}</Tag>;
                                        })}
                                    </InlineStack>
                                </TextContainer>
                            </Card>

                            <Card>
                                <BlockStack gap={"300"}>
                                    <InlineStack gap={"100"}>
                                        <Text as='p' variant='headingMd'>Inner Necklable Printfile</Text>
                                        <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                        </Tooltip>
                                    </InlineStack>
                                    <Text as='p' variant='bodyLg'>Download the File here and do the necessary change and upload the design file here.</Text>
                                    <InlineStack align='start'><Button variant='plain'>Download</Button></InlineStack>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <InlineStack gap={"100"}>
                                                <Text as={'p'} >Media</Text>
                                                <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                </Tooltip>
                                            </InlineStack>
                                            <DropZone onDrop={handleDropZoneDrop} variableHeight>
                                                {uploadedFiles}
                                                {fileUpload}
                                            </DropZone>
                                        </div>
                                        <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                            <Text as={'p'} >Color Options</Text>
                                            <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                            </Tooltip>
                                        </InlineStack>} />
                                        <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                            <Text as={'p'} >Quantity</Text>
                                            <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                            </Tooltip>
                                        </InlineStack>} />
                                        <InlineGrid columns={2} gap={"400"}>
                                            <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                                <Text as={'p'} >White Quantity</Text>
                                                <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                </Tooltip>
                                            </InlineStack>} />
                                            <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                                <Text as={'p'} >Black Quantity</Text>
                                                <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                </Tooltip>
                                            </InlineStack>} />
                                        </InlineGrid>
                                        <InlineStack gap={"100"}>
                                            <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                            </Tooltip>
                                            <Text as={'p'} >Enter for one quantity and the other will be automatically gets adjusted.</Text>
                                        </InlineStack>
                                    </div>
                                </BlockStack>
                            </Card>
                            <div className='mb-20'>
                                {brandingFields.map((field: any, ind: any) => {
                                    return (
                                        <Card key={ind}>
                                            <BlockStack gap={"300"}>
                                                <InlineStack gap={"100"}>
                                                    <Text as='p' variant='headingMd'>{field}</Text>
                                                    <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                    </Tooltip>
                                                </InlineStack>
                                                <Text as='p' variant='bodyLg'>Download the File here and do the necessary change and upload the design file here.</Text>
                                                <InlineStack align='start'><Button variant='plain'>Download</Button></InlineStack>
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-2">
                                                        <InlineStack gap={"100"}>
                                                            <Text as={'p'} >Media</Text>
                                                            <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                            </Tooltip>
                                                        </InlineStack>
                                                        <DropZone onDrop={handleDropZoneDrop} variableHeight>
                                                            {uploadedFiles}
                                                            {fileUpload}
                                                        </DropZone>
                                                    </div>
                                                    <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                                        <Text as={'p'} >Color Options</Text>
                                                        <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                        </Tooltip>
                                                    </InlineStack>} />
                                                    <Select placeholder='Select color' label={<InlineStack gap={"100"}>
                                                        <Text as={'p'} >Quantity</Text>
                                                        <Tooltip content={"Custom Branding Options"}><span><Icon source={InfoIcon} /></span>
                                                        </Tooltip>
                                                    </InlineStack>} />
                                                </div>
                                            </BlockStack>
                                        </Card>
                                    )
                                })}
                            </div>
                            <FixedFooter secondaryBtnText='Cancel' primaryBtnText='Continue to Payment' />
                            {/* <div className="flex justify-end gap-4">
                                <Button>Cancel</Button>
                                <Button variant='primary' onClick={handleSubmit}>
                                    Save Branding Setup
                                </Button>
                            </div> */}
                        </div>
                    </Page>
                </div >
            </div >
        </>
    );
};

export default CustomBrandingSetup;
