import React from 'react';
import { Paper, Typography, Chip, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FitnessCenter, Height, DirectionsRun, Restaurant, Warning} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const getBmiColor = (bmi) => {
  if (bmi < 18.5) return '#3b82f6'; // Underweight - blue
  if (bmi < 24.9) return '#22c55e'; // Normal - green
  if (bmi < 29.9) return '#eab308'; // Overweight - yellow
  return '#ef4444'; // Obese - red
};

const BmiTimeline = ({ bmiHistory = [] }) => {
  const navigate = useNavigate();

  if (!bmiHistory.length) {
    return (
      <Box mb={12}>
        <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
          BMI History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No BMI history available. Take your first BMI calculation to start tracking!
        </Typography>
      </Box>
    );
  }

  if(bmiHistory.length > 3) {
    // Display only the 3 latest BMI records
    const latestBmi = bmiHistory.slice(0, 3);

    return (
      <Box mb={12}>
        <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
          BMI History
        </Typography>
        <Grid container spacing={3}>
          {latestBmi.map((record, index) => {
            const bmiColor = getBmiColor(record.bmi);
            const isLatest = index === 0;

            return (
              <Grid item xs={12} md={6} key={record.bmi_id}>
                <Paper 
                  elevation={3} 
                  className="p-6"
                  sx={{
                    border: isLatest ? `2px solid ${bmiColor}` : 'none',
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)'
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
        
        <Box mt={4} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/bmiHistory', { state: { allBmiHistory: bmiHistory } })}
            sx={{ 
              backgroundColor: '#2d6a4f',
              '&:hover': {
                backgroundColor: '#1b4332',
              }
            }}
          >
            View All BMI History ({bmiHistory.length})
          </Button>
        </Box>
      </Box>
    );
  }
  
  // Return for when there are 3 or fewer BMI records (show all of them)
  return (
    <Box mb={12}>
      <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
        BMI History
      </Typography>
      <Grid container spacing={3}>
        {bmiHistory.map((record, index) => {
          const bmiColor = getBmiColor(record.bmi);
          const isLatest = index === 0;

          return (
            <Grid item xs={12} md={6} key={record.bmi_id}>
              <Paper 
                elevation={3} 
                className="p-6"
                sx={{
                  border: isLatest ? `2px solid ${bmiColor}` : 'none',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
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
    </Box>
  );
};

export default BmiTimeline; 