import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from './supabaseClient'; 
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

function EventCard({ event, onSelectEvent }) {
	return (
	  <div onClick={() => onSelectEvent(event)}>
		{/* Render event card details */}
	  </div>
	);
  }
  
  function EventDetails({ event }) {
	return (
	  <div>
		{/* Render event details */}
	  </div>
	);
  }  

  function App() {
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [events, setEvents] = useState([]); // Assuming you fetch event data from Supabase
  
	// Fetch event data from Supabase and set it in the `events` state
	useEffect(() => {
	  async function fetchEvents() {
		const { data, error } = await supabase
		  .from('vianney_event')
		  .select();
  
		if (error) {
		  console.error('Error fetching events:', error);
		  return;
		}
  
		setEvents(data);
	  }
  
	  fetchEvents();
	}, []);
  
	return (
	  <ChakraProvider theme={theme}>
		<ThemeEditorProvider>
		  <HashRouter>
			<Switch>
			  <Route path="/admin">
				<div>
				  {/* Render the list of event cards */}
				  {events.map((event) => (
					<EventCard
					  key={event.id}
					  event={event}
					  onSelectEvent={setSelectedEvent}
					/>
				  ))}
				</div>
  
				{/* Render event details when an event is selected */}
				{selectedEvent && <EventDetails event={selectedEvent} />}
			  </Route>
			  <Redirect from="/" to="/admin" />
			</Switch>
		  </HashRouter>
		</ThemeEditorProvider>
	  </ChakraProvider>
	);
  }
  
  ReactDOM.render(
	<React.StrictMode>
	  <App />
	</React.StrictMode>,
	document.getElementById('root')
  );
  
