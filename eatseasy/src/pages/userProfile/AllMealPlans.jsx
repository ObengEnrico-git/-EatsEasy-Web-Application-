import React, { useState } from 'react';
import { Typography, Box, Grid, Card, CardContent, IconButton, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarMonth, ArrowForward, ArrowBack, Close as CloseIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const AllMealPlans = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allPlans } = location.state || {};
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [plans, setPlans] = useState(allPlans || []);

  if (!plans || plans.length === 0) {
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

  const handleViewWeeklyPlan = (plan) => {
    console.log('Viewing plan:', plan);

    if (!plan || !plan.recipes) {
      console.error('Invalid plan data:', plan);
      return;
    }

    // Format recipes into the structure expected by SavedMealPlan
    const formattedRecipes = Object.entries(plan.recipes)
      .map(([day, meals]) => ({
        day,
        meals: Array.isArray(meals) ? meals.sort((a, b) => (a.meal_order || 0) - (b.meal_order || 0)) : []
      }))
      .filter(dayPlan => dayPlan.meals.length > 0);

    console.log('Formatted recipes for navigation:', formattedRecipes);

    navigate('/saved-mealplan', {
      state: {
        savedDate: plan.createdAt,
        recipes: formattedRecipes,
        planId: plan.planId
      }
    });
  };

  const handleDeleteClick = (e, plan) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Prevent card click event
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to delete plan:', planToDelete.planId); // Debug log

      const response = await fetch(`http://localhost:8000/api/recipes/meal-plan/${planToDelete.planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to delete meal plan');
      }

      // Update local state after successful deletion
      setPlans(plans.filter(plan => plan.planId !== planToDelete.planId));
      
      // Close dialog and clear state
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      // You might want to show an error message to the user here
      setDeleteDialogOpen(false); // Close the dialog even on error
    }
  };

  return (
    <div>
      <NavBar />
      <Box className="container mx-auto px-4 py-8" sx={{ pt: 12, pb: 8, maxWidth: 1200, margin: '0 auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ color: '#1b4332', fontWeight: 'bold' }}>
            All Saved Meal Plans
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

        <Grid container spacing={4}>
          {plans.map((plan, index) => {
            if (!plan || !plan.recipes) {
              return null;
            }

            // Calculate total recipes across all days
            const totalRecipes = Object.values(plan.recipes)
              .flat()
              .length;
            
            if (totalRecipes === 0) return null;

            const date = new Date(plan.createdAt);

            return (
              <Grid item xs={12} sm={6} md={4} key={plan.planId}>
                <Card
                  className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  onClick={(e) => {
                    // Only proceed if the click wasn't on a child element that handles its own click
                    if (e.target === e.currentTarget || e.target.classList.contains('MuiCardContent-root') || 
                        e.target.tagName === 'DIV' || e.target.tagName === 'P') {
                      handleViewWeeklyPlan(plan);
                    }
                  }}
                  sx={{ 
                    cursor: 'pointer', 
                    position: 'relative', 
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, plan)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 100, // Increased z-index from 10 to 100
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      width: '32px',
                      height: '32px',
                      transition: 'transform 0.2s, background-color 0.2s',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        backgroundColor: 'rgba(255, 240, 240, 0.95)',
                      }
                    }}
                  >
                    <CloseIcon sx={{ color: '#d32f2f' }} />
                  </IconButton>
                  <CardContent sx={{ p: 3 }} className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarMonth className="text-[#2d6a4f]" fontSize="large" />
                      <Typography variant="h6" className="font-bold">
                        Weekly Meal Plan
                      </Typography>
                    </div>
                    
                    <Typography variant="body1" className="mb-4 text-gray-600">
                      Saved on: {date.toLocaleDateString('en-UK', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className="mb-4">
                      {totalRecipes} {totalRecipes === 1 ? 'recipe' : 'recipes'} saved
                    </Typography>

                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 70%, rgba(255,255,255,0.8) 90%, rgba(255,255,255,1) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    <div className="flex items-center justify-between mt-4">
                      <Chip 
                        label="View Plan" 
                        className="bg-[#2d6a4f] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewWeeklyPlan(plan);
                        }}
                        sx={{ 
                          backgroundColor: '#2d6a4f',
                          color: 'white',
                          '&:hover': { backgroundColor: '#1b4332' }
                        }}
                      />
                      <IconButton>
                        <ArrowForward className="text-[#2d6a4f]" />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          Delete Meal Plan?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this meal plan? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#1b4332' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ 
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#9a0007',
                fontWeight: 'bold'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllMealPlans;