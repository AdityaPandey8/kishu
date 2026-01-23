import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import "@/i18n";

import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Diagnosis from "./pages/Diagnosis";
import Crops from "./pages/Crops";
import CropDetail from "./pages/CropDetail";
import Community from "./pages/Community";
import WeatherAlerts from "./pages/WeatherAlerts";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Search from "./pages/Search";
import Products from "./pages/Products";
import Inquiries from "./pages/Inquiries";
import Users from "./pages/Users";
import DealerAnalytics from "./pages/DealerAnalytics";
import QuoteBuilder from "./pages/QuoteBuilder";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Reels from "./pages/Reels";
import ReelSearch from "./pages/ReelSearch";
import CreatorProfile from "./pages/CreatorProfile";
import BecomeCreator from "./pages/BecomeCreator";
import CreatorStudio from "./pages/CreatorStudio";
import UploadReel from "./pages/UploadReel";
import LocationSettings from "./pages/LocationSettings";
import MarketPricesPage from "./pages/MarketPricesPage";
import BecomeExpert from "./pages/BecomeExpert";
import ExpertDashboard from "./pages/ExpertDashboard";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminKYC from "./pages/admin/AdminKYC";
import DealerKYC from "./pages/dealer/DealerKYC";
import KYCPending from "./pages/dealer/KYCPending";
import KYCRejected from "./pages/dealer/KYCRejected";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <DataProvider>
          <TooltipProvider>
            <OfflineIndicator />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/diagnosis/:id" element={<Diagnosis />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/crops/:id" element={<CropDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/weather-alerts" element={<WeatherAlerts />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/help" element={<Help />} />
                <Route path="/search" element={<Search />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inquiries" element={<Inquiries />} />
                <Route path="/users" element={<Users />} />
                <Route path="/analytics" element={<DealerAnalytics />} />
                <Route path="/quotes/new" element={<QuoteBuilder />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/reels/search" element={<ReelSearch />} />
                <Route path="/creator/:id" element={<CreatorProfile />} />
                <Route path="/become-creator" element={<BecomeCreator />} />
                <Route path="/creator-studio" element={<CreatorStudio />} />
                <Route path="/creator-studio/upload" element={<UploadReel />} />
                <Route path="/settings/location" element={<LocationSettings />} />
                <Route path="/market-prices" element={<MarketPricesPage />} />
                <Route path="/become-expert" element={<BecomeExpert />} />
                <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                <Route path="/admin/experts" element={<AdminExperts />} />
                <Route path="/admin/kyc" element={<AdminKYC />} />
                <Route path="/dealer/kyc" element={<DealerKYC />} />
                <Route path="/dealer/kyc-pending" element={<KYCPending />} />
                <Route path="/dealer/kyc-rejected" element={<KYCRejected />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
