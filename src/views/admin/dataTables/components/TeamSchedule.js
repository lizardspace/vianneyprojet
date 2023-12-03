import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Example event data
const events = [
  {
    title: 'Team Meeting',
    start: new Date(2023, 11, 5, 10, 0),
    end: new Date(2023, 11, 5, 11, 0),
    user: 'John',
  },
  {
    title: 'Work Shift 1',
    start: new Date(2023, 11, 5, 8, 0),
    end: new Date(2023, 11, 5, 16, 0),
    user: 'John',
  },
  {
    title: 'Work Shift 2',
    start: new Date(2023, 11, 6, 20, 0),
    end: new Date(2023, 11, 7, 4, 0),
    user: 'Alice',
  },
];

const localizer = momentLocalizer(moment);

function TeamSchedule() {
  // Group events by user
  const eventsByUser = events.reduce((acc, event) => {
    if (!acc[event.user]) {
      acc[event.user] = [];
    }
    acc[event.user].push(event);
    return acc;
  }, {});

  const userColumns = Object.entries(eventsByUser).map(([user, userEvents]) => ({
    title: user,
    events: userEvents,
  }));

  return (
    <ChakraProvider>
      <Box p={4}>
        <Calendar
          localizer={localizer}
          events={userColumns}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Box>
    </ChakraProvider>
  );
}

export default TeamSchedule;