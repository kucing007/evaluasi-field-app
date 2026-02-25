import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AsetListPage from './pages/AsetListPage';
import FormInputPage from './pages/FormInputPage';
import ExportPage from './pages/ExportPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-lg mx-auto min-h-dvh">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paket/:paketId" element={<AsetListPage />} />
          <Route path="/aset/:asetId" element={<FormInputPage />} />
          <Route path="/export/:paketId" element={<ExportPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
