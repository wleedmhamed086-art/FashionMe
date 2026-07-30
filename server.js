const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <!-- كود الإعلانات الخاص بك -->
  <script src="https://pl30602609.effectivecpmnetwork.com/df/38/0e/df380ee9581ff783e61cae26037764b1.js"></script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Stack Mastery - برج التحدي الإدماني</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; user-select: none; }
    body { background: #0b0f19; color: white; text-align: center; overflow: hidden; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }

    #game-container { position: relative; width: 100%; max-width: 440px; height: 100vh; background: linear-gradient(180deg, #0b0f19 0%, #111827 100%); overflow: hidden; box-shadow: 0 0 60px rgba(0,0,0,0.8); }
    
    canvas { display: block; width: 100%; height: 100%; }

    .ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 30px 20px; z-index: 5; }
    
    .score-board { font-size: 56px; font-weight: 900; text-shadow: 0 4px 20px rgba(168,85,247,0.5); background: linear-gradient(135deg, #a855f7, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .high-score { font-size: 15px; color: #94a3b8; font-weight: 700; margin-top: -5px; }

    #start-screen, #game-over-screen { position: absolute; inset: 0; background: rgba(11, 15, 25, 0.92); backdrop-filter: blur(12px); display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto; padding: 25px; z-index: 20; }
    #game-over-screen { display: none; }

    h1 { font-size: 38px; font-weight: 900; background: linear-gradient(135deg, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
    p { color: #94a3b8; font-size: 15px; margin-bottom: 25px; line-height: 1.5; }

    .btn { background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: white; border: none; padding: 16px 45px; border-radius: 20px; font-size: 20px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); transition: transform 0.2s, box-shadow 0.2s; }
    .btn:active { transform: scale(0.95); }

    /* مساحة إعلان حية تلقائية */
    .ad-container { position: absolute; bottom: 10px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 15; pointer-events: auto; }
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
      <p>اضغط في الوقت المناسب لبناء أعلى برج!<br>احرص على تطابق الكتل للحصول على نقاط مضاعفة.</p>
      <button class="btn" onclick="startGame()">ابدأ اللعب 🚀</button>
    </div>

    <div id="game-over-screen">
      <h1 style="color: #ef4444;">خسرت المحاولة! 💥</h1>
      <p id="finalScoreText">النتيجة: 0</p>
      <button class="btn" onclick="startGame()">إعادة المحاولة 🔄</button>
    </div>

    <!-- مساحة الإعلان التلقائية -->
    <div class="ad-container" id="adSlot"></div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    let score = 0;
    let combo = 0;
    let highScore = localStorage.getItem('stack_highscore') || 0;
    document.getElementById('highScoreText').innerText = 'أفضل نتيجة: ' + highScore;

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let blocks = [];
    let particles = [];
    let floatingTexts = [];
    let currentBlock = {};
    let direction = 1;
    let speed = 3.5;
    let isGameOver = false;
    let isPlaying = false;
    let cameraY = 0;
    let targetCameraY = 0;
    let shakeTimer = 0;

    const blockHeight = 35;

    // --- نظام الصوت الديناميكي (Web Audio API) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
      if (!audioCtx) audioCtx = new AudioContext();
    }

    function playNote(freq, type = 'sine', duration = 0.15) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function playGameOverSound() {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {}
    }

    // --- محفز الإعلانات التلقائي ---
    function triggerAutoAd() {
      const adSlot = document.getElementById('adSlot');
      adSlot.innerHTML = ''; // إعادة بناء عنصر الإعلان لتوليد مشاهدات جديدة تلقائياً
      const script = document.createElement('script');
      script.src = 'https://pl30602609.effectivecpmnetwork.com/df/38/0e/df380ee9581ff783e61cae26037764b1.js';
      adSlot.appendChild(script);
    }

    function getHue(index) {
      return (index * 12) % 360;
    }

    function startGame() {
      initAudio();
      triggerAutoAd(); // تشغيل/تحديث الإعلان عند بداية اللعب

      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('game-over-screen').style.display = 'none';
      
      score = 0;
      combo = 0;
      speed = 3.5;
      direction = 1;
      isGameOver = false;
      isPlaying = true;
      cameraY = 0;
      targetCameraY = 0;
      particles = [];
      floatingTexts = [];
      
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

    function createParticles(x, y, width, hue) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: x + Math.random() * width,
          y: y + Math.random() * blockHeight,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 5 + 2,
          alpha: 1,
          hue: hue
        });
      }
    }

    function addFloatingText(text, x, y) {
      floatingTexts.push({
        text: text,
        x: x,
        y: y,
        alpha: 1,
        vy: -1.5
      });
    }

    function placeBlock() {
      if (!isPlaying || isGameOver) return;

      const prev = blocks[blocks.length - 1];
      const diff = currentBlock.x - prev.x;

      if (Math.abs(diff) >= currentBlock.width) {
        gameOver();
        return;
      }

      // حساب التطابق النظيف (Perfect Placement)
      if (Math.abs(diff) < 6) {
        currentBlock.x = prev.x;
        combo++;
        playNote(220 + combo * 40, 'sine', 0.2);
        createParticles(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.hue);
        addFloatingText('PERFECT! 🔥', currentBlock.x + currentBlock.width / 2, currentBlock.y);
      } else {
        combo = 0;
        playNote(220, 'triangle', 0.1);
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

      speed += 0.12;
      direction *= -1;

      if (blocks.length > 5) {
        targetCameraY += blockHeight;
      }

      spawnBlock();
    }

    function gameOver() {
      isGameOver = true;
      isPlaying = false;
      shakeTimer = 15;
      playGameOverSound();
      
      triggerAutoAd(); // إعادة تحديث الإعلانات فور الخسارة لتوليد عوائد تلقائياً

      document.getElementById('finalScoreText').innerText = 'النتيجة النهائية: ' + score;
      document.getElementById('game-over-screen').style.display = 'flex';
    }

    function gameLoop() {
      if (!isPlaying && !isGameOver && particles.length === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cameraY += (targetCameraY - cameraY) * 0.1;

      ctx.save();
      
      // اهتزاز الشاشة (Screen Shake) عند الخسارة
      if (shakeTimer > 0) {
        ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
        shakeTimer--;
      }

      ctx.translate(0, cameraY);

      // رسم الكتل المستقرة
      blocks.forEach((b, index) => {
        ctx.fillStyle = \`hsl(\${b.hue}, 80%, 60%)\`;
        ctx.shadowColor = \`hsl(\${b.hue}, 80%, 40%)\`;
        ctx.shadowBlur = 12;
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
        ctx.shadowBlur = 18;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, blockHeight - 2);
      }

      // تحديث ورسم الجزيئات (Particles)
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        ctx.fillStyle = \`hsla(\${p.hue}, 90%, 70%, \${p.alpha})\`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      // رسم النصوص العائمة (Floating Text)
      floatingTexts.forEach((t, i) => {
        t.y += t.vy;
        t.alpha -= 0.02;
        ctx.fillStyle = \`rgba(255, 255, 255, \${t.alpha})\`;
        ctx.font = 'bold 16px Tajawal';
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
        if (t.alpha <= 0) floatingTexts.splice(i, 1);
      });

      ctx.restore();

      if (isPlaying || particles.length > 0) {
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
