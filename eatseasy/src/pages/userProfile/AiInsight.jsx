import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Divider,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SpaIcon from '@mui/icons-material/Spa';

const AiInsight = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/ai-insights/personal-insights', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch insights: ${response.status}`);
        }

        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Add a flag to prevent double fetching
    let isMounted = true;
    if (isMounted) {
      fetchInsights();
    }
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Make sure the dependency array remains empty

  const icons = [
    <TipsAndUpdatesIcon color="primary" fontSize="medium" />,
    <AutoAwesomeIcon color="secondary" fontSize="medium" />,
    <SpaIcon color="success" fontSize="medium" />,
    <LightbulbIcon sx={{ color: '#f59e0b' }} fontSize="medium" />,
    <InfoIcon color="info" fontSize="medium" />
  ];

  if (loading) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #f8fffb 0%, #edfdf2 100%)',
          border: '1px solid #e0e0e0'
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AutoAwesomeIcon 
            sx={{ 
              mr: 1.5, 
              color: '#2d6a4f', 
              fontSize: 28 
            }} 
          />
          <Typography variant="h5" fontWeight="600" color="#1b4332">
            AI Insights
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Analysing your profile with Google's Gemini AI...
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                    <Skeleton variant="text" width="70%" height={28} />
                  </Box>
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="95%" />
                  <Skeleton variant="text" width="85%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #f8fffb 0%, #edfdf2 100%)',
          border: '1px solid #e0e0e0'
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AutoAwesomeIcon 
            sx={{ 
              mr: 1.5, 
              color: '#2d6a4f', 
              fontSize: 28 
            }} 
          />
          <Typography variant="h5" fontWeight="600" color="#1b4332">
            AI Insights
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load AI insights: {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          We're unable to provide personalised insights at the moment. Please try again later or contact support if the issue persists.
        </Typography>
      </Paper>
    );
  }

  // If we have insights but the array is empty
  if (!insights?.insights || insights.insights.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #f8fffb 0%, #edfdf2 100%)',
          border: '1px solid #e0e0e0'
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AutoAwesomeIcon 
            sx={{ 
              mr: 1.5, 
              color: '#2d6a4f', 
              fontSize: 28 
            }} 
          />
          <Typography variant="h5" fontWeight="600" color="#1b4332">
            AI Insights
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Alert severity="info" sx={{ mb: 2 }}>
          No personalised insights available yet.
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Add more data such as BMI information or save some favourite recipes to get personalised nutrition insights.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        background: 'linear-gradient(145deg, #f8fffb 0%, #edfdf2 100%)',
        border: '1px solid #e0e0e0'
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <AutoAwesomeIcon 
            sx={{ 
              mr: 1.5, 
              color: '#2d6a4f', 
              fontSize: 28 
            }} 
          />
          <Typography variant="h5" fontWeight="600" color="#1b4332">
            AI Insights
          </Typography>
        </Box>
        <Tooltip title="Personalised insights based on your profile and preferences">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {insights.insights.map((insight, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                },
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1.5}>
                  {icons[index % icons.length]}
                  <Typography 
                    variant="h6" 
                    fontWeight="600" 
                    ml={1.5}
                    fontSize="1rem"
                    color="#1b4332"
                  >
                    {insight.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.6,
                    opacity: 0.9
                  }}
                >
                  {insight.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Chip 
          label="Powered by Gemini AI"
          size="small"
          icon={<AutoAwesomeIcon fontSize="small" />}
          sx={{ 
            backgroundColor: 'rgba(45, 106, 79, 0.1)',
            color: '#2d6a4f',
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: '#2d6a4f'
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default AiInsight;
