// src/App.tsx
import React from 'react';
import { MantineProvider } from '@mantine/core';
import FormBuilder from './components/FormBuilder.tsx';
import FormSubmit from './components/FormSubmit.tsx';

const App: React.FC = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div>
        <FormBuilder />
        <FormSubmit />
      </div>
    </MantineProvider>
  );
};

export default App;
