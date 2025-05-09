import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login } from "../pages";

export default function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
