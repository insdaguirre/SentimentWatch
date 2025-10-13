import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import AgentPage from './pages/AgentPage';
import NewsPage from './pages/NewsPage';
import DevPage from './pages/DevPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/dev" element={<DevPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;