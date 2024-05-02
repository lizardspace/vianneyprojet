import React, { useState } from 'react';

function MeteoAgricole() {
  // Objets de configuration pour chaque ville avec leurs identifiants "town"
  const villes = {
    Lyon: "a401bed218424c069af5121745e2c46f",
    Paris: "b4866aabd0aa02ee10cfc72af8eb195e",
    Bordeaux: "ac5145d76cd82e2fb875e94ba0c5b4b4",
    Marseille: "597c7b407a02cc0a92167e7a371eca25",
    Lille: "43514321536f88cdbe57368daaa688fd",
    Rennes: "66894012670fbc5532ca44f2f87ef848",
    Brest: "3bc412ad4910c19f6710515540190792",
    Nice: "65d2ea03425887a717c435081cfc5dbb",
    Nantes: "c4aee399fbe5893f9bc44fa160ee3107"
  };

  const [ville, setVille] = useState('Lyon'); // Lyon est la valeur par défaut

  // URL de base pour l'iframe
  const baseUrl = "https://www.lameteoagricole.net/la-meteo-agricole-partage-web2.php?town=";
  
  // Génère l'URL complète de l'iframe en utilisant l'identifiant de la ville sélectionnée
  const iframeSrc = `${baseUrl}${villes[ville]}&ville=FR`;

  return (
    <div>
      {/* Menu déroulant pour choisir la ville */}
      <select value={ville} onChange={(e) => setVille(e.target.value)}>
        {Object.keys(villes).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      {/* Iframe pour afficher la météo de la ville sélectionnée */}
      <iframe
        title={`La météo agricole - ${ville}`}
        src={iframeSrc}
        style={{ padding: 0, margin: 0, border: 0, width: '400px', height: '223px' }}
        frameBorder="0"
        scrolling="no"
        marginWidth="0"
        marginHeight="0"
      ></iframe>
    </div>
  );
}

export default MeteoAgricole;