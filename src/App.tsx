import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import RequestDetailPage from './pages/RequestDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/request/:id" element={<RequestDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;