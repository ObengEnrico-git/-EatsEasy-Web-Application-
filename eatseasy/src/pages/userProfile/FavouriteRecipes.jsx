import { useState } from "react"
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"
import { Favorite, ArrowForward, Close as CloseIcon, AccessTime, People } from "@mui/icons-material"

const FavoriteRecipes = ({ recipes, onHover, hoveredCard, onRecipeClick }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState(null)

  if (!recipes || recipes.length === 0) {
    return (
      <Box mb={12}>
        <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
          Favourite Recipes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No favourite recipes yet.
        </Typography>
      </Box>
    )
  }

  const handleDeleteClick = (e, recipe) => {
    e.stopPropagation() // Prevent card click event
    setRecipeToDelete(recipe)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:8000/api/recipes/favourite/${recipeToDelete.favouriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete favourite recipe')
      }

      // Close dialog and clear state
      setDeleteDialogOpen(false)
      setRecipeToDelete(null)

      // Reload the page to refresh the list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting favourite recipe:', error)
      setDeleteDialogOpen(false) // Close the dialog even on error
    }
  }

  return (
    <Box mb={12}>
      <Typography variant="h4" className="mb-8 text-[#1b4332] font-bold">
        Favourite Recipes
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr'
        }}
        gap={4}
      >
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            onMouseEnter={() => onHover(recipe.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => window.open(recipe.sourceUrl, '_blank')}
            sx={{ cursor: 'pointer', position: 'relative' }}
          >
            <IconButton
              onClick={(e) => handleDeleteClick(e, recipe)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                }
              }}
            >
              <CloseIcon sx={{ color: '#d32f2f' }} />
            </IconButton>
            <CardMedia
              component="img"
              height="200"
              image={recipe.image}
              alt={recipe.title}
              className="h-48 object-cover"
            />
            <CardContent className="relative">
              <Typography variant="h6" className="font-bold mb-2 line-clamp-2">
                {recipe.title}
              </Typography>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <AccessTime fontSize="small" className="text-[#2d6a4f]" />
                  <Typography variant="body2">{recipe.readyInMinutes} mins</Typography>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <People fontSize="small" className="text-[#2d6a4f]" />
                  <Typography variant="body2">Serves {recipe.servings}</Typography>
                </div>
              </div>

              <Typography variant="body2" color="text.secondary" className="mb-4">
                Saved on: {new Date(recipe.favouritedAt).toLocaleDateString('en-UK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Favorite className="text-[#d32f2f]" />
                </div>
                <IconButton
                  className={`transform transition-transform ${hoveredCard === recipe.id ? "translate-x-2" : ""}`}
                >
                  <ArrowForward className="text-[#2d6a4f]" />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Favourite Recipe</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{recipeToDelete?.title}" from your favourites?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FavoriteRecipes