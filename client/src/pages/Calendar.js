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
import { interviewsApi } from '../api/endpoints/interviews';

export default function Calendar({ user, setSnackbarData }) {
  // States
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState(new Set());

  useEffect(() => {
    if (user) {
      eventsApi.getEventsCurrentUser().then((res) => {
        const events = res.data;
        if (user.type === 'ADMIN') {
          interviewsApi.getInterviews().then((res) => {
            events.push(...res.data.map((interview) => (interview.event)));
            // Remove duplicates
            const uniqueEvents = events.filter((event, index, self) => (
              index === self.findIndex((e) => (
                e && event && e.id === event.id
              ))
            ));
            setEvents(uniqueEvents);
          });
        } else {
          setEvents(events);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (events) {
      // Mark days with events
      const newHighlightedDays = new Set();
      events.forEach((event) => {
        const eventDate = new Date(event.start_time);
        newHighlightedDays.add(new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).toDateString());
      });
      setHighlightedDays(newHighlightedDays);
      // Sort events
      events.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
    }
  }, [events]);

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
          tileContent={({ date }) => {
            if (highlightedDays.has(new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString())) {
              return (
                <b>
                  {'*'}
                </b>
              );
            }
          }}
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
        <EventView user={user} event={selectedEvent} setSnackbarData={setSnackbarData} />
      </CenterModal>
    </Container>
  );
}
