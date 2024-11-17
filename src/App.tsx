import React from "react";
import Navbar from "./components/universal/Navbar";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/universal/Home";
import Authcallback from "./components/authentication/Authcallback";
import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReceiptPage from "./pages/ReceiptPage";
import AdminMainPage from "./pages/admin/AdminMainPage";
import AdminReceiptPage from "./pages/admin/AdminReceiptPage";
import AdminEconomicRequestPage from "./pages/admin/AdminEconomicRequestPage";
import Footer from "./components/universal/Footer";
import FaqPage from "./pages/FaqPage";
import { Fragment } from "react";
import AdminReviewReceiptPage from "./pages/admin/AdminReviewReceiptPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { isAuthenticated } = useAuth0();
  const queryClient = new QueryClient();

  const isAdmin = (): Boolean => {
    return localStorage.getItem("autobankauth0login") != null
      ? JSON.parse(localStorage.getItem("autobankauth0login")!).isadmin
      : false;
  };

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="App bg-[#2e6e53]">
          <Navbar />
          {isAuthenticated ? (
            <Routes>
              <Route path="/" element={<Home />} /> :
              <Route
                path="/authentication/callback"
                element={<Authcallback />}
              />
              <Route path="/kvittering" element={<ReceiptPage />} />
              <Route path="/minside" element={<ProfilePage />} />
              <Route path="/faq" element={<FaqPage />} />
              {isAuthenticated && isAdmin() && (
                <Fragment>
                  <Route path="/admin/" element={<AdminMainPage />} />
                  <Route
                    path="/admin/kvittering"
                    element={<AdminReceiptPage />}
                  />
                  <Route
                    path="/admin/soknad"
                    element={<AdminEconomicRequestPage />}
                  />
                  <Route
                    path="/admin/kvittering/:receiptid"
                    element={<AdminReviewReceiptPage />}
                  />
                </Fragment>
              )}
            </Routes>
          ) : (
            <Routes>
              <Route path="/*" element={<LoginPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route
                path="/authentication/callback"
                element={<Authcallback />}
              />
            </Routes>
          )}
        </div>
        <Footer />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
