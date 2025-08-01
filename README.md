A React-based "Spot the Difference" game where players find differences between two similar images before time runs out.


🎮 How to Play
Examine both images side by side

Click on differences you find in either image

Find all differences before time runs out to win!

Correct clicks will highlight the difference in green

Game ends when either:

All differences are found (win)

Time reaches zero (lose)

📁 JSON Configuration
{
  "gameTitle": "Spot the Difference - Animals",
  "images": {
    "image1": "/images/left.jpg",
    "image2": "/images/right.jpg"
  },
  "diffRects": [
    { "x": 170, "y": 232, "width": 30, "height": 30, "side": "right" },
    { "x": 230, "y": 178, "width": 40, "height": 40, "side": "left" }
  ]
}

JSON Structure Explained:
gameTitle: Displayed at the top of the game

images: Paths to the two images to compare

image1: Left/Original image

image2: Right/Modified image

diffRects: Array of difference locations

x: X coordinate (pixels from left)

y: Y coordinate (pixels from top)

width: Width of difference area

height: Height of difference area

side: Which image contains the difference ("left" or "right")