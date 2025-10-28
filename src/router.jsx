import { Routes, Route, useLocation } from 'react-router-dom';
import Accueil from './pages/Accueil.jsx';
import AdminSection from './components/Admin/adminSection.jsx';
import Connection from './pages/Connection.jsx';
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
