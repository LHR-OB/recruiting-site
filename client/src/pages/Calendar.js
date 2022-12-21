import { React, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Calendar() {
  // States
  const [value, onChange] = useState(new Date());

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Calendar
        </Typography>
        <br />
        <ReactCalendar 
          value={value}
          onChange={onChange}
        />
        <Typography variant="h6" mt={2}>
          {value.toDateString()}
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Breakfast" secondary="9:00 AM" />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}
