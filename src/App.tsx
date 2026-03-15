import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import "@/i18n";

import Index from "./pages/Index";
import AuthLanding from "./pages/auth/AuthLanding";
import FarmerLogin from "./pages/auth/FarmerLogin";
import FarmerSignup from "./pages/auth/FarmerSignup";
import DealerLogin from "./pages/auth/DealerLogin";
import DealerSignup from "./pages/auth/DealerSignup";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Diagnosis from "./pages/Diagnosis";
import Crops from "./pages/Crops";
import CropDetail from "./pages/CropDetail";
import Community from "./pages/Community";
import CommunityVideo from "./pages/CommunityVideo";
import CommunitySearch from "./pages/CommunitySearch";
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
import CropRecommendations from "./pages/CropRecommendations";
import BecomeExpert from "./pages/BecomeExpert";
import ExpertDashboard from "./pages/ExpertDashboard";
import Experts from "./pages/Experts";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminKYC from "./pages/admin/AdminKYC";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminContent from "./pages/admin/AdminContent";
import DealerKYC from "./pages/dealer/DealerKYC";
import KYCPending from "./pages/dealer/KYCPending";
import KYCRejected from "./pages/dealer/KYCRejected";
import OrderManagement from "./pages/dealer/OrderManagement";
import BuyerProfile from "./pages/BuyerProfile";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import AgriServices from "./pages/agri-services/AgriServices";
import ServiceDetail from "./pages/agri-services/ServiceDetail";
import BookService from "./pages/agri-services/BookService";
import MyBookings from "./pages/agri-services/MyBookings";
import BookingDetail from "./pages/agri-services/BookingDetail";
import Home from "./pages/Home";
import ProviderLogin from "./pages/auth/ProviderLogin";
import ProviderSignup from "./pages/auth/ProviderSignup";
import ProviderPending from "./pages/provider/ProviderPending";
import ProviderRejected from "./pages/provider/ProviderRejected";
import AdminServiceProviders from "./pages/admin/AdminServiceProviders";
import AdminServices from "./pages/admin/AdminServices";
import UserDetail from "./pages/admin/UserDetail";

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
                {/* Role-based auth routes */}
                <Route path="/auth" element={<AuthLanding />} />
                <Route path="/auth/farmer/login" element={<FarmerLogin />} />
                <Route path="/auth/farmer/signup" element={<FarmerSignup />} />
                <Route path="/auth/dealer/login" element={<DealerLogin />} />
                <Route path="/auth/dealer/signup" element={<DealerSignup />} />
                <Route path="/auth/admin/login" element={<AdminLogin />} />
                {/* Redirect old routes to new auth landing */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/signup" element={<Navigate to="/auth" replace />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/diagnosis/:id" element={<Diagnosis />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/crops/:id" element={<CropDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/video/:postId" element={<CommunityVideo />} />
                <Route path="/community/search" element={<CommunitySearch />} />
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
                <Route path="/crop-recommendations" element={<CropRecommendations />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/become-expert" element={<BecomeExpert />} />
                <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                <Route path="/admin/experts" element={<AdminExperts />} />
                <Route path="/admin/kyc" element={<AdminKYC />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/inquiries" element={<AdminInquiries />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/dealer/kyc" element={<DealerKYC />} />
                <Route path="/dealer/kyc-pending" element={<KYCPending />} />
                <Route path="/dealer/kyc-rejected" element={<KYCRejected />} />
                <Route path="/dealer/orders" element={<OrderManagement />} />
                <Route path="/buyer/:id" element={<BuyerProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/home" element={<Home />} />
                <Route path="/agri-services" element={<AgriServices />} />
                <Route path="/agri-services/:id" element={<ServiceDetail />} />
                <Route path="/agri-services/:id/book" element={<BookService />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/my-bookings/:id" element={<BookingDetail />} />
                {/* Provider auth */}
                <Route path="/auth/provider/login" element={<ProviderLogin />} />
                <Route path="/auth/provider/signup" element={<ProviderSignup />} />
                <Route path="/provider/pending" element={<ProviderPending />} />
                <Route path="/provider/rejected" element={<ProviderRejected />} />
                {/* Admin management */}
                <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/users/:id" element={<UserDetail />} />
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
