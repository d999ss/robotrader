import React from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SORT_OPTIONS = [
  'Most Relevant',
  'Price: Low to High',
  'Price: High to Low',
  'Rating: High to Low',
  'Year: Newest',
];

const RobotSearch = ({ searchParams, setSearchParams, manufacturers, conditions, types }) => {
  const handleChange = (field) => (event) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, manufacturer, or features"
          value={searchParams.query}
          onChange={handleChange('query')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel>Manufacturer</InputLabel>
          <Select
            value={searchParams.manufacturer}
            onChange={handleChange('manufacturer')}
            label="Manufacturer"
          >
            {manufacturers.map((manufacturer) => (
              <MenuItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel>Condition</InputLabel>
          <Select
            value={searchParams.condition}
            onChange={handleChange('condition')}
            label="Condition"
          >
            {conditions.map((condition) => (
              <MenuItem key={condition} value={condition}>
                {condition}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={searchParams.type}
            onChange={handleChange('type')}
            label="Type"
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={searchParams.sortBy}
            onChange={handleChange('sortBy')}
            label="Sort By"
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default RobotSearch;
