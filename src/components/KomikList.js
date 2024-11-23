import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// Fungsi untuk menghitung kemiripan string menggunakan Levenshtein Distance
// const calculateSimilarity = (str1, str2) => {
// const len1 = str1.length;
// const len2 = str2.length;
// const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

// for (let i = 0; i <= len1; i++) dp[i][0] = i;
// for (let j = 0; j <= len2; j++) dp[0][j] = j;

// for (let i = 1; i <= len1; i++) {
// for (let j = 1; j <= len2; j++) {
// const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
// dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
// }
// }

// const distance = dp[len1][len2];
// const maxLen = Math.max(len1, len2);
// return ((maxLen - distance) / maxLen) * 100; // Return similarity percentage
// };

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // const [filteredKomik, setFilteredKomik] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // State for search suggestions
  const navigate = useNavigate();

  // Ambil data komik dari backend
  const fetchKomik = async (page) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/komik?page=${page}`);
      const data = await response.json();
      setKomikList(data.komikList || []);
      setPagination(data.pagination || []);
    } catch (error) {
      console.error('Error fetching komik data:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Fetch search results
  const fetchSearchResults = async (query) => {
    if (query) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${apiUrl}/api/komik/search/${query}/1`);
        const data = await response.json();
        setSearchResults(data.comics || []); // Set search results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]); // Clear search results if query is empty
    }
  };

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery); // Fetch search results on query change
    } else {
      setSearchResults([]); // Clear search results when query is empty
    }
  }, [searchQuery]);

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search/${searchQuery}`);
    }
  };
const renderKomikCard = (komik) => (
  <Grid
    item
    xs={4} // Grid menjadi 3 kolom per baris
    sm={3} // Untuk layar lebih besar, tampilkan 4 kolom
    md={2} // Untuk layar lebih besar, tampilkan 5 kolom
    key={komik.judul}
    sx={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Card
      sx={{
        maxWidth: 200,
        width: '100%',
        backgroundColor: '#424242', // Background abu-abu
        boxShadow: '0px 4px 10px rgba(255, 255, 255, 0.5)', // Shadow putih
        transition: 'transform 0.2s ease', // Animasi jika ingin menambahkan efek hover
        '&:hover': {
          transform: 'scale(1.05)', // Memperbesar saat hover
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/komik/${komik.judul.replace(/\s+/g, '-').toLowerCase()}/chapters`}
      >
        <CardMedia
          component="img"
          height="200"
          image={komik.thumbnail}
          alt={komik.judul}
          onError={(e) => {
            e.target.src = '/placeholder-thumbnail.png';
          }}
        />
        <CardContent>
          <Typography
            variant="body2"
            component="div"
            align="center"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              color: 'white', // Teks putih
              fontWeight: 500, // Teks sedikit bold
            }}
          >
            {komik.judul}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);
  const renderPagination = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        flexWrap: 'wrap', // Menambahkan wrapping untuk responsivitas
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ marginRight: '10px', marginBottom: '10px' }}
      >
        Previous
      </Button>
      {pagination.map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setCurrentPage(page)}
          style={{ margin: '0 5px', marginBottom: '10px' }}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === pagination[pagination.length - 1]}
        style={{ marginLeft: '10px', marginBottom: '10px' }}
      >
        Next
      </Button>
    </div>
  );

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Input untuk pencarian */}
      <TextField
        label="Cari Komik"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleSearchSubmit}
        style={{
          marginBottom: '20px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block',
          backgroundColor: '#000', // Background kolom pencarian berwarna abu-abu terang
        }}
        InputProps={{
          style: {
            borderColor: '#555', // Border default berwarna puti
            color: 'white',
          },
        }}
        InputLabelProps={{
          style: {
            color: 'white', // Warna label tetap hitam
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff', // Border default berwarna putih
            },
            '&:hover fieldset': {
              borderColor: '#ffffff', // Border tetap putih saat hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2', // Border berubah biru saat focus
            },
          },
        }}
      />

      {/* Search Suggestions */}

      <Box
        sx={{
          maxHeight: '350px', // Menyesuaikan agar muat 4 elemen
          overflowY: 'auto', // Scroll vertikal
          scrollbarWidth: 'thin', // Scrollbar kecil (Firefox)
          '&::-webkit-scrollbar': {
            width: '6px', // Ukuran scrollbar (Chrome/Edge)
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Warna scrollbar
            borderRadius: '10px', // Sudut melengkung scrollbar
          },
        }}
      >
        <List>
          {searchResults.slice(0, 400).map(
            (
              komik // Ambil hanya 4 item pertama
            ) => (
              <ListItem
                button
                component={Link}
                to={`/komik/${komik.title.replace(/\s+/g, '-').toLowerCase()}/chapters`}
                key={komik.title}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px', // Jarak antara thumbnail dan judul
                  padding: '12px', // Padding dalam card
                  marginBottom: '15px', // Jarak antar card
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background transparan
                  borderRadius: '12px', // Sudut melengkung
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Bayangan
                  transition:
                    'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease', // Transisi animasi termasuk fade
                  opacity: 0.9, // Awal opacity
                  '&:hover': {
                    transform: 'scale(1.02)', // Sedikit membesar saat hover
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)', // Bayangan lebih jelas saat hover
                    opacity: 1, // Meningkatkan opacity saat hover
                  },
                }}
              >
                <CardMedia
                  component="img"
                  src={komik.image}
                  alt={komik.title}
                  sx={{
                    width: '50px', // Ukuran thumbnail
                    height: '50px',
                    borderRadius: '8px',
                  }}
                />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'white', // Warna teks putih
                    transition: 'color 0.3s ease', // Transisi untuk perubahan warna teks
                    '&:hover': {
                      color: 'white', // Warna tetap putih saat hover
                    },
                  }}
                >
                  {komik.title}
                </Typography>
              </ListItem>
            )
          )}
        </List>
      </Box>

      {/* Loading Indicator */}
      {isLoading && (
        <div
          style={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </div>
      )}

      {/* Daftar Komik */}
      <Typography variant="h4" align="center" gutterBottom>
        Daftar Komik
      </Typography>
      {!isLoading && (
        <Grid container spacing={2}>
          {komikList.map(renderKomikCard)}
        </Grid>
      )}

      {/* Pagination */}
      {!isLoading && renderPagination()}
    </div>
  );
};

export default KomikList;
