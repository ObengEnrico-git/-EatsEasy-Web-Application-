import { Box, Typography, Card, CardContent, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"
import { CalendarMonth, ArrowForward, Close as CloseIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const FavoriteMealPlans = ({ mealPlans = [], onHover, hoveredCard, onMealPlanClick, onPlanDeleted }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  console.log('Received mealPlans:', mealPlans);

  // If mealPlans is undefined or null, use empty array
  const plans = mealPlans || [];

  // Sort plans by createdAt date, latest first
  const sortedPlans = [...plans].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDeleteClick = (e, plan) => {
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

      // Close dialog and clear state
      setDeleteDialogOpen(false);
      setPlanToDelete(null);

      // Notify parent component to refresh the list
      if (onPlanDeleted) {
        onPlanDeleted(planToDelete.planId);
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      // You might want to show an error message to the user here
      setDeleteDialogOpen(false); // Close the dialog even on error
    }
  };

  // Only show empty state if we're not rendering any plans
  if (!sortedPlans || sortedPlans.length === 0) {
    return (
      <Box mb={12}>
        <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
          {plans.length > 0 ? 'Saved Weekly Meal Plans' : 'No meal plans saved yet. Save a meal plan to get started!'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No meal plans saved yet.
        </Typography>
      </Box>
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

  return (
    <Box mb={12}>
      <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
        Saved Favourite Meal Plans
      </Typography>
      <br></br>
      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr'
        }}
        gap={4}
      >
        {sortedPlans.map((plan, index) => {
          console.log('Processing plan:', plan);

          if (!plan || !plan.recipes) {
            console.log('Invalid plan, skipping:', plan);
            return null;
          }

          // Calculate total recipes across all days
          const totalRecipes = Object.values(plan.recipes)
            .flat()
            .length;
          
          console.log('Total recipes for plan:', totalRecipes);
          
          if (totalRecipes === 0) return null;

          const date = new Date(plan.createdAt);
          const isLatest = index === 0; // First plan in sorted array is the latest

          return (
            <Card
              key={plan.planId}
              className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              onMouseEnter={() => onHover?.(plan.planId)}
              onMouseLeave={() => onHover?.(null)}
              onClick={() => handleViewWeeklyPlan(plan)}
              sx={{ cursor: 'pointer', position: 'relative' }}
            >
              {isLatest && (
                <Chip
                  label="Latest"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: '#1f9b48',
                    color: 'white',
                    zIndex: 1
                  }}
                />
              )}
              <IconButton
                onClick={(e) => handleDeleteClick(e, plan)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: isLatest ? 80 : 8,
                  zIndex: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  }
                }}
              >
                <CloseIcon sx={{ color: '#d32f2f' }} />
              </IconButton>
              <CardContent className="relative">
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

                <div className="flex items-center justify-between mt-4">
                  <Chip 
                    label="View Plan" 
                    className="bg-[#2d6a4f] text-white"
                    onClick={() => handleViewWeeklyPlan(plan)}
                  />
                  <IconButton
                    className={`transform transition-transform ${hoveredCard === plan.planId ? "translate-x-2" : ""}`}
                  >
                    <ArrowForward className="text-[#2d6a4f]" />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f' , fontWeight: 'bold' }}>
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
    </Box>
  );
};

export default FavoriteMealPlans;