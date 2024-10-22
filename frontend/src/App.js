import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/capd-test-docs-personal" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
