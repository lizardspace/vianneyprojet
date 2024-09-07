// src/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useEvent } from './EventContext'; // Import EventContext to use event data

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); 
  const { selectedEventId, selectedEventName } = useEvent(); // Access eventId and eventName

  console.log("Selected Event:", selectedEventId, selectedEventName); // Debugging

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
