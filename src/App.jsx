import { useEffect, useState } from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load config');
        return response.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading game...</div>;
  if (!config) return <div className="error">Failed to load game configuration</div>;

  return (
    <div className="app-container">
      <Game config={config} />
    </div>
  );
}

export default App;