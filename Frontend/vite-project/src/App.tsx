import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./redux/store";
// PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
// COMPONENTS
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
// THUNK
import { loadUser } from "./redux/Slices/authSlice";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingUser } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const hideNavbar =
    isAuthenticated &&
    (location.pathname === "/dashboard" || location.pathname === "/admin");
  // AUTH CHECK
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  // LOADING SCREEN
  if (isLoadingUser) {
    return (
      <div
        className="
          min-h-screen
          bg-[#0f172a]
          text-white
          flex
          items-center
          justify-center
          text-2xl
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* MAIN */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      {/* FOOTER */}

      {<Footer />}
    </div>
  );
};

export default App;
