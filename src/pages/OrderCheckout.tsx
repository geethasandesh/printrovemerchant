import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  TextField,
  Select,
  RadioButton,
  Checkbox,
  Icon,
  InlineStack,
  Text
} from '@shopify/polaris';
import axios from 'axios';
import { ArrowLeftIcon, InfoIcon } from '@shopify/polaris-icons';
import { Navbar } from '../layout/Navbar';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../pages/orders/ProgressBar';
import { useOrderStore } from '../store/useOrderStore';

export function OrderCheckout() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { setShippingAddress } = useOrderStore();

  const [shippingMode, setShippingMode] = useState<'prepaid' | 'cod' | 'self'>('prepaid');
  const [saveAddress, setSaveAddress] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    orderNumber: '',
    addressLine1: '',
    addressLine2: '',
    phoneNumber: '',
    alternatePhone: '',
    landmark: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    shippingCharges: '0.00',
    otherCharges: '0.00'
  });

  // Country/State/City options
  const countryOptions = [
    { label: 'Select', value: '' },
    { label: 'India', value: 'IN' },
  ];
  const stateMap: Record<string, { label: string; value: string }[]> = {
    IN: [
      { label: 'Select', value: '' },
      { label: 'Tamil Nadu', value: 'Tamil Nadu' },
      { label: 'Karnataka', value: 'Karnataka' },
      { label: 'Maharashtra', value: 'Maharashtra' },
      { label: 'Delhi', value: 'Delhi' },
      { label: 'West Bengal', value: 'West Bengal' },
      { label: 'Gujarat', value: 'Gujarat' },
      { label: 'Kerala', value: 'Kerala' },
      { label: 'Telangana', value: 'Telangana' },
    ],
  };
  const cityMap: Record<string, { label: string; value: string }[]> = {
    'Tamil Nadu': [
      { label: 'Select', value: '' },
      { label: 'Chennai', value: 'Chennai' },
      { label: 'Coimbatore', value: 'Coimbatore' },
      { label: 'Madurai', value: 'Madurai' },
    ],
    Karnataka: [
      { label: 'Select', value: '' },
      { label: 'Bengaluru', value: 'Bengaluru' },
      { label: 'Mysuru', value: 'Mysuru' },
      { label: 'Mangaluru', value: 'Mangaluru' },
    ],
    Maharashtra: [
      { label: 'Select', value: '' },
      { label: 'Mumbai', value: 'Mumbai' },
      { label: 'Pune', value: 'Pune' },
      { label: 'Nagpur', value: 'Nagpur' },
    ],
    Delhi: [
      { label: 'Select', value: '' },
      { label: 'New Delhi', value: 'New Delhi' },
    ],
    'West Bengal': [
      { label: 'Select', value: '' },
      { label: 'Kolkata', value: 'Kolkata' },
      { label: 'Siliguri', value: 'Siliguri' },
    ],
    Gujarat: [
      { label: 'Select', value: '' },
      { label: 'Ahmedabad', value: 'Ahmedabad' },
      { label: 'Surat', value: 'Surat' },
      { label: 'Vadodara', value: 'Vadodara' },
    ],
    Kerala: [
      { label: 'Select', value: '' },
      { label: 'Kochi', value: 'Kochi' },
      { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
    ],
    Telangana: [
      { label: 'Select', value: '' },
      { label: 'Hyderabad', value: 'Hyderabad' },
      { label: 'Warangal', value: 'Warangal' },
    ],
  };

  const availableStates = useMemo(() => stateMap[formData.country] || [{ label: 'Select', value: '' }], [formData.country]);
  const availableCities = useMemo(() => cityMap[formData.state] || [{ label: 'Select', value: '' }], [formData.state]);

  // Reset dependent fields on parent change
  useEffect(() => {
    setFormData(prev => ({ ...prev, state: '', city: '' }));
  }, [formData.country]);
  useEffect(() => {
    setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.state]);

  // Files for self shipping
  const [selfLabelFile, setSelfLabelFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Subtotal passed from previous step
  const subtotalFromDesign = useMemo(() => {
    const passed = location?.state?.orderValue;
    return typeof passed === 'number' ? passed : 202; // fallback
  }, [location]);

  // Compute shipping fee (client-side parity with backend shipping.service.ts)
  const computeShippingCost = (
    mode: 'prepaid' | 'cod' | 'self',
    city: string,
    state: string,
    orderValue: number
  ): number => {
    if (mode === 'self') return 0;
    let baseCost = 0;
    const metroCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
    const isMetro = metroCities.some(c => city?.toLowerCase().includes(c.toLowerCase()));
    // COD base
    if (mode === 'cod') {
      baseCost = 50; // includes COD surcharge similarly to backend
    }
    if (mode === 'prepaid') {
      if (orderValue >= 500) baseCost = 0; else baseCost = isMetro ? 0 : 80;
    }
    const northEastStates = ['Assam','Arunachal Pradesh','Manipur','Meghalaya','Mizoram','Nagaland','Tripura','Sikkim'];
    const islandStates = ['Andaman and Nicobar Islands','Lakshadweep'];
    const ne = northEastStates.includes(state);
    const island = islandStates.includes(state);
    return baseCost + (ne ? 100 : 0) + (island ? 200 : 0);
  };

  // Auto-calc shipping charges when inputs change (non self-shipping)
  useEffect(() => {
    if (shippingMode === 'self') {
      setFormData(prev => ({ ...prev, shippingCharges: '0.00' }));
      return;
    }
    const fee = computeShippingCost(shippingMode, formData.city, formData.state, subtotalFromDesign);
    setFormData(prev => ({ ...prev, shippingCharges: fee.toFixed(2) }));
  }, [shippingMode, formData.city, formData.state, subtotalFromDesign]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    // Validate address
    const newErrors: Record<string, string | undefined> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.country) newErrors.country = 'Select country';
    if (!formData.state) newErrors.state = 'Select state';
    if (!formData.city) newErrors.city = 'Select city';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter 6 digit pincode';
    if (shippingMode === 'self') {
      if (!selfLabelFile) newErrors.selfLabelFile = 'Shipping label PDF required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setShippingAddress({
      fullName: formData.fullName,
      storeName: formData.orderNumber,
      address1: formData.addressLine1,
      address2: formData.addressLine2,
      landmark: formData.landmark,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      zip: formData.pincode,
    });
    navigate('/add-product/summary', {
      state: {
        subtotal: subtotalFromDesign,
        shippingMode,
        shippingCharges: Number(formData.shippingCharges),
        productConfig: location?.state?.productConfig,
        productData: location?.state?.productData,
        shippingAddress: {
          fullName: formData.fullName,
          address1: formData.addressLine1,
          address2: formData.addressLine2,
          landmark: formData.landmark,
          phone: formData.phoneNumber,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
        }
      }
    });
  };

  // This function is used for creating order via API (reserved for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateOrder = async (): Promise<void> => {
    // payload per merchantOrder.service.ts
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const base = (API_URL || '').replace(/\/+$/, '');
    const url = `${base}/merchant-orders`;

    const orderPayload = {
      merchantId: 'current-merchant',
      orderItems: [
        {
          productId: location?.state?.productConfig?.productId,
          productTitle: location?.state?.productData?.title,
          variant: {
            color: location?.state?.productConfig?.color,
            size: location?.state?.productConfig?.size,
          },
          quantity: Number(formData.otherCharges) ? Number(formData.otherCharges) : location?.state?.productConfig?.quantity || 1,
          unitPrice: location?.state?.unitPrice || subtotalFromDesign,
          subtotal: subtotalFromDesign,
          designLayers: location?.state?.productConfig?.design,
          printType: location?.state?.productConfig?.printType,
          printPosition: location?.state?.productConfig?.position,
        },
      ],
      subtotal: subtotalFromDesign,
      shippingCost: Number(formData.shippingCharges),
      taxAmount: 0,
      totalAmount: subtotalFromDesign + Number(formData.shippingCharges),
      shippingMode: shippingMode === 'self' ? 'self-shipping' : shippingMode,
      shippingAddress: {
        fullName: formData.fullName,
        email: '',
        phone: formData.phoneNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: formData.country || 'India',
      },
      billingAddress: {
        fullName: formData.fullName,
        email: '',
        phone: formData.phoneNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: formData.country || 'India',
      },
      sameAsShipping: true,
      selfShippingData: shippingMode === 'self' ? {
        courierName: '',
        awbNumber: '',
        courierPhone: '',
        pickupAddress: formData.addressLine1,
        pickupContactName: formData.fullName,
        pickupContactPhone: formData.phoneNumber,
        estimatedPickupDate: new Date(),
      } : undefined,
      paymentMethod: shippingMode === 'cod' ? 'cod' : 'upi',
      trackingEnabled: shippingMode !== 'self',
      source: 'web',
    };

    await axios.post(url, orderPayload, { headers: { 'Content-Type': 'application/json' } });
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden bg-[#F5F5F5]">
        <div className="h-full overflow-y-auto">
          <div className="mx-[10%] p-8">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="icon"
                onClick={() => navigate(-1)}
                icon={<ArrowLeftIcon className="w-4 h-4" />}
              />
              <h1 className="text-2xl font-bold text-[#121212]">Checkout</h1>
            </div>

            <ProgressBar
              currentStatus="Shipping"
              statusSteps={['Product', 'Shipping', 'Review & Pay']}
            />

            <div className="grid grid-cols-[1fr,500px] gap-8 mt-8">
              <div className="space-y-6">
                <Card>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Text as="h2" variant="headingMd">Shipping mode</Text>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Select mode of payment that your buyer has chosen for the order
                      </Text>
                    </div>
                    <div className="flex gap-4">
                      <RadioButton label="Prepaid" checked={shippingMode === 'prepaid'} onChange={() => setShippingMode('prepaid')} />
                      <RadioButton label="Cash on Delivery" checked={shippingMode === 'cod'} onChange={() => setShippingMode('cod')} />
                      <RadioButton label="Self Shipping" checked={shippingMode === 'self'} onChange={() => setShippingMode('self')} />
                    </div>

                    {/* SELF SHIPPING EXTRAS */}
                    {shippingMode === 'self' && (
                      <div className="space-y-4 mt-2">
                        <div>
                          <Text as="p" variant="bodySm" tone="subdued">Shipping Label</Text>
                          <div className="mt-2 border-2 border-dashed rounded-md p-4 bg-[#FAFAFA]">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => {
                                const f = e.target.files?.[0] || null;
                                if (f && f.size > 5 * 1024 * 1024) {
                                  setErrors(prev => ({ ...prev, selfLabelFile: 'Max size 5MB' }));
                                } else {
                                  setErrors(prev => ({ ...prev, selfLabelFile: undefined }));
                                  setSelfLabelFile(f);
                                }
                              }}
                            />
                            <div className="text-[11px] text-gray-500 mt-1">Accepts PDF</div>
                            {errors.selfLabelFile && (<div className="text-xs text-red-600 mt-1">{errors.selfLabelFile}</div>)}
                          </div>
                        </div>
                        <div>
                          <Text as="p" variant="bodySm" tone="subdued">Upload Invoice</Text>
                          <div className="mt-2 border-2 border-dashed rounded-md p-4 bg-[#FAFAFA]">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                // TODO: Handle invoice file upload
                                console.log('Invoice file selected:', file);
                              }}
                            />
                            <div className="text-[11px] text-gray-500 mt-1">Accepts PDF</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card>
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <Text as="h2" variant="headingMd">Shipping Address</Text>
                      <button className="text-[#005BD3] text-sm">Address Book</button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <TextField
                          label={<InlineStack align="center" gap="200"><span>Full Name</span><Icon source={InfoIcon} tone="subdued" /></InlineStack>}
                          value={formData.fullName}
                          onChange={(value) => handleInputChange('fullName', value)}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          error={errors.fullName}
                        />
                        <TextField
                          label={<InlineStack align="center" gap="200"><span>Order Number (Optional)</span><Icon source={InfoIcon} tone="subdued" /></InlineStack>}
                          value={formData.orderNumber}
                          onChange={(value) => handleInputChange('orderNumber', value)}
                          placeholder="Enter order number"
                          autoComplete="off"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <TextField
                          label="Address Line 1"
                          value={formData.addressLine1}
                          onChange={(value) => handleInputChange('addressLine1', value)}
                          placeholder="Enter address line 1"
                          autoComplete="address-line1"
                          error={errors.addressLine1}
                        />
                        <TextField
                          label="Address Line 2"
                          value={formData.addressLine2}
                          onChange={(value) => handleInputChange('addressLine2', value)}
                          placeholder="Enter address line 2"
                          autoComplete="address-line2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <TextField
                          label="Phone Number"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(value) => handleInputChange('phoneNumber', value)}
                          placeholder="Enter phone number"
                          autoComplete="tel"
                          error={errors.phoneNumber}
                        />
                        <TextField
                          label="Alternate Phone Number"
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={(value) => handleInputChange('alternatePhone', value)}
                          placeholder="Enter alternate number"
                          autoComplete="tel"
                        />
                      </div>

                      <TextField
                        label="Landmark"
                        value={formData.landmark}
                        onChange={(value) => handleInputChange('landmark', value)}
                        placeholder="Enter landmark"
                        autoComplete="off"
                      />

                      <div className="grid grid-cols-3 gap-6">
                        <Select
                          label="Country"
                          options={countryOptions}
                          value={formData.country}
                          onChange={(value) => handleInputChange('country', value)}
                          error={errors.country as any}
                        />
                        <Select
                          label="State"
                          options={availableStates}
                          value={formData.state}
                          onChange={(value) => handleInputChange('state', value)}
                          error={errors.state as any}
                        />
                        <Select
                          label="City"
                          options={availableCities}
                          value={formData.city}
                          onChange={(value) => handleInputChange('city', value)}
                          error={errors.city as any}
                        />
                      </div>

                      <div className="w-1/3">
                        <TextField
                          label="Pin code"
                          value={formData.pincode}
                          onChange={(value) => handleInputChange('pincode', value)}
                          placeholder="Enter Pin code"
                          autoComplete="postal-code"
                          error={errors.pincode}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Text as="p" variant="bodyMd" tone="subdued">
                        This info will be shown on the shipping label
                      </Text>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <TextField
                        label="Shipping Charges"
                        type="number"
                        prefix="₹"
                        value={formData.shippingCharges}
                        onChange={(value) => handleInputChange('shippingCharges', value)}
                        autoComplete="off"
                        disabled={shippingMode !== 'self'}
                      />
                      <TextField
                        label="Other Charges"
                        type="number"
                        prefix="₹"
                        value={formData.otherCharges}
                        onChange={(value) => handleInputChange('otherCharges', value)}
                        autoComplete="off"
                      />
                    </div>

                    {/* Self shipping uploads moved to shipping mode card */}

                    <div className="border rounded-xl bg-[#F5F5F5] p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <Text as="h3" variant="headingMd">Total Price on Shipping Label</Text>
                        <Text as="span" variant="headingLg">
                          ₹ {Number(formData.shippingCharges) + Number(formData.otherCharges)}
                        </Text>
                      </div>
                    </div>

                    <Checkbox
                      label="Save Address to your address book"
                      checked={saveAddress}
                      onChange={setSaveAddress}
                    />
                  </div>
                </Card>
              </div>

              {/* Order Summary Card */}
              <Card>
                <div className="p-6 space-y-6">
                  <Text as="h2" variant="headingLg">Order Summary</Text>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Text as="span">Subtotal for the Product (2 items)</Text>
                      <Text as="span">₹{subtotalFromDesign.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text as="span">Shipping Charges</Text>
                      <Text as="span">₹{formData.shippingCharges}</Text>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <Text as="h3" variant="headingMd">Total Order Value</Text>
                      <Text as="span" variant="headingLg">
                        ₹{(subtotalFromDesign + Number(formData.shippingCharges)).toFixed(2)}
                      </Text>
                    </div>
                    <Text as="p" variant="bodySm" tone="subdued">
                      *Shipping and VAT will be added in the next step.
                    </Text>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full !bg-[#272727] !text-white"
                    onClick={handleContinue}
                  >
                    Continue to Checkout
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
