import { React, useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
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
  const [userEvents, setUserEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState(new Set());
  const [showMine, setShowMine] = useState(false);

  useEffect(() => {
    if (user) {
      eventsApi.getEventsCurrentUser().then((res) => {
        const newEvents = res.data;
        setUserEvents(newEvents.filter((event, index, self) => (
          index === self.findIndex((e) => (
            e && event && e.id === event.id
          ))
        )));
        switch (user.type) {
          case 'ADMIN':
            interviewsApi.getInterviews().then((res) => {
              if (res.status === 200) {
                newEvents.push(...res.data.map((interview) => (interview.event)));
                // Remove duplicates
                const uniqueEvents = newEvents.filter((event, index, self) => (
                  index === self.findIndex((e) => (
                    e && event && e.id === event.id
                  ))
                ));
                setEvents(uniqueEvents);
              }
            });
            break;
          case 'TEAM_MANAGEMENT':
            interviewsApi.getInterviewsByTeam(user.team.id).then((res) => {
              newEvents.push(...res.data.map((interview) => (interview.event)));
              // Remove duplicates
              const uniqueEvents = newEvents.filter((event, index, self) => (
                index === self.findIndex((e) => (
                  e && event && e.id === event.id
                ))
              ));
              setEvents(uniqueEvents);
            });
            break;
          case 'SYSTEM_LEAD':
            for (let system of user.systems) {
              interviewsApi.getInterviewsBySystem(system.id).then((res) => {
                newEvents.push(...res.data.map((interview) => (interview.event)));
                setEvents((prev) => [...prev, ...newEvents].filter((event, index, self) => (
                  index === self.findIndex((e) => (
                    e && event && e.id === event.id
                  ))
                )));
              });
            }
            break;
          default:
            setEvents(newEvents.filter((event, index, self) => (
              index === self.findIndex((e) => (
                e && event && e.id === event.id
              ))
            )));
            break;
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (events && userEvents) {
      // Mark days with events
      const newHighlightedDays = new Set();
      const eventsToUse = showMine ? userEvents : events;
      eventsToUse.forEach((event) => {
        const eventDate = new Date(new Date(event.start_time).getTime() - (event.offset * 60 * 60 * 1000));
        newHighlightedDays.add(new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).toDateString());
      });
      setHighlightedDays(newHighlightedDays);
      // Sort events
      eventsToUse.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
    }
  }, [events, userEvents, showMine]);

  useEffect(() => {
    const eventsToUse = showMine ? userEvents : events;
    const dayEvents = eventsToUse.filter((event) => {
      const eventDate = new Date(new Date(event.start_time).getTime() - (event.offset * 60 * 60 * 1000));
      return (
        eventDate.getDate() === value.getDate() &&
        eventDate.getMonth() === value.getMonth() &&
        eventDate.getFullYear() === value.getFullYear()
      );
    });
    setDayEvents(dayEvents);
  }, [value, events, userEvents, showMine]);

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
        <Typography variant="body1" mt={2}>
          All times are in Central Time (CT)
        </Typography>
        <br />
        {
          user && user.type !== 'APPLICANT' &&
          <FormControl>
              <FormGroup>
                  <FormControlLabel
                      control={<Switch checked={showMine} onChange={() => setShowMine(!showMine)} />}
                      label="Show Only My Events"
                  />
              </FormGroup>
          </FormControl>
        }
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
        <EventView user={user} event={selectedEvent} setEvent={setSelectedEvent} setSnackbarData={setSnackbarData} />
      </CenterModal>
    </Container>
  );
}
