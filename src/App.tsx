import { CartProvider } from './context/CartContext';
import { PageProvider, usePage } from './context/PageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ContactPage from './pages/ContactPage';
import ArtisanatPage from "./pages/ArtisanatPage";
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

function AppContent() {
  const { page } = usePage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartDrawer />
      <main>
        {page === 'home' && <HomePage />}
        {page === 'product' && <ProductPage />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'artisanat' && <ArtisanatPage />}
        {page === 'order-confirmation' && <OrderConfirmationPage />}
        {page === 'order-success' && <OrderSuccessPage />}
        {page === 'admin' && <AdminPage />}
        {page === 'admin-login' && <AdminLoginPage />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <PageProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </PageProvider>
  );
}

export default App;
