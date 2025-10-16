import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Settings } from './pages/settings/Settings'
import { ErrorPage } from './pages/ErrorPage'
import { Credits } from './pages/credits/Credits'
import { Billing } from './pages/credits/Billing'
import { Branding1 } from './pages/Branding1'
import { Branding2 } from './pages/Branding2'
import { CustomBrandingSetup } from './pages/CustomBrandingSetup'
import { CustomBrandingPage } from './pages/CustomBrandingTable'
import { BrandingDetailsPage } from './pages/BrandingDetailsPage'
import { ProductVariantPage } from './pages/ProductVariantPage'
import { OrderReviewPage } from './pages/OrderReviewPage'
import { AssociatedProductsPage } from './pages/AssociatedProductsPage'
import { EditAssociatedProductsPage } from './pages/EditAssociatedProductsPage'
import { StoreConnect } from './pages/StoreConnect'
import { StoreConnectA } from './pages/StoreConnectA'
import { StoreConnectB } from './pages/StoreConnectB'
import { StoreConnect1 } from './pages/StoreConnect1'
import { StoreConnect2 } from './pages/StoreConnect2'
import { StoreConnectEditPrice } from './pages/StoreConnectEditPrice'
import { ProductProgress } from './pages/ProductProgress'
import { Orders } from './pages/orders/Orders'
import { Resources } from './pages/Resources'
import { ProductTemplates } from './pages/templates/ProductTemplates'
import { Collection } from './pages/templates/Collection'
import { ProductMockups } from './pages/ProductMockups'
import { ProductDetails } from './pages/ProductDetails'
import { ProductPricing } from './pages/ProductPricing'
import { StoreConnectSettings } from './pages/StoreConnectSettings'
import { Inventory } from './pages/orders/Inventory'
import { Info } from './pages/orders/Info'
import { ProductCatalog } from './pages/product-catalog/ProductCatalog'
import { ProductDetail } from './pages/product-catalog/ProductDetail'
import NewProductCatalog from './pages/NewProductCatalog'
import { OrderCheckout } from './pages/OrderCheckout'
import { OrderSummary } from './pages/OrderSummary'
import Mockup from './pages/mockup/Mockup'
import ProductEdit from './pages/product-catalog/ProductEdit'
import EnhancedProductEdit from './pages/product-catalog/EnhancedProductEdit'
import ProductDesignEditor from './pages/product-catalog/ProductDesignEditor'
import OrderingProcess from './pages/OrderingProcess'
import OrderConfirmation from './pages/OrderConfirmation'
import { ButtonGrid } from './pages/poc/Poc'
import ProductCustomizer from './pages/poc/ProductCustomizer'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <Toaster/>
        <div className="min-h-screen bg-[#1A1A1A]">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<ProductTemplates />} />
            <Route path="/templates/collection/:collectionId" element={<Collection />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/add-product" element={<NewProductCatalog currentStatus="Product" statusSteps={['Product', 'Shipping', 'Review & Pay']} nextPage="/add-product/edit" />} />
            <Route path="/add-product/edit" element={<ProductProgress currentStatus="Product" statusSteps={['Product', 'Shipping', 'Review & Pay']} nextPage="/add-product/checkout" />} />
            <Route path="/add-product/shipping" element={<NewProductCatalog currentStatus="Shipping" statusSteps={['Product', 'Shipping', 'Review & Pay']} nextPage="/add-product/review" />} />
            <Route path="/add-product/review" element={<NewProductCatalog currentStatus="Review & Pay" statusSteps={['Product', 'Shipping', 'Review & Pay']} nextPage="/" />} />
            <Route path="/add-product/checkout" element={<OrderCheckout />} />
            <Route path="/add-product/summary" element={<OrderSummary />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/credits/billing" element={<Billing />} />

            {/* Custom branding start */}
            <Route path="/branding" element={<Branding1 />} />
            <Route path="/branding/1" element={<Branding1 />} />
            <Route path="/branding/2" element={<Branding2 />} />
            <Route path="/branding/setup" element={<CustomBrandingSetup />} />
            <Route path="/branding/order-review" element={<OrderReviewPage />} />
            <Route path="/branding/custom-branding" element={<CustomBrandingPage />} />
            <Route path="/branding/custom-details" element={<BrandingDetailsPage />} />
            <Route path="/branding/custom-variant-page" element={<ProductVariantPage />} />
            <Route path="/branding/custom-product-page" element={<AssociatedProductsPage />} />
            <Route path="/branding/custom-product-edit" element={<EditAssociatedProductsPage />} />
            {/* Custom branding end */}

            {/* Store connect start */}
            <Route path="/store-connect" element={<StoreConnect />} />
            <Route path="/store-connect/A" element={<StoreConnectA />} />
            <Route path="/store-connect/B" element={<StoreConnectB />} />
            <Route path="/store-connect/1" element={<StoreConnect1 />} />
            <Route path="/store-connect/2" element={<StoreConnect2 />} />
            <Route path="/store-connect/edit-price" element={<StoreConnectEditPrice />} />
            <Route path="/product-progress" element={<ProductProgress currentStatus="Product" statusSteps={['Product', 'Design', 'Mockups', 'Details', 'Pricing']} />} />
            <Route path="/product-progress/product" element={<ProductProgress currentStatus="Product" statusSteps={['Product', 'Design', 'Mockups', 'Details', 'Pricing']} />} />
            <Route path="/product-progress/mockups" element={<ProductMockups />} />
            <Route path="/product-progress/details" element={<ProductDetails />} />
            <Route path="/product-progress/catolog" element={<NewProductCatalog currentStatus="Product" statusSteps={['Product', 'Design', 'Mockups', 'Details', 'Pricing']} />} />
            <Route path="/product-progress/pricing" element={<ProductPricing />} />
            <Route path="/product-progress/store-connect-settings" element={<StoreConnectSettings />} />
            {/* Store connect end */}
            
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<Info />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/mockup" element={<Mockup />} />
            <Route path="/product-edit/:id" element={<ProductEdit />} />
            <Route path="/product-edit-enhanced/:id" element={<EnhancedProductEdit />} />
            <Route path="/product-design-editor/:id" element={<ProductDesignEditor />} />
            <Route path="/ordering-process" element={<OrderingProcess />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="*" element={<ErrorPage />} />
            {/* */}
            <Route path="/poc" element={<ButtonGrid/>}/>
            <Route path="/product-customizer/:id" element={<ProductCustomizer/>}/>            
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}
export default App
