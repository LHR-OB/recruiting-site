import { React, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CenterModal from '../components/CenterModal';
import EventView from '../components/EventView';
import eventsApi from '../api/endpoints/events';

export default function Calendar() {
  // States
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleClickEvent = (selectedEvent) => {
    setOpen(true);
    setSelectedEvent(selectedEvent);
  }

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
              <ListItemButton
                onClick={() => handleClickEvent(event)}
              >
                <ListItemText
                  primary={event.title}
                  // I have no idea why dates are this weird. There's probably a better way but I couldn't figure it out. Basically this applies offset and displays the time in the user's timezone
                  secondary={new Date(new Date(event.start_time).getTime() - (event.offset * 60 * 60 * 1000)).toLocaleTimeString() + " - " + 
                            new Date(new Date(event.end_time).getTime() - (event.offset * 60 * 60 * 1000)).toLocaleTimeString()}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        <EventView event={selectedEvent} />
      </CenterModal>
    </Container>
  );
}
