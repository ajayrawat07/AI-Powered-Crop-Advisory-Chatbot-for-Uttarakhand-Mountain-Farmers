import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';
import Home from '../../../src/pages/Home';
import Dashboard from '../../../src/pages/Dashboard';
import About from '../../../src/pages/About';
import Login from '../../../src/pages/Login';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;