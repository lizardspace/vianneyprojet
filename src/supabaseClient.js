import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define a function to handle real-time updates
const handleRealTimeUpdate = (event, payload) => {
  console.log(`Change in ${event.table}:`, payload);
};

// Enable real-time updates for each table by subscribing to changes
const subscriptions = [];

// Subscribe to changes in the first table
const subscription1 = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'vianney_actions',
    },
    payload => handleRealTimeUpdate('vianney_actions', payload)
  )
  .subscribe();

subscriptions.push(subscription1);

// Subscribe to changes in the second table
const subscription2 = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'vianney_teams',
    },
    payload => handleRealTimeUpdate('vianney_teams', payload)
  )
  .subscribe();

subscriptions.push(subscription2);

// Subscribe to changes in the third table
const subscription3 = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'vianney_alert',
    },
    payload => handleRealTimeUpdate('vianney_alert', payload)
  )
  .subscribe();

subscriptions.push(subscription3);

// You can continue adding subscriptions for each table as needed

// Don't forget to unsubscribe from each subscription when you're done listening for updates
// subscriptions.forEach(subscription => subscription.unsubscribe());

export default supabase;
export { supabase, supabaseUrl };
