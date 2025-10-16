import { Navbar } from "../../layout/Navbar";
import { Card, TextField, Text, Select, Modal } from "@shopify/polaris";
import { ArrowLeftIcon, InfoIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../components/common/Button";
import mastercardLogo from "../../assets/mastercard-logo.svg";
import visaLogo from "../../assets/visa-logo.svg";
import paypalLogo from "../../assets/paypal-logo.svg";
import { useStoreCredits } from '../../store/useStoreCredits';
import { usePost } from '../../hooks/usePost';

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    tooltip?: string;
    placeholder?: string;
    type?: 'text' | 'number';
    prefix?: string;
}> = ({ label, value, onChange, tooltip, placeholder, type = 'text', prefix }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#303030]">{label}</span>
                {tooltip && (
                    <div className="group relative">
                        <InfoIcon className="w-5 h-5 text-[#616161] fill-[#616161]" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-[#303030] text-white text-xs rounded-lg z-30">
                            {tooltip}
                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#303030] rotate-45"></div>
                        </div>
                    </div>
                )}
            </div>
            <TextField
                label=""
                labelHidden
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                prefix={prefix}
                autoComplete="off"
            />
        </div>
    );
};

function validateCardDetails(cardNumber: string, expiryDate: string, cvv: string): string | null {
    // Card number: 13-19 digits (Visa, MC, etc.)
    const cardNum = cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cardNum)) {
        return 'Card number must be 13 to 19 digits.';
    }
    // Expiry: MM/YY
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiryDate)) {
        return 'Expiry date must be in MM/YY format.';
    }
    // CVV: 3 digits
    if (!/^\d{3}$/.test(cvv)) {
        return 'CVV must be 3 digits.';
    }
    return null;
}

export function Billing() {
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const store = useStoreCredits();
    const { handlePost, isLoading } = usePost();

    // Destructure all fields except setField from the store
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setField, ...storeFields } = store;
    console.log('Store Fields:', storeFields);
    const countryOptions = [
        { label: 'India', value: 'india' },
        { label: 'United States', value: 'us' },
    ];

    const stateOptions = [
        { label: 'Maharashtra', value: 'maharashtra' },
        { label: 'Karnataka', value: 'karnataka' },
    ];

    const cityOptions = [
        { label: 'Mumbai', value: 'mumbai' },
        { label: 'Pune', value: 'pune' },
    ];

    const handleNextStep = () => {
        setShowPaymentModal(true);
    };

    const handleProceedToPay = async () => {
        setError(null);
        const err = validateCardDetails(store.card_number, store.expiry_date, store.cvv);
        if (err) {
            setError(err);
            return;
        }
        // Send all store fields except setField
        const { setField, ...payload } = store;
        await handlePost('/store-credits', {bill_type : "Credits", ...payload}, "/credits");
        setShowPaymentModal(false);
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-auto">
                <div className="bg-[#F5F5F5] min-h-full p-8">
                    <div className="flex flex-col gap-8 max-w-[70vw]">
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="icon"
                                onClick={() => navigate('/credits')}
                                icon={<ArrowLeftIcon className="w-4 h-4" />}
                            />
                            <Text variant="headingXl" as="h1">Billing: Printrove USD Wallet</Text>
                        </div>

                        <Card>
                            <div className="p-8">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-4">
                                        <Text variant="headingMd" as="h2">USD Wallet</Text>
                                        <div className="max-w-[450px]">
                                            <InputField
                                                label="Add Amount"
                                                value={store.amount}
                                                onChange={v => store.setField('amount', v)}
                                                placeholder="Enter Amount"
                                                type="number"
                                                prefix="$"
                                                tooltip="Enter the amount you want to add to your USD wallet"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Text variant="headingMd" as="h2">Billing Info</Text>
                                        <div className="flex gap-4 max-w-[900px]">
                                            <div className="flex-1">
                                                <InputField
                                                    label="Full Name"
                                                    value={store.full_name}
                                                    onChange={v => store.setField('full_name', v)}
                                                    placeholder="Enter your full name"
                                                    tooltip="Enter your full legal name as it appears on your ID"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <InputField
                                                    label="Phone Number"
                                                    value={store.phone_number}
                                                    onChange={v => store.setField('phone_number', v)}
                                                    placeholder="Enter your phone number"
                                                    tooltip="Enter your contact number for verification"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Text variant="headingMd" as="h2">Address</Text>
                                        <div className="flex flex-col gap-4 max-w-[900px]">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <InputField
                                                        label="Address Line 1"
                                                        value={store.address_line_1}
                                                        onChange={v => store.setField('address_line_1', v)}
                                                        placeholder="Enter address line 1"
                                                        tooltip="Enter your primary address details"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Select
                                                        label="Country"
                                                        options={countryOptions}
                                                        onChange={v => store.setField('country', v)}
                                                        value={store.country}
                                                        placeholder="Select country"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <InputField
                                                        label="Landmark"
                                                        value={store.landmark}
                                                        onChange={v => store.setField('landmark', v)}
                                                        placeholder="Enter Landmark"
                                                        tooltip="Enter a nearby landmark for easier location"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Select
                                                        label="State"
                                                        options={stateOptions}
                                                        onChange={v => store.setField('state', v)}
                                                        value={store.state}
                                                        placeholder="Select state"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <InputField
                                                        label="Pin code"
                                                        value={store.pincode}
                                                        onChange={v => store.setField('pincode', v)}
                                                        placeholder="Enter Pin code here"
                                                        tooltip="Enter your postal code"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Select
                                                        label="City"
                                                        options={cityOptions}
                                                        onChange={v => store.setField('city', v)}
                                                        value={store.city}
                                                        placeholder="Select city"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="primary" size="lg" onClick={handleNextStep}>
                                            Next Step
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title=""
                titleHidden={true}
                primaryAction={{
                    content: isLoading ? 'Processing...' : 'Add Money',
                    onAction: handleProceedToPay,
                    disabled: isLoading
                }}
            >
                <Modal.Section>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <Text variant="headingXl" as="h3">Payment Methods</Text>
                            <div className="flex items-center gap-6">
                                <img src={visaLogo} alt="Visa" className="h-14" />
                                <img src={mastercardLogo} alt="Mastercard" className="h-14" />
                                <img src={paypalLogo} alt="PayPal" className="h-14" />
                            </div>
                        </div>
                        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
                        <div className="flex flex-col gap-4">
                            <Text variant="headingXl" as="h3">Card Details</Text>
                            <div className="flex flex-col gap-4 max-w-[450px]">
                                <InputField
                                    label="Card Holder's Name"
                                    value={store.card_name}
                                    onChange={v => store.setField('card_name', v)}
                                    placeholder="Enter card holder's name"
                                    tooltip="Enter the name exactly as it appears on your card"
                                />
                                <InputField
                                    label="Card Number"
                                    value={store.card_number}
                                    onChange={v => store.setField('card_number', v)}
                                    placeholder="Enter card number"
                                    tooltip="Enter your 16-digit card number"
                                />
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            label="Expiry Date"
                                            value={store.expiry_date}
                                            onChange={v => store.setField('expiry_date', v)}
                                            placeholder="MM/YY"
                                            tooltip="Enter the expiry date in MM/YY format"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputField
                                            label="CVV"
                                            value={store.cvv}
                                            onChange={v => store.setField('cvv', v)}
                                            placeholder="Enter CVV"
                                            tooltip="Enter the 3-digit security code on the back of your card"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Section>
            </Modal>
        </div>
    );
}