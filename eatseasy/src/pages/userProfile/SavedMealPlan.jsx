import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { MdAccessTime } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { Typography, Box, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";



const SavedMealPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedDate, recipes } = location.state || {};

  console.log('Received state:', location.state);

  if (!savedDate || !recipes) {
    return (
      <div>
        <NavBar />
        <Box className="container mx-auto px-4 py-8 text-center" sx={{ pt: 12 }}>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            No meal plan data available
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

  // Define the correct order of days
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Sort recipes by day order
  const sortedRecipes = [...recipes].sort((a, b) => {
    return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase());
  });

  const getMealTypeName = (mealOrder) => {
    switch (mealOrder) {
      case 0:
        return 'Breakfast';
      case 1:
        return 'Lunch';
      case 2:
        return 'Dinner';
      default:
        return 'Meal';
    }
  };

  return (
    <div>
      <NavBar />
      <Box className="container mx-auto px-4 py-8" sx={{ pt: 12 }}>
        <Box className="flex justify-between items-center mb-8">
          <Typography variant="h4" sx={{ color: '#1b4332', fontWeight: 'bold' }}>
            Saved Weekly Meal Plan
          </Typography>
          <button onClick={() => navigate(-1)} 
          className="bg-white text-black rounded-lg transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-105 
          active:scale-95 w-[40px] h-[40px] hover:w-[110px] overflow-hidden"
          >
            <ArrowBackIcon />
          </button>
          <Typography variant="h6" sx={{ color: '#4a5568' }}>
            Saved on: <b>{new Date(savedDate).toLocaleDateString('en-UK', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</b>
          </Typography>
        </Box>

        {sortedRecipes.map(({ day, meals }) => {
          // Sort meals by meal_order (breakfast -> lunch -> dinner)
          const sortedMeals = [...meals].sort((a, b) => (a.meal_order || 0) - (b.meal_order || 0));
          
          return (
            <Box key={day} mb={6}>
              <Typography variant="h5" sx={{ color: '#1b4332', fontWeight: 'bold', mb: 3 }}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Typography>
              <Grid container spacing={4}>
                {sortedMeals.map((meal, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${day}-${index}`}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={meal.imageUrl}
                        alt={meal.title}
                        sx={{ objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" sx={{ color: '#1b4332', fontWeight: 'bold' }}>
                            {meal.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#4a5568', fontWeight: 'medium' }}>
                            {getMealTypeName(meal.meal_order)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <MdAccessTime style={{ color: '#1f9b48' }} />
                          <Typography variant="body2" sx={{ color: '#4a5568', ml: 1 }}>
                            {meal.readyInMinutes} minutes
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <IoMdPeople style={{ color: '#1f9b48' }} />
                          <Typography variant="body2" sx={{ color: '#4a5568', ml: 1 }}>
                            Serves {meal.servings}
                          </Typography>
                        </Box>
                        <Button 
                          variant="contained" 
                          fullWidth 
                          href={meal.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ backgroundColor: '#1f9b48', '&:hover': { backgroundColor: '#194b34' } }}
                        >
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}

        <Box mt={4} textAlign="center">
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#1f9b48', '&:hover': { backgroundColor: '#194b34' } }}
            onClick={() => navigate(-1)}
          >
            Back to Profile
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SavedMealPlan;