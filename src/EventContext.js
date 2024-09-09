import { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [selectedEventId, setSelectedEventId] = useState(() => {
    return localStorage.getItem('selectedEventId') || null;
  });

  const [selectedEventName, setSelectedEventName] = useState(() => {
    return localStorage.getItem('selectedEventName') || null;
  });

  const [latitude, setLatitude] = useState(() => {
    return localStorage.getItem('eventLatitude') || null;
  });

  const [longitude, setLongitude] = useState(() => {
    return localStorage.getItem('eventLongitude') || null;
  });

  const setEvent = (eventId, eventName, lat, lng) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);
    setLatitude(lat);
    setLongitude(lng);

    // Save to localStorage
    localStorage.setItem('selectedEventId', eventId);
    localStorage.setItem('selectedEventName', eventName);
    localStorage.setItem('eventLatitude', lat);
    localStorage.setItem('eventLongitude', lng);
  };

  return (
    <EventContext.Provider value={{ selectedEventId, selectedEventName, latitude, longitude, setEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  return useContext(EventContext);
};
