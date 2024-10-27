import Login from './components/Login.js';
import IndexPage from './components/IndexPage.js'
import './App.css'
import LoginCredential from './components/LoginCredential.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
       <Router>
          <Routes>
          <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/LoginCredential" element={<LoginCredential />} />
        <Route path="/IndexPage" element={<IndexPage />} />
          </Routes>
       </Router>
       
    </>
  );
}

export default App;
