import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ isLoggedIn, currentUser, handleLogout }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;