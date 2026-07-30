const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<script src="https://pl30602609.effectivecpmnetwork.com/df/38/0e/df380ee9581ff783e61cae26037764b1.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FashionMe - إلباس بدلة فاخرة مع حفظ الوجه</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background: #f4f6f9; margin: 0; padding: 20px; }
    .card { background: white; max-width: 480px; margin: 30px auto; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    .logo { font-size: 32px; font-weight: 800; background: linear-gradient(45deg, #1877f2, #833ab4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 5px; }
    p { color: #606770; font-size: 15px; margin-bottom: 25px; }
    
    .file-input-container { margin-bottom: 20px; }
    input[type="file"] { display: none; }
    .custom-file-upload { display: inline-block; padding: 12px 24px; cursor: pointer; background: #e4e6eb; border-radius: 10px; font-weight: bold; color: #050505; transition: 0.2s; margin-bottom: 10px; }
    .custom-file-upload:hover { background: #d8dadf; }
    #preview-img { max-width: 180px; max-height: 180px; border-radius: 12px; margin: 15px auto; display: none; object-fit: cover; border: 3px solid #1877f2; }

    .btn { background: linear-gradient(45deg, #1877f2, #0056b3); color: white; padding: 15px 30px; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.3s; width: 100%; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3); }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(24, 119, 242, 0.4); }
    .btn:disabled { background: #ccc; cursor: not-allowed; box-shadow: none; }
    
    #overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.88); color: white; justify-content: center; align-items: center; flex-direction: column; z-index: 9999; }
    .spinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #1877f2; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    #result-canvas { max-width: 100%; border-radius: 16px; margin-top: 20px; display: none; box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">FashionMe ✨</div>
    <p>تغيير الملابس لبدلة أنيقة مع الحفاظ التام على ملامح وجهك الاصلي</p>
    
    <div class="file-input-container">
      <label for="imageInput" class="custom-file-upload">
        📁 اختر صورة ملامحها واضحة
      </label>
      <input type="file" id="imageInput" accept="image/*" onchange="handleImageSelect(event)">
      <br>
      <img id="preview-img" src="" alt="المعاينة">
    </div>

    <button id="generateBtn" class="btn" onclick="startProcess()" disabled>تركيب البدلة مع حفظ الوجه 👔</button>
    <canvas id="result-canvas"></canvas>
  </div>

  <div id="overlay">
    <div class="spinner"></div>
    <h2>جاري الحفاظ على ملامح الوجه وتركيب البدلة... ⏳</h2>
    <p>يرجى الانتظار بضع ثوانٍ</p>
  </div>

  <script>
    let userImgElement = new Image();
    let isImageLoaded = false;

    function handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        userImgElement.onload = function() {
          const preview = document.getElementById('preview-img');
          preview.src = e.target.result;
          preview.style.display = 'block';
          isImageLoaded = true;
          document.getElementById('generateBtn').disabled = false;
        };
        userImgElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    async function startProcess() {
      if (!isImageLoaded) return;

      const btn = document.getElementById('generateBtn');
      btn.disabled = true;
      document.getElementById('overlay').style.display = 'flex';

      try {
        // 1. طلب صورة بدلة فاخرة عالية الدقة من السيرفر
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_suit' })
        });
        const data = await response.json();

        if (data.suitUrl) {
          const suitImg = new Image();
          suitImg.crossOrigin = "Anonymous";
          suitImg.onload = function() {
            // 2. دمج ملامح الوجه الأصلي فوق بدلة الذكاء الاصطناعي
            const canvas = document.getElementById('result-canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = suitImg.width;
            canvas.height = suitImg.height;

            // رسم خردة البدلة
            ctx.drawImage(suitImg, 0, 0);

            // دمج الوجه الأصلي بالتركيز على الـ Head Area لحفظ الملامح 100%
            const faceWidth = canvas.width * 0.42;
            const faceHeight = canvas.height * 0.42;
            const faceX = (canvas.width - faceWidth) / 2;
            const faceY = canvas.height * 0.08;

            ctx.save();
            ctx.beginPath();
            ctx.ellipse(
              faceX + faceWidth / 2, 
              faceY + faceHeight / 2, 
              faceWidth / 2, 
              faceHeight / 2, 
              0, 0, 2 * Math.PI
            );
            ctx.clip();
            
            // رسم الوجه الأصلي
            ctx.drawImage(userImgElement, faceX, faceY, faceWidth, faceHeight);
            ctx.restore();

            document.getElementById('overlay').style.display = 'none';
            canvas.style.display = 'block';
            btn.disabled = false;
          };
          suitImg.src = data.suitUrl;
        } else {
          throw new Error('فشل التوليد');
        }
      } catch (err) {
        document.getElementById('overlay').style.display = 'none';
        btn.disabled = false;
        alert('حدث خطأ في المعالجة، حاول مرة أخرى.');
      }
    }
  </script>
</body>
</html>
  `);
});

app.post('/api/generate', async (req, res) => {
  try {
    // توليد خلفية بدلة فاخرة ملائمة متناسقة للوجه
    const suitPrompt = encodeURIComponent("A luxury elegant royal navy blue tuxedo suit with white shirt and black tie, body torso and shoulders, isolated clean studio background, high fashion photography, 8k");
    const seed = Math.floor(Math.random() * 999999);
    const suitUrl = `https://image.pollinations.ai/prompt/${suitPrompt}?width=600&height=750&nologo=true&seed=${seed}`;

    return res.json({ suitUrl });
  } catch (error) {
    return res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`خادم FashionMe يعمل على البورت: ${PORT}`));
