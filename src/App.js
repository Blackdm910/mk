import React from 'react';
import { Route, Routes } from 'react-router-dom';
import KomikList from './components/KomikList';
import ChapterList from './components/ChapterList';
import ChapterDetail from './components/ChapterDetail';
import SearchResults from './components/SearchResults';
import './App.css'; // Mengimpor file CSS
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<KomikList />} />
        <Route path="/komik/:id/chapters" element={<ChapterList />} />
        <Route
          path="/komik/:id/chapter/:chapterId"
          element={<ChapterDetail />}
        />
        <Route path="/search/:query" element={<SearchResults />} />{' '}
        {/* Perbaikan di sini */}
      </Routes>
      <SpeedInsights />
    </div>
  );
}

export default App;
