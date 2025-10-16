import { useEffect } from "react";
import { Navbar } from "../layout/Navbar";
import { SideMenu } from "../layout/SideMenu";
import {
  Page,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Divider,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { ProductRecommendation } from "../components/ProductRecommendation";
import CatalogSidebarFilters from "../utilityComponents/CatalogSidebarFilters";
import { ProgressBar } from "./orders/ProgressBar";
import { useFetch } from "../hooks/useFetch";
import { useProductCatalogStore } from "../store/useProductCatlog";
import { transformMongoProductsToProducts } from "../utilityComponents/transformProductData";

export default function NewProductCatalog({
  currentStatus,
  statusSteps,
}: {
  currentStatus: string;
  statusSteps: string[];
}) {
  // Fetch only active products for merchant catalog
  const { data } = useFetch(`/products/all?status=active`, 0);
  const { products, setProducts } = useProductCatalogStore();

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      console.log('Setting products from API in NewProductCatalog:', data.data.length);
      // Transform MongoDB products to match expected Product interface
      const transformedProducts = transformMongoProductsToProducts(data.data);
      console.log('Transformed products:', transformedProducts);
      setProducts(transformedProducts);
    }
  }, [data, setProducts]);

  const renderProductList = () => {
    if (!products || products.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          No products available yet. Create products in the admin panel to see them here.
        </div>
      );
    }

    return products.map((product: any) => {
      // Products are now transformed to match the Product interface
      return (
        <ProductRecommendation
          key={product.id}
          id={product.id}
          title={product.name}
          price={product.price}
          discount={product.discount || 0}
          sizes={product.sizes || []}
          currency={product.currency || "₹"}
          colorImageMap={product.colorImageMap || {
            default: { color: '#FFFFFF', path: '/product-img-white.png' }
          }}
        />
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-[#1A1A1A] min-h-[calc(100vh-64px)]">
        <SideMenu activeTab="catalog" />
        <div className="flex-1 bg-white">
          <Page title="Choose Mockups" titleHidden fullWidth>
            <div style={{ padding: "20px 0" }}>
              <InlineStack blockAlign="center" gap={"1200"}>
                <InlineStack gap={"200"}>
                  <Button icon={ArrowLeftIcon} />
                  <Text as="p" variant="heading2xl">
                    Add Product
                  </Text>
                </InlineStack>
                <ProgressBar
                  currentStatus={currentStatus}
                  statusSteps={statusSteps}
                />
              </InlineStack>
            </div>
            <div className="mb-20">
              <BlockStack gap={"500"}>
                <Divider borderColor="border" />
                <div className="tabs">
                  <div className="tab active">Product Catalogue</div>
                  <div className="tab">My Product Templates</div>
                </div>
                <InlineStack wrap={false} gap={"400"}>
                  <CatalogSidebarFilters />
                  <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-[#121212]">
                      Product Catalogue
                    </h2>
                    <BlockStack>
                      <InlineStack gap={"400"}>
                        <Text as="p" variant="headingLg">
                          Trending Items
                        </Text>
                        <Button variant="plain">View all</Button>
                      </InlineStack>
                      <div className="flex gap-6 flex-wrap">
                        {renderProductList()}
                      </div>
                    </BlockStack>
                  </div>
                </InlineStack>
              </BlockStack>
            </div>
          </Page>
        </div>
      </div>
    </>
  );
}
