import { Routes, Route, useLocation } from 'react-router-dom';
import Accueil from './pages/home/HomePage.jsx';
import AdminSection from './features/admin/components/AdminSection.jsx';
import Connection from './pages/auth/ConnectionPage.jsx';
import ManhwaPage from './pages/content/ManhwaPage.jsx';
import { AnimatePresence } from "framer-motion";
import UserCollection from './pages/user/collection/userCollection.jsx';
// eslint-disable-next-line
import ProfilePage from './pages/user/profile/ProfilePage.jsx'
import Library from './pages/library/library.jsx';
import EditProfilePage from './pages/user/editProfile/EditProfilePage.jsx'
import ProtectedRoute from './shared/utils/routes/ProtectedRoute.jsx'

function Router() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Accueil />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/login" element={<Connection />} />
        <Route path="/manhwa/:id" element={<ManhwaPage />} />
        <Route path="/collection/:userName" element={<UserCollection />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/admin" element={<AdminSection />} />
        <Route path="/editprofile" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default Router;
