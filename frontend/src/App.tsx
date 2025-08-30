// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Notes from './pages/Notes';
import WelcomeScreen from "./pages/WelcomeScreen";
import VerifyGmail from "./pages/verifyGmail";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/verify-gmail" element={<VerifyGmail />} />
      </Routes>
    </div>
  );
}

export default App;
