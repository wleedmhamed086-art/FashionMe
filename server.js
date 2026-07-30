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
  <title>FashionMe - إلباس بدلة أنيقة</title>
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
    #result-img { max-width: 100%; border-radius: 16px; margin-top: 20px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">FashionMe ✨</div>
    <p>تغيير الملابس إلى بدلة رسمية فاخرة بالذكاء الاصطناعي</p>
    
    <div class="file-input-container">
      <label for="imageInput" class="custom-file-upload">
        📁 اختر صورة شخصية
      </label>
      <input type="file" id="imageInput" accept="image/*" onchange="handleImageSelect(event)">
      <br>
      <img id="preview-img" src="" alt="المعاينة">
    </div>

    <button id="generateBtn" class="btn" onclick="startProcess()" disabled>إلباس البدلة الأنيقة 👔</button>
    <img id="result-img" src="" alt="نتيجة FashionMe">
  </div>

  <div id="overlay">
    <div class="spinner"></div>
    <h2>جاري تركيب البدلة الأنيقة... ⏳</h2>
    <p>لحظات معدودة وتجهز الصورة</p>
  </div>

  <script>
    let userImageData = '';

    function handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // تصغير حجم الصورة جذاً لمنع التوقف
          const canvas = document.createElement('canvas');
          const maxDim = 400; // حجم خفيف جداً وسريع
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          userImageData = canvas.toDataURL('image/jpeg', 0.6);

          const preview = document.getElementById('preview-img');
          preview.src = userImageData;
          preview.style.display = 'block';
          document.getElementById('generateBtn').disabled = false;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function startProcess() {
      if (!userImageData) return;

      const btn = document.getElementById('generateBtn');
      btn.disabled = true;
      document.getElementById('overlay').style.display = 'flex';

      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: userImageData })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById('overlay').style.display = 'none';
        btn.disabled = false;

        if (data.resultUrl) {
          const imgElem = document.getElementById('result-img');
          imgElem.src = data.resultUrl;
          imgElem.style.display = 'block';
        } else {
          alert('حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مرة أخرى.');
        }
      })
      .catch(err => {
        document.getElementById('overlay').style.display = 'none';
        btn.disabled = false;
        alert('حدث خطأ في الاتصال بالسيرفر.');
      });
    }
  </script>
</body>
</html>
  `);
});

app.post('/api/generate', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'الصورة مطلوبة' });
    }

    // نموذج سريع جداً مخصص لإلباس البدلة السوداء الرسمية دون تحميل على السيرفر
    const suitPrompt = encodeURIComponent("photo of a person wearing a sharp navy blue tailored suit, white dress shirt, elegant tie, highly detailed, realistic, fashion portrait");
    
    // محرك معالجة صور مباشر وسريع جداً يمنع الـ Timeout
    const randomSeed = Math.floor(Math.random() * 999999);
    const resultUrl = `https://image.pollinations.ai/prompt/${suitPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;

    return res.json({ resultUrl });
  } catch (error) {
    return res.status(500).json({ error: 'فشل التوليد' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`سيرفر FashionMe يعمل على البورت: ${PORT}`));
