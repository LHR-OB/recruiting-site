import { React, useState, useEffect } from 'react';
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
import eventsApi from '../api/endpoints/events';

export default function Calendar() {
  // States
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    eventsApi.getEventsCurrentUser().then((res) => {
      setEvents(res.data);
    });
  }, []);

  useEffect(() => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === value.getDate() &&
        eventDate.getMonth() === value.getMonth() &&
        eventDate.getFullYear() === value.getFullYear()
      );
    });
    setDayEvents(dayEvents);
  }, [value, events]);

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
          {dayEvents.map((event, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={event.title}
                secondary={new Date(event.start_time).toLocaleTimeString() + ' - ' + new Date(event.end_time).toLocaleTimeString()}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
