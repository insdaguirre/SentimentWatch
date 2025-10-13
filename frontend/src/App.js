import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import AgentPage from './pages/AgentPage';
import NewsPage from './pages/NewsPage';
import DevPage from './pages/DevPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/dev" element={<DevPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;