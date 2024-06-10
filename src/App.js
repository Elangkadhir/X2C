import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExcelReader from './components/ExcelReader';
import CardPage from './components/CardPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<ExcelReader />} />
          <Route path="/card" element={<CardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
