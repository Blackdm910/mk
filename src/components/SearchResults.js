import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; // Pastikan 'useSearchParams' diimpor
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  const { query } = useParams();
  const [searchParams, setSearchParams] = useSearchParams(); // Menggunakan setSearchParams untuk mengubah query params
  const page = parseInt(searchParams.get('page')) || 1;

  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await fetch(
          `${apiUrl}/api/komik/search/${query}/${page}`
        );
        const data = await response.json();
        setSearchResults(data.comics || []);
        setPagination(data.pagination || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const renderKomikCard = (komik) => (
    <Grid
      item
      xs={4} // 3 kolom pada layar kecil
      sm={3} // 4 kolom pada layar lebih besar
      md={2} // 5 kolom pada layar besar
      key={komik.title}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Card style={{ maxWidth: '200px', width: '100%' }}>
        <CardActionArea
          component={Link}
          to={`/komik/${komik.title.replace(/\s+/g, '-').toLowerCase()}/chapters`}
        >
          <CardMedia
            component="img"
            height="200"
            image={komik.image}
            alt={komik.title}
            onError={(e) => {
              e.target.src = '/placeholder-thumbnail.png'; // Gambar placeholder jika gagal
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
              }}
            >
              {komik.title}
            </Typography>
            {komik.rating && (
              <Typography variant="body2" color="textSecondary" align="center">
                Rating: {komik.rating}
              </Typography>
            )}
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
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSearchParams({ page: page - 1 })}
        disabled={page === 1}
        style={{ marginRight: '10px', marginBottom: '10px' }}
      >
        Previous
      </Button>
      {pagination.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSearchParams({ page: pageNumber })}
          style={{ margin: '0 5px', marginBottom: '10px' }}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSearchParams({ page: page + 1 })}
        disabled={page === pagination[pagination.length - 1]}
        style={{ marginLeft: '10px', marginBottom: '10px' }}
      >
        Next
      </Button>
    </div>
  );

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Hasil Pencarian untuk "{query}"
      </Typography>

      {/* Loading Indicator */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </div>
      )}

      {/* Daftar Komik */}
      <Grid container spacing={2}>
        {!isLoading && searchResults.map(renderKomikCard)}
      </Grid>

      {/* Pagination */}
      {!isLoading && renderPagination()}
    </div>
  );
};

export default SearchResults;
