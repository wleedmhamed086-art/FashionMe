const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <!-- كود شبكة الإعلانات الخاص بك -->
  <script src="https://pl30602609.effectivecpmnetwork.com/df/38/0e/df380ee9581ff783e61cae26037764b1.js"></script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Stack Mastery - برج التحدي الإدماني</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; user-select: none; }
    body { background: #0f172a; color: white; text-align: center; overflow: hidden; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }

    #game-container { position: relative; width: 100%; max-width: 420px; height: 100vh; background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%); overflow: hidden; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
    
    canvas { display: block; width: 100%; height: 100%; }

    .ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 30px 20px; }
    
    .score-board { font-size: 48px; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.4); background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .high-score { font-size: 16px; color: #94a3b8; font-weight: 700; margin-top: -5px; }

    #start-screen, #game-over-screen { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto; padding: 20px; z-index: 10; }
    #game-over-screen { display: none; }

    h1 { font-size: 38px; font-weight: 900; background: linear-gradient(135deg, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
    p { color: #94a3b8; font-size: 15px; margin-bottom: 25px; }

    .btn { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; border: none; padding: 16px 40px; border-radius: 20px; font-size: 20px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); transition: transform 0.2s; }
    .btn:active { transform: scale(0.95); }
  </style>
</head>
<body>

  <div id="game-container">
    <canvas id="gameCanvas"></canvas>

    <div class="ui-layer">
      <div>
        <div class="score-board" id="scoreText">0</div>
        <div class="high-score" id="highScoreText">أفضل نتيجة: 0</div>
      </div>
    </div>

    <div id="start-screen">
      <h1>Stack Tower 🏙️</h1>
      <p>اضغط في الوقت المناسب لبناء أعلى برج محتمل!</p>
      <button class="btn" onclick="startGame()">ابدأ اللعب 🚀</button>
    </div>

    <div id="game-over-screen">
      <h1 style="color: #ef4444;">خسرت المحاولة! 💥</h1>
      <p id="finalScoreText">النتيجة: 0</p>
      <button class="btn" onclick="startGame()">إعادة المحاولة 🔄</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    let score = 0;
    let highScore = localStorage.getItem('stack_highscore') || 0;
    document.getElementById('highScoreText').innerText = 'أفضل نتيجة: ' + highScore;

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let blocks = [];
    let currentBlock = {};
    let direction = 1;
    let speed = 3;
    let isGameOver = false;
    let isPlaying = false;
    let cameraY = 0;
    let targetCameraY = 0;

    const blockHeight = 35;

    function getHue(index) {
      return (index * 15) % 360;
    }

    function startGame() {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('game-over-screen').style.display = 'none';
      
      score = 0;
      speed = 3.5;
      direction = 1;
      isGameOver = false;
      isPlaying = true;
      cameraY = 0;
      targetCameraY = 0;
      
      document.getElementById('scoreText').innerText = score;

      const baseWidth = canvas.width * 0.55;
      blocks = [{
        x: (canvas.width - baseWidth) / 2,
        y: canvas.height - 120,
        width: baseWidth,
        hue: 200
      }];

      spawnBlock();
      requestAnimationFrame(gameLoop);
    }

    function spawnBlock() {
      const prev = blocks[blocks.length - 1];
      currentBlock = {
        x: 0,
        y: prev.y - blockHeight,
        width: prev.width,
        hue: getHue(blocks.length)
      };
    }

    function placeBlock() {
      if (!isPlaying || isGameOver) return;

      const prev = blocks[blocks.length - 1];
      const diff = currentBlock.x - prev.x;

      if (Math.abs(diff) >= currentBlock.width) {
        gameOver();
        return;
      }

      if (Math.abs(diff) < 5) {
        currentBlock.x = prev.x; // Perfect placement
      } else {
        if (diff > 0) {
          currentBlock.width -= diff;
        } else {
          currentBlock.width += diff;
          currentBlock.x = prev.x;
        }
      }

      blocks.push({ ...currentBlock });
      score++;
      document.getElementById('scoreText').innerText = score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('stack_highscore', highScore);
        document.getElementById('highScoreText').innerText = 'أفضل نتيجة: ' + highScore;
      }

      speed += 0.15;
      direction *= -1;

      if (blocks.length > 5) {
        targetCameraY += blockHeight;
      }

      spawnBlock();
    }

    function gameOver() {
      isGameOver = true;
      isPlaying = false;
      document.getElementById('finalScoreText').innerText = 'النتيجة الفعالية: ' + score;
      document.getElementById('game-over-screen').style.display = 'flex';
    }

    function gameLoop() {
      if (!isPlaying && !isGameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cameraY += (targetCameraY - cameraY) * 0.1;

      ctx.save();
      ctx.translate(0, cameraY);

      // رسم الكتل المستقرة
      blocks.forEach(b => {
        ctx.fillStyle = \`hsl(\${b.hue}, 80%, 60%)\`;
        ctx.shadowColor = \`hsl(\${b.hue}, 80%, 40%)\`;
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x, b.y, b.width, blockHeight - 2);
      });

      // تحريك الكتلة الحالية
      if (isPlaying) {
        currentBlock.x += speed * direction;
        if (currentBlock.x + currentBlock.width > canvas.width || currentBlock.x < 0) {
          direction *= -1;
        }

        ctx.fillStyle = \`hsl(\${currentBlock.hue}, 85%, 65%)\`;
        ctx.shadowColor = \`hsl(\${currentBlock.hue}, 85%, 45%)\`;
        ctx.shadowBlur = 15;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, blockHeight - 2);
      }

      ctx.restore();

      if (isPlaying) {
        requestAnimationFrame(gameLoop);
      }
    }

    window.addEventListener('pointerdown', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        placeBlock();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        placeBlock();
      }
    });
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`لعبة Stack Tower تعمل على البورت: ${PORT}`));
