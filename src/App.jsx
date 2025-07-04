import './App.css'
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import Login from './components/Login'
import Signup from './components/Signup'
import Upload from './components/Upload'
import Dashboard from './components/Dashboard';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
