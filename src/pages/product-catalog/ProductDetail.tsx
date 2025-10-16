import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Navbar } from "../../layout/Navbar";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  InfoIcon,
  MeasurementSizeIcon,
  MenuVerticalIcon
} from "@shopify/polaris-icons";
import { Card, Icon, TextField } from "@shopify/polaris";
import { useState } from "react";

export function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("white");
  const [pincode, setPincode] = useState("");
  const [selectedPrintingType, setSelectedPrintingType] = useState<"dtf" | "dtg">("dtf");

  const productImages = [
    "/product-img-white.png",
    "/product-img-blue.png",
    "/product-img-red.png",
    "/product-img-yellow.png"
  ];

  const colors = [
    { label: "White", value: "white", hex: "#FFFFFF", border: "#D0D0D0" },
    { label: "Red", value: "red", hex: "#EF4D2F" },
    { label: "Orange", value: "orange", hex: "#FFD79D" },
    { label: "Blue", value: "blue", hex: "#A4E8F2" },
    { label: "Black", value: "black", hex: "#303030" },
    { label: "Grey", value: "grey", hex: "#E3E3E3" }
  ];

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: `Our Classic White T-Shirt is crafted from 100% premium cotton, ensuring both comfort and durability.
Available in a range of sizes from S to 2XL, this versatile piece is perfect for both casual wear and custom printing projects.`
    },
    {
      id: "size-guide",
      label: "Size Guide",
      content: `Size Chart (measurements in inches):
Small: Chest 36-38", Length 27", Sleeve 8"
Medium: Chest 38-40", Length 28", Sleeve 8.5"
Large: Chest 40-42", Length 29", Sleeve 9"
XL: Chest 42-44", Length 30", Sleeve 9.5"
2XL: Chest 44-46", Length 31", Sleeve 10"

Fit Guide:
- Regular fit, true to size
- For a looser fit, order one size up
- Pre-shrunk fabric, but we recommend cold wash for best results
- Model wears size M (Height: 6'0")`
    },
    {
      id: "production",
      label: "Production",
      content: `Production Timeline:
- Order Processing: 1-2 business days
- Printing: 2-3 business days
- Quality Check: 1 business day
- Packaging: 1 business day

Production Methods:
- DTG (Direct to Garment) printing for detailed, full-color designs
- Screen printing available for bulk orders
- Heat transfer for specialty materials

Quality Standards:
- Each item undergoes three stages of quality checks
- Color matching verification
- Print durability testing
- Wash test samples from each batch`
    },
    {
      id: "shipping",
      label: "Shipping",
      content: `Shipping Options:
- Standard Shipping (5-7 business days): Free
- Express Shipping (2-3 business days): $12.99
- Next Day Delivery (where available): $24.99

International Shipping:
- Available to most countries
- Delivery time: 7-14 business days
- Customs and import duties may apply

Order Tracking:
- Tracking number provided via email
- Real-time tracking updates
- Signature confirmation for orders over $100`
    },
    {
      id: "file-guideline",
      label: "File Guideline",
      content: `File Requirements:
- Minimum Resolution: 300 DPI
- File Formats: AI, PSD, PDF, PNG, JPG
- Color Mode: CMYK for best print results
- Maximum Print Area: 14" x 16"

Design Guidelines:
- Keep important elements 1" away from seams
- Text should be at least 14pt for readability
- Convert all text to outlines
- Avoid placing designs over seams

Common Issues to Avoid:
- Low resolution images
- RGB color mode
- Raster fonts
- Transparent backgrounds in final files`
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-[10%] p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="icon"
              onClick={() => navigate("/catalog")}
              icon={<ArrowLeftIcon className="w-4 h-4" />}
            />
            <h1 className="text-2xl font-bold text-[#121212]">White Solid Tshirt half sleeves</h1>
          </div>
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="text-[#005BD3] hover:underline cursor-pointer">Product Catalogue</span>
                <span className="text-[#005BD3]">/</span>
                <span className="text-[#005BD3] hover:underline cursor-pointer">Men's Clothing</span>
                <span className="text-[#005BD3]">/</span>
                <span className="text-[#005BD3] hover:underline cursor-pointer">Tshirts</span>
                <span className="text-[#005BD3]">/</span>
                <span className="text-[#121212]">Classic White T-Shirt</span>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Left */}
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className={`w-20 h-20 rounded-lg border overflow-hidden cursor-pointer transition-colors ${
                          activeImageIndex === index
                            ? "border-[#005BD3]"
                            : "border-[#E1E1E1] hover:border-[#005BD3]"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 relative">
                    <div className="rounded-lg border border-[#E1E1E1] overflow-hidden">
                      <img
                        src={productImages[activeImageIndex]}
                        alt="Product preview"
                        className="w-full h-[50vh] object-cover"
                      />
                    </div>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-[#303030]">White Solid Tshirt half sleeves</h2>
                    <button className="p-1.5 rounded-lg bg-[#F5F5F5] border border-[#D0D0D0]">
                      <HeartIcon className="w-5 h-5 text-[#212121]" />
                    </button>
                  </div>
                  <div className="bg-[#FFEF9D] w-fit px-2 py-0.5 rounded-lg text-xs font-medium text-[#4F4700]">
                    #15 Bestseller
                  </div>

                  {/* Printing Type */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Printing Type</span>
                      <span className="text-sm text-[#616161]">({selectedPrintingType.toUpperCase()})</span>
                    </div>
                    <div className="inline-flex gap-6 bg-[#F5F5F5] p-1.5 rounded-xl">
                      {["dtf", "dtg"].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedPrintingType(type as "dtf" | "dtg")}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedPrintingType === type
                              ? "bg-[#D1D1D1]"
                              : "bg-[#DDDDDD] hover:bg-[#D8D8D8]"
                          }`}
                        >
                          <span className="text-sm font-medium">{type.toUpperCase()} Printing</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Color</span>
                      <span className="text-sm text-[#616161]">({selectedColor})</span>
                    </div>
                    <div className="flex gap-2.5">
                      {colors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-7 h-7 rounded-lg ${
                            selectedColor === color.value
                              ? "ring-2 ring-[#005BD3]"
                              : "border border-[#E3E3E3]"
                          }`}
                          style={{
                            backgroundColor: color.hex,
                            borderColor: color.border || "#E3E3E3"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Size</span>
                      <button className="inline-flex items-center gap-1 text-[#005BD3] text-xs font-medium">
                        <Icon source={MeasurementSizeIcon} />
                        Size chart
                      </button>
                    </div>
                    <div className="flex gap-2.5">
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center ${
                            selectedSize === size
                              ? "border-2 border-[#005BD3] text-[#005BD3]"
                              : "border border-[#505050] text-[#434343]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Pincode */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <span className="font-bold text-sm">Price</span>
                        <div className="text-[30px] font-bold text-[#00527C]">$ 19.55</div>
                      </div>
                      <div className="bg-[#E0F0FF] px-2 py-1 rounded-lg inline-flex items-center gap-1">
                        <Icon source={InfoIcon} tone="info" />
                        <span className="text-sm font-medium text-[#002133]">
                          Free shipping on orders above $30
                        </span>
                      </div>
                    </div>
                    <div className="bg-white border border-[#E3E3E3] rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Pin code</span>
                        <Icon source={InfoIcon} tone="subdued" />
                      </div>
                      <div className="flex items-center gap-2">
                        <TextField
                          label=""
                          labelHidden
                          value={pincode}
                          onChange={setPincode}
                          placeholder="Enter Pin code here"
                          autoComplete="off"
                        />
                        <Button>Apply</Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="primary"
                      className="flex-1 !bg-black !text-white hover:!bg-black/90"
                      onClick={() => navigate(`/product-design-editor/${id || '1'}`)}
                    >
                      Start Design
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 border border-[#DCDCDC] bg-[#F4F4F5]"
                    >
                      Add to Store
                    </Button>
                    <Button variant="icon" icon={<MenuVerticalIcon className="w-4 h-4" />} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex gap-6 border-b border-[#E1E1E1]">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-2.5 py-2.5 relative ${
                    activeTab === tab.id
                      ? "text-[#303030] font-semibold"
                      : "text-[#303030]/60 hover:text-[#303030]/80"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 max-w-3xl whitespace-pre-line">
              {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
