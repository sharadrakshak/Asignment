import { useEffect, useState, useRef } from 'react';
import '../styles/Game.css';


const Game = ({ config }) => {
  const [found, setFound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [gameActive, setGameActive] = useState(true);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const timerRef = useRef(null); // Add ref for the timer

  // Timer countdown
 useEffect(() => {
    if (!config) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleGameEnd(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [config]); 

  const handleGameEnd = (won) => {
    setGameActive(false);
    const sound = new Audio(won ? '/sounds/win.wav' : '/sounds/lose.wav');
    sound.play();
    
    setTimeout(() => {
      alert(won ? 'You Win! 🎉' : '⏱ Time\'s up! You lost.');
      window.location.reload();
    }, won ? 500 : 2000);
  };

  const handleClick = (e, side) => {
    if (!gameActive) return;

    const imgRef = side === 'left' ? leftImgRef : rightImgRef;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calculate click position relative to original image size
    const scaleX = img.naturalWidth / img.clientWidth;
    console.log(img.naturalWidth)
    const scaleY = img.naturalHeight / img.clientHeight;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check against differences
    let matched = false;
    config.diffRects.forEach(diff => {
      if (diff.side === side &&
          !diff.found &&
          clickX >= diff.x && clickX <= diff.x + diff.width &&
          clickY >= diff.y && clickY <= diff.y + diff.height) {
        
        diff.found = true;
        matched = true;
        setFound(prev => prev + 1);
        highlightDifference(diff, side, img);
        
        new Audio('/sounds/click.wav').play();

        if (found + 1 === config.diffRects.length) {
          handleGameEnd(true);
        }
      }
    });
  };

  const highlightDifference = (diff, side, img) => {
    const scaleX = img.clientWidth / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;
    
    const highlight = document.createElement('div');
    highlight.className = 'highlight';
    highlight.style.left = `${diff.x * scaleX}px`;
    highlight.style.top = `${diff.y * scaleY}px`;
    highlight.style.width = `${diff.width * scaleX}px`;
    highlight.style.height = `${diff.height * scaleY}px`;

    document.getElementById(`overlay-${side}`).appendChild(highlight);
  };


  return (
    <div className="game-container">
      <h1>{config.gameTitle}</h1>
      <div className="game">
        <div className="side">
          <img
            ref={leftImgRef}
            src={config.images.image1}
            alt="Original"
            onClick={(e) => handleClick(e, 'left')}
          />
          <div className="overlay" id="overlay-left"></div>
        </div>
        <div className="side">
          <img
            ref={rightImgRef}
            src={config.images.image2}
            alt="Modified"
            onClick={(e) => handleClick(e, 'right')}
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