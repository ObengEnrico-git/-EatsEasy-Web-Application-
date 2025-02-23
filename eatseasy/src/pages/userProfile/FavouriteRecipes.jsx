import { Box, Typography, Card, CardMedia, CardContent, IconButton, Chip } from "@mui/material"
import { Favorite, ArrowForward } from "@mui/icons-material"

const FavoriteRecipes = ({ recipes, onHover, hoveredCard, onRecipeClick }) => {
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
            onClick={() => onRecipeClick(recipe.id)}
            sx={{ cursor: 'pointer' }}
          >
            <CardMedia
              component="img"
              height="200"
              image={recipe.image}
              alt={recipe.title}
              className="h-48 object-cover"
            />
            <CardContent className="relative">
              <Typography variant="h6" className="font-bold mb-2">
                {recipe.title}
              </Typography>
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" className="bg-[#2d6a4f] text-white" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Favorite className="text-[#2d6a4f]" />
                  <Typography variant="body2">{recipe.likes}</Typography>
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
    </Box>
  )
}

export default FavoriteRecipes