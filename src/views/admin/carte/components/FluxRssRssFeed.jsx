import React, { useEffect, useState } from 'react';
import { useEvent } from './../../../../EventContext'; // Assurez-vous que le chemin est correct
import { supabase } from './../../../../supabaseClient';
import RSSParser from 'rss-parser';
import {
  Box,
  Heading,
  List,
  ListItem,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';

const FluxRssRssFeed = () => {
  const { selectedEventId } = useEvent();
  const [rssUrl, setRssUrl] = useState('');
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const parser = new RSSParser();

  useEffect(() => {
    if (selectedEventId) {
      const fetchRssUrl = async () => {
        try {
          const { data, error } = await supabase
            .from('vianney_flux_rss')
            .select('url_du_flux_rss')
            .eq('event_id', selectedEventId)
            .single();

          if (error) {
            throw error;
          }

          setRssUrl(data.url_du_flux_rss);
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Impossible de récupérer l\'URL du flux RSS',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchRssUrl();
    }
  }, [selectedEventId, toast]);

  useEffect(() => {
    if (rssUrl) {
      const fetchFeed = async () => {
        try {
          setLoading(true);
          const feed = await parser.parseURL(rssUrl);
          setFeed(feed);
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Impossible de récupérer le flux RSS',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchFeed();
    }
  }, [rssUrl, parser, toast]);

  if (!selectedEventId) {
    return <Text>Pas d'événement sélectionné</Text>;
  }

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="lg">
      <Heading as="h2" size="lg" mb={4}>Flux RSS pour l'événement sélectionné</Heading>
      {feed ? (
        <List spacing={3}>
          {feed.items.map((item) => (
            <ListItem key={item.link}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>Pas de flux RSS disponible</Text>
      )}
    </Box>
  );
};

export default FluxRssRssFeed;
