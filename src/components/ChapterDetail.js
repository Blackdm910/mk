import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import './css/ChapterDetail.css'; // Mengimpor CSS untuk styling

const ChapterDetail = () => {
  const { id, chapterId } = useParams(); // Mengambil id dan chapterId dari URL
  const navigate = useNavigate(); // Hook untuk navigasi
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterList, setChapterList] = useState([]); // Daftar chapter
  const [anchorEl, setAnchorEl] = useState(null); // Untuk mengatur posisi menu
  const [menuOpen, setMenuOpen] = useState(false); // Status Menu (terbuka atau tertutup)

  // Fungsi untuk navigasi ke chapter sebelumnya dan berikutnya
  const goToPreviousChapter = () => {
    if (chapterId > 1) {
      navigate(`/komik/${id}/chapter/${parseInt(chapterId) - 1}`, {
        replace: true,
      });
    }
  };

  const goToNextChapter = () => {
    navigate(`/komik/${id}/chapter/${parseInt(chapterId) + 1}`, {
      replace: true,
    });
  };

  useEffect(() => {
    console.log('ID:', id); // Log nilai id
    console.log('Chapter ID:', chapterId); // Log nilai chapterId

    if (
      !chapterId ||
      typeof chapterId !== 'string' ||
      chapterId === 'undefined'
    ) {
      setError('Invalid chapter ID');
      setLoading(false);
      return;
    }

    const fetchChapterImages = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        const chapterIdStr = String(chapterId);

        if (!chapterIdStr.trim()) {
          throw new Error('Chapter ID is empty.');
        }

        const response = await fetch(
          `${apiUrl}/api/komik/${id}/chapter/${chapterIdStr}/images`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch images: ${response.status}`);

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchChapterList = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        const response = await fetch(`${apiUrl}/api/komik/${id}/chapters`);
        if (!response.ok)
          throw new Error(`Failed to fetch chapter list: ${response.status}`);

        const data = await response.json();
        setChapterList(data); // Menyimpan daftar chapter
      } catch (err) {
        setError(err.message);
      }
    };

    fetchChapterImages();
    fetchChapterList(); // Mengambil daftar chapter
  }, [id, chapterId]);

  // Cek apakah ada chapter berikutnya
  const hasNextChapter =
    chapterList.length > 0 && chapterId < chapterList.length;

  // Fungsi untuk membuka menu saat tombol menu diklik
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Menyimpan posisi anchor menu
    setMenuOpen(true); // Membuka menu
  };

  // Fungsi untuk menutup menu
  const handleMenuClose = () => {
    setMenuOpen(false); // Menutup menu
  };

  // Fungsi untuk memilih chapter dari menu
  const handleChapterSelect = (url) => {
    window.open(url, '_blank'); // Membuka chapter di tab baru
    handleMenuClose(); // Menutup menu setelah memilih chapter
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="chapter-container">
      <h2 className="chapter-title">Chapter {chapterId}</h2>
      <div className="chapter-images">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Page ${index + 1}`}
              className="chapter-image"
            />
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>

      <div className="chapter-navigation">
        <button onClick={goToPreviousChapter} disabled={chapterId <= 1}>
          Previous Chapter
        </button>

        {/* Tombol Menu untuk membuka Menu */}
        <IconButton onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>

        {/* Menu yang muncul saat tombol diklik */}
        <Menu
          anchorEl={anchorEl} // Posisi anchor menu
          open={menuOpen} // Menentukan apakah menu terbuka
          onClose={handleMenuClose} // Fungsi untuk menutup menu
        >
          {chapterList.length > 0 &&
            chapterList.map((chapter, index) => (
              <MenuItem
                key={index}
                onClick={() => handleChapterSelect(chapter.url)}
              >
                {chapter.title.trim()}
              </MenuItem>
            ))}
        </Menu>

        {/* Tombol Next hanya tampil jika ada chapter selanjutnya */}
        {hasNextChapter && (
          <button onClick={goToNextChapter}>Next Chapter</button>
        )}
      </div>
    </div>
  );
};

export default ChapterDetail;
