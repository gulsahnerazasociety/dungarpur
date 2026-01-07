import { HashRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import CompetitionInfo from "./pages/CompetitionInfo";
import Admin from "./pages/Admin";
import Participants from "./pages/Participants";
import AdmitCard from "./pages/AdmitCard";
import UploadDocuments from "./pages/UploadDocuments"

function App() {
  return (
   <HashRouter basename="/">

      {/* 🔥 GLOBAL NAVBAR (हर Page पर दिखेगा) */}
      <nav className="navbar">
        <div className="logo">
          Gulshan-E-Raza Society
        </div>

        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">☰</label>

        <ul className="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/participants">Participants</Link></li>

          <li><Link to="/competition">Competition Info</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/payment">Payment</Link></li>
          <li><Link to="/receipt">Receipt</Link></li>
          <li><Link to="/upload-documents">Photo & Docs Upload</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competition" element={<CompetitionInfo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/upload-documents" element={<UploadDocuments />} />


      </Routes>
  </HashRouter>
  );
}

export default App;
