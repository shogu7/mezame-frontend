import { Routes, Route, useLocation } from 'react-router-dom';
import Accueil from './pages/home/HomePage.jsx';
import AdminSection from './features/admin/components/AdminSection.jsx';
import Connection from './pages/auth/ConnectionPage.jsx';
import { AnimatePresence } from "framer-motion";

function Router() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Accueil />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/adminpanel" element={<AdminSection />} />
        <Route path="/login" element={<Connection />} />
      </Routes>
    </AnimatePresence>
  );
}

export default Router;
