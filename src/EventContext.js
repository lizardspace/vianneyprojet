// src/EventContext.js
import { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [selectedEventId, setSelectedEventId] = useState(() => {
    // Read the initial value from localStorage
    return localStorage.getItem('selectedEventId') || null;
  });

  const [selectedEventName, setSelectedEventName] = useState(() => {
    // Read the initial value from localStorage
    return localStorage.getItem('selectedEventName') || null;
  });

  const setEventId = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);

    // Save to localStorage
    localStorage.setItem('selectedEventId', eventId);
    localStorage.setItem('selectedEventName', eventName);
  };

  return (
    <EventContext.Provider value={{ selectedEventId, selectedEventName, setEventId }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  return useContext(EventContext);
};
