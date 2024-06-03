import React from 'react';

function WeatherWidget({ src }) {
  return (
    <div>
      <iframe
        src={src}
        frameBorder="0"
        scrolling="NO"
        allowTransparency="true"
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        style={{ width: '100%', height: '720px' }}
        title="Weather Widget"
      ></iframe>
      <div>
        <a href="https://www.meteoblue.com/fr/meteo/cartes/france_france_3017382?utm_source=weather_widget&utm_medium=linkus&utm_content=map&utm_campaign=Weather%2BWidget"
           target="_blank"
           rel="noopener noreferrer">
          .
        </a>
      </div>
      <div>
      <iframe title="Meteo Windy" width="100%"  height="750px" src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=6&overlay=rain&product=ecmwf&level=surface&lat=45.737&lon=2.769&detailLat=47.19&detailLon=2.637&detail=true&message=true" frameborder="0"></iframe>
      </div>
    </div>
  );
}

export default function MeteoBlue() {
  const iframeSrc = "https://www.meteoblue.com/fr/meteo/cartes/widget/france_france_3017382?windAnimation=0&windAnimation=1&gust=0&gust=1&satellite=0&satellite=1&cloudsAndPrecipitation=0&cloudsAndPrecipitation=1&temperature=0&temperature=1&sunshine=0&sunshine=1&extremeForecastIndex=0&extremeForecastIndex=1&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=5&autowidth=auto";

  return <WeatherWidget src={iframeSrc} />;
}