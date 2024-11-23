import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ChapterList = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [komikData, setKomikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul'); // State untuk tab aktif

  // Ambil data komik dan chapters
  useEffect(() => {
    const fetchKomikData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await fetch(
          `${apiUrl}/api/komik/info/${decodeURIComponent(id)}`
        );
        const komik = await response.json();
        setKomikData(komik);
      } catch (error) {
        console.error('Error fetching komik data:', error);
      }
    };
    fetchKomikData();
  }, [id]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const urlF = `${apiUrl}/api/komik/${decodeURIComponent(id)}/chapters`;
        const response = await fetch(decodeURIComponent(urlF));
        const data = await response.json();
        setChapters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setLoading(false);
      }
    };
    fetchChapters();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Dapatkan Chapter 1 dan Chapter Terakhir
  const getChapterUrl = (chapter) => {
    const regex = /chapter-(\d+)/;
    const match = chapter.url.match(regex);
    return match ? match[1] : 'unknown';
  };

  const lastChapterUrl = chapters[0] ? getChapterUrl(chapters[0]) : null;
  const chapter1Url = chapters[chapters.length - 1]
    ? getChapterUrl(chapters[chapters.length - 1])
    : null;

  return (
    <div
      className="chapter-list"
      style={{ padding: '20px', backgroundColor: '#121212', color: '#fff' }}
    >
      {/* Thumbnail Komik */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#333',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {komikData?.thumbnail && (
          <CardMedia
            component="img"
            height="300"
            image={komikData.thumbnail}
            alt="Thumbnail"
            style={{
              margin: '0 auto',
              maxWidth: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        )}
      </div>

      {/* Judul */}
      <Typography
        variant="h4"
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        {komikData?.alternativeTitles[0] || 'Judul Komik Tidak Tersedia'}
      </Typography>

      {/* Tombol Tab */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button
          variant={activeTab === 'judul' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('judul')}
          style={{ marginRight: '10px', borderRadius: '20px' }}
        >
          Judul
        </Button>
        <Button
          variant={activeTab === 'sinopsis' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('sinopsis')}
          style={{ marginRight: '10px', borderRadius: '20px' }}
        >
          Sinopsis
        </Button>
        <Button
          variant={activeTab === 'spoiler' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('spoiler')}
          style={{ borderRadius: '20px' }}
        >
          Spoiler
        </Button>
      </div>

      {/* Konten Tab */}
      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#ddd' }}>
        {activeTab === 'judul' && (
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            {komikData?.alternativeTitles[0] || 'Judul Tidak Tersedia'}
          </Typography>
        )}
        {activeTab === 'sinopsis' && (
          <Typography variant="body2" style={{ fontStyle: 'italic' }}>
            {komikData?.synopsis || 'Sinopsis tidak ditemukan.'}
          </Typography>
        )}
        {activeTab === 'spoiler' && komikData?.spoilerImages && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {komikData.spoilerImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`spoiler ${index}`}
                style={{ width: '250px', margin: '10px', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tombol untuk Chapter 1 dan Chapter Terakhir */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            color: '#bbb', // Warna abu-abu
          }}
        >
          <Link
            to={`/komik/${id}/chapter/${chapter1Url}`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#333',
              padding: '15px',
              color: '#bbb', // Warna abu-abu
              textAlign: 'left',
              borderRadius: '8px',
              fontSize: '16px',
              width: '45%',
            }}
          >
            Chapter 1
          </Link>
          <Typography
            variant="body2"
            style={{ fontWeight: 'bold', marginLeft: '10px' }}
          ></Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#bbb', // Warna abu-abu
          }}
        >
          <Link
            to={`/komik/${id}/chapter/${lastChapterUrl}`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#333',
              padding: '15px',
              color: '#bbb', // Warna abu-abu
              textAlign: 'right',
              borderRadius: '8px',
              fontSize: '16px',
              width: '45%',
              marginLeft: 'auto',
            }}
          >
            Chapter {chapters.length}
          </Link>
        </div>
      </div>

      {/* Daftar Chapter dalam Satu Expandable Accordion */}
      <Accordion
        style={{
          marginBottom: '10px',
          backgroundColor: '#333',
          width: '50%',
          marginLeft: '5%',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Daftar Chapter
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: '#212121' }}>
          {chapters.map((chapter, index) => {
            const regex = /chapter-(\d+)/;
            const match = chapter.url.match(regex);
            const chapterNumber = match ? match[1] : 'unknown';

            return (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {chapter.title}
                </Typography>
                <Typography variant="body2" style={{ color: '#ddd' }}>
                  Last Updated: {chapter.lastUpdated}
                </Typography>
                <Link
                  to={`/komik/${id}/chapter/${chapterNumber}`}
                  style={{ textDecoration: 'none', color: '#2196f3' }}
                >
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    Baca Chapter
                  </Typography>
                </Link>
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ChapterList;
