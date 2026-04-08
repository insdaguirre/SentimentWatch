import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
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
            <Route path="/dashboard" element={<AgentPage />} />
            <Route path="/feed" element={<NewsPage />} />
            <Route path="/about" element={<DevPage />} />
            <Route path="/agent" element={<Navigate to="/dashboard" replace />} />
            <Route path="/news" element={<Navigate to="/feed" replace />} />
            <Route path="/dev" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
