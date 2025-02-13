import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const items = [
  {
    icon: <FavoriteRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Save Your Favorites',
    description:
      'Easily favorite recipes to access them anytime and build your personalised cookbook.',
  },
  {
    icon: <HistoryRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Recently Viewed Recipes',
    description:
      'Never lose track of a recipe again. See your recently viewed recipes at a glance.',
  },
  {
    icon: <RestaurantRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Remember Your Preferences',
    description:
      'Get tailored recipe suggestions based on your diet, allergies, and food preferences.',
  },
  {
    icon: <PersonRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Customisable Profiles',
    description:
      'Create a profile that reflects your tastes and culinary goals.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Box
          component="img"
          src="/logo512.png"
          alt="EatsEasy Logo"
          sx={{
            width: 58,
            height: 58,
            alignSelf: 'left',
            marginBottom: 2,
          }}
        />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
