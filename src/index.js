import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { GPSPositionProvider } from './GPSPositionContext';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { EventProvider } from './EventContext';
import { TeamProvider } from './views/admin/InterfaceEquipe/TeamContext';
import GpsPositionSimplified from './views/admin/InterfaceEquipe/components/GpsPositionSimplified';
import { RealtimeProvider } from './RealtimeContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './views/auth/Login'; // <-- Import the Login component

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <EventProvider>
      <TeamProvider>
        <React.StrictMode>
          <GPSPositionProvider>
            <ThemeEditorProvider>
              <HashRouter>
                <RealtimeProvider>
                  <GpsPositionSimplified />
                  <Switch>
                    <Route path={`/auth/login`} component={Login} /> {/* Login route */}
                    <Route path={`/auth`} component={AuthLayout} />
                    <ProtectedRoute path={`/admin`} component={AdminLayout} /> {/* Protect admin routes */}
                    <Route path={`/rtl`} component={RtlLayout} />
                    <Redirect from='/' to='/auth/login' />
                  </Switch>
                </RealtimeProvider>
              </HashRouter>
            </ThemeEditorProvider>
          </GPSPositionProvider>
        </React.StrictMode>
      </TeamProvider>
    </EventProvider>
  </ChakraProvider>,
  document.getElementById('root')
);
