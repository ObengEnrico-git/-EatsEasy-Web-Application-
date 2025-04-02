import React from 'react';
import { Typography, Box, Grid, Paper, Chip, Button } from '@mui/material';
import { ArrowBack, FitnessCenter, Height, DirectionsRun, Restaurant, Warning } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const getBmiColor = (bmi) => {
  if (bmi < 18.5) return '#3b82f6'; // Underweight - blue
  if (bmi < 24.9) return '#22c55e'; // Normal - green
  if (bmi < 29.9) return '#eab308'; // Overweight - yellow
  return '#ef4444'; // Obese - red
};

const AllBmiHistory = () => {
  const location = useLocation();
  const { allBmiHistory } = location.state || {};
  const navigate = useNavigate();
  
  if (!allBmiHistory || allBmiHistory.length === 0) {
    return (
      <div>
        <NavBar />
        <Box className="container mx-auto px-4 py-8 text-center" sx={{ pt: 12 }}>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            No BMI history available
          </Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#1f9b48', '&:hover': { backgroundColor: '#194b34' } }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Box className="container mx-auto px-4 py-8" sx={{ pt: 12, pb: 8, maxWidth: 1200, margin: '0 auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ color: '#1b4332', fontWeight: 'bold' }}>
            Complete BMI History
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ 
              borderColor: '#2d6a4f', 
              color: '#2d6a4f',
              '&:hover': { 
                backgroundColor: 'rgba(45, 106, 79, 0.08)', 
                borderColor: '#1b4332' 
              } 
            }}
          >
            Back to Profile
          </Button>
        </Box>

        <Grid container spacing={3}>
          {allBmiHistory.map((record, index) => {
            const bmiColor = getBmiColor(record.bmi);
            const isLatest = index === 0;

            return (
              <Grid item xs={12} md={6} lg={4} key={record.bmi_id}>
                <Paper 
                  elevation={3} 
                  className="p-6"
                  sx={{
                    border: isLatest ? `2px solid ${bmiColor}` : 'none',
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    borderRadius: '12px',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {isLatest && (
                    <Chip 
                      label="Latest" 
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: bmiColor,
                        color: 'white'
                      }}
                      size="small"
                    />
                  )}

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {new Date(record.created_at).toLocaleDateString('en-UK', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>

                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      color: bmiColor,
                      fontWeight: 'bold',
                      mb: 2 
                    }}
                  >
                    BMI: {record.bmi} - {record.bmi_status}
                  </Typography>

                  <Box className="flex gap-2 flex-wrap mb-3">
                    <Chip 
                      icon={<FitnessCenter />} 
                      label={`${record.weight} ${record.weight_unit}`}
                      size="small"
                    />
                    <Chip 
                      icon={<Height />} 
                      label={`${record.height} ${record.height_unit}`}
                      size="small"
                    />
                    <Chip 
                      icon={<DirectionsRun />} 
                      label={record.activity_level}
                      size="small"
                    />
                  </Box>

                  {record.diet_preferences && record.diet_preferences.length > 0 && (
                    <Box className="mb-3">
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Diet Preferences:
                      </Typography>
                      <Box className="flex gap-1 flex-wrap">
                        {record.diet_preferences.map((diet, i) => (
                          <Chip 
                            key={i}
                            icon={<Restaurant />}
                            label={diet}
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: '#f5f7f5' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {record.intolerances && record.intolerances.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Intolerances:
                      </Typography>
                      <Box className="flex gap-1 flex-wrap">
                        {record.intolerances.map((intolerance, i) => (
                          <Chip 
                            key={i}
                            icon={<Warning />}
                            label={intolerance}
                            size="small"
                            variant="outlined"
                            color="error"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box mt={6} textAlign="center">
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ 
              backgroundColor: '#2d6a4f',
              '&:hover': { backgroundColor: '#1b4332' },
              padding: '10px 20px'
            }}
          >
            Back to Profile
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AllBmiHistory;