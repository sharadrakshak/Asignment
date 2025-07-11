import { useEffect, useState } from 'react';
// import './styles/Game.css';

const Game = () => {
  const [config, setConfig] = useState(null);
  const [found, setFound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setConfig(data))
      .catch(error => console.error('Error loading config:', error));
  }, []);

  useEffect(() => {
    if (!config) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const handleGameEnd = (won) => {
    setGameActive(false);
    const sound = new Audio(won ? '/sounds/win.wav' : '/sounds/lose.wav');
    sound.play();
    
    setTimeout(() => {
      alert(won ? 'You Win! 🎉' : '⏱ Time\'s up! You lost.');
      window.location.reload();
    }, won ? 200 : 2000);
  };

  const handleClick = (e, side) => {
    if (!gameActive || !config) return;

    const imgElement = e.target;
    const rect = imgElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const updatedRects = [...config.diffRects];
    let matched = false;

    updatedRects.forEach(diff => {
      if (
        diff.side === side &&
        !diff.found &&
        clickX >= diff.x &&
        clickX <= diff.x + diff.width &&
        clickY >= diff.y &&
        clickY <= diff.y + diff.height
      ) {
        diff.found = true;
        matched = true;
        setFound(prev => prev + 1);
        highlightDifference(diff, side);
        
        const sound = new Audio('/sounds/click.wav');
        sound.play();

        if (found + 1 === config.diffRects.length) {
          handleGameEnd(true);
        }
      }
    });

    if (matched) {
      setConfig(prev => ({ ...prev, diffRects: updatedRects }));
    }
  };

  const highlightDifference = (diff, side) => {
    const highlight = document.createElement('div');
    highlight.className = 'highlight';
    highlight.style.left = `${diff.x}px`;
    highlight.style.top = `${diff.y}px`;
    highlight.style.width = `${diff.width}px`;
    highlight.style.height = `${diff.height}px`;

    const overlay = document.getElementById(`overlay-${side}`);
    overlay.appendChild(highlight);
  };

  if (!config) return <div className="loading">Loading game...</div>;

  return (
    <div className="game-container">
      <h1>{config.gameTitle}</h1>
      <div className="game">
        <div className="side">
          <img
            src={config.images.image1}
            alt="Original"
            onClick={(e) => handleClick(e, 'left')}
            style={{ pointerEvents: gameActive ? 'auto' : 'none' }}
          />
          <div className="overlay" id="overlay-left"></div>
        </div>
        <div className="side">
          <img
            src={config.images.image2}
            alt="Modified"
            onClick={(e) => handleClick(e, 'right')}
            style={{ pointerEvents: gameActive ? 'auto' : 'none' }}
          />
          <div className="overlay" id="overlay-right"></div>
        </div>
      </div>
      <div className="status">
        Found: <span>{found}</span> / <span>{config.diffRects.length}</span>
        <div>Time Left: <span>{timeLeft}</span> seconds</div>
      </div>
    </div>
  );
};

export default Game;