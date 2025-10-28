import { Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil.jsx';
import AdminSection from './components/Admin/adminSection.jsx';
import Connection from './pages/Connection.jsx';

function Router() {
  return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/adminpanel" element={<AdminSection />} />
        <Route path="/login" element={<Connection />} />

      </Routes>
  );
}

export default Router;