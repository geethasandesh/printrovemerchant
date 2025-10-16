import { useState } from "react";
import {
  BlockStack,
  Icon,
  InlineStack,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  position?: "left" | "right";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  position = "left",
}) => {
  return (
    <div className={`flex items-center gap-2 py-2 ${position === "left" ? "flex-row-reverse justify-end" : "flex-row"}`}>
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          checked ? "bg-custom-blue" : "bg-gray-300"
        }`}
      >
        <span
          className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

export function StoreConnectTab() {
  const [storeName, setStoreName] = useState('');
  const [website, setWebsite] = useState('');
  const [customBranding, setCustomBranding] = useState(true);

  const [pullOrders, setPullOrders] = useState(true);
  const [autoPlace1, setAutoPlace1] = useState(true);
  const [autoPlace2, setAutoPlace2] = useState(false);
  const [autoPlace3, setAutoPlace3] = useState(false);

  const storeOptions = [
    { label: 'Select a store', value: '' },
    { label: 'Shopify', value: 'shopify' },
    { label: 'Shopline', value: 'shopline' },
  ];

  return (
    <div className="space-y-8 border border-[#E3E3E3] p-6 rounded-[10px]">
      {/* Store Default */}
      <div className="space-y-4" style={{ maxWidth: "100%" }}>
        <h2 className="text-[20px] leading-[28px] font-semibold text-[#121212]">
          Store Default
        </h2>

        <BlockStack gap={"200"}>
          <div style={{ width: 359 }}>
            <Select
              label={
                <InlineStack gap={"100"}>
                  <Text as="p">Choose Store</Text>
                  <Icon source={InfoIcon} />
                </InlineStack>
              }
              options={storeOptions}
              onChange={() => {}}
              value=""
            />
          </div>
          <div style={{ width: 516 }}>
            <TextField
              autoComplete="off"
              label={
                <InlineStack gap={"100"}>
                  <Text as="p">Store Name</Text>
                  <Icon source={InfoIcon} />
                </InlineStack>
              }
              value={storeName}
              onChange={setStoreName}
            />
          </div>
          <div style={{ width: 516 }}>
            <TextField
              label={
                <InlineStack gap={"100"}>
                  <Text as="p">Website</Text>
                  <Icon source={InfoIcon} />
                </InlineStack>
              }
              value={website}
              onChange={setWebsite}
              autoComplete="off"
              placeholder="www.xyz.com"
            />
          </div>

          {/* Custom Branding switch remains on the right */}
          <ToggleSwitch
            checked={customBranding}
            onChange={setCustomBranding}
            label="Custom Branding"
            position="right"
          />
        </BlockStack>

        <button className="w-[180px] h-[40px] rounded-[6.5px] text-[14px] font-semibold bg-[#121212] text-white">
          Save
        </button>
      </div>

      {/* Store Settings */}
      <div className="space-y-4">
        <h2 className="text-[20px] leading-[28px] font-semibold text-[#121212]">
          Store Settings
        </h2>

        <ToggleSwitch
          checked={pullOrders}
          onChange={setPullOrders}
          label="Pull orders from your store automatically"
        />
        <ToggleSwitch
          checked={autoPlace1}
          onChange={setAutoPlace1}
          label="Place prepaid orders automatically without the manual confirmation"
        />
        <ToggleSwitch
          checked={autoPlace2}
          onChange={setAutoPlace2}
          label="Place prepaid orders automatically without the manual confirmation"
        />
        <ToggleSwitch
          checked={autoPlace3}
          onChange={setAutoPlace3}
          label="Place prepaid orders automatically without the manual confirmation"
        />

        <button className="w-[180px] h-[40px] rounded-[6.5px] text-[14px] font-semibold bg-[#121212] text-white">
          Save
        </button>
      </div>

      {/* Remove Store */}
      <div className="space-y-2">
        <h2 className="text-[20px] leading-[28px] font-semibold text-[#121212]">
          Remove Store
        </h2>
        <p className="text-sm text-[#444]">
          Removing your store will completely remove all the content associated with it. There is no way back, please be careful with this option.
        </p>
        <button className="w-[180px] h-[40px] rounded-[6.5px] text-[14px] font-semibold bg-[#F3F3F3] text-black">
          Remove
        </button>
      </div>
    </div>
  );
}