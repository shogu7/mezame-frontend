import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil.jsx';
import AdminSection from './components/Admin/adminSection.jsx';

function Router() {
  return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/adminpanel" element={<AdminSection />} />

      </Routes>
  );
}

export default Router;