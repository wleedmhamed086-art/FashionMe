const express = require('express');
const Replicate = require('replicate');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// زيادة حد حجم البيانات المستلمة لدعم رفع الصور مباشرة
app.use(express.json({ limit: '10mb' }));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<script src="https://pl30602609.effectivecpmnetwork.com/df/38/0e/df380ee9581ff783e61cae26037764b1.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FashionMe - أزياء الذكاء الاصطناعي</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background: #f4f6f9; margin: 0; padding: 20px; }
    .card { background: white; max-width: 480px; margin: 30px auto; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    .logo { font-size: 32px; font-weight: 800; background: linear-gradient(45deg, #1877f2, #833ab4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 5px; }
    p { color: #606770; font-size: 15px; margin-bottom: 25px; }
    
    .file-input-container { margin-bottom: 20px; }
    input[type="file"] { display: none; }
    .custom-file-upload { display: inline-block; padding: 12px 24px; cursor: pointer; background: #e4e6eb; border-radius: 10px; font-weight: bold; color: #050505; transition: 0.2s; margin-bottom: 10px; }
    .custom-file-upload:hover { background: #d8dadf; }
    #preview-img { max-width: 150px; max-height: 150px; border-radius: 50%; margin: 15px auto; display: none; object-fit: cover; border: 3px solid #1877f2; }

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
    <p>اختر صورتك واكتشف مظهرك الفاخر بالذكاء الاصطناعي بنقرة واحدة!</p>
    
    <div class="file-input-container">
      <label for="imageInput" class="custom-file-upload">
        📁 اختر صورة من جهازك
      </label>
      <input type="file" id="imageInput" accept="image/*" onchange="handleImageSelect(event)">
      <br>
      <img id="preview-img" src="" alt="المعاينة">
    </div>

    <button id="generateBtn" class="btn" onclick="startProcess()" disabled>تصميم الإطلالة الفاخرة 🚀</button>
    <img id="result-img" src="" alt="نتيجة FashionMe">
  </div>

  <div id="overlay">
    <div class="spinner"></div>
    <h2>FashionMe يُصمم إطلالتك الآن... ⏳</h2>
    <p>يرجى الانتظار قليلاً أثناء تجهيز الزي الملكي الخاص بك</p>
  </div>

  <script>
    let selectedBase64Image = '';

    function handleImageSelect(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          selectedBase64Image = e.target.result;
          const preview = document.getElementById('preview-img');
          preview.src = selectedBase64Image;
          preview.style.display = 'block';
          document.getElementById('generateBtn').disabled = false;
        };
        reader.readAsDataURL(file);
      }
    }

    function startProcess() {
      if (!selectedBase64Image) return;

      document.getElementById('overlay').style.display = 'flex';
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: selectedBase64Image })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById('overlay').style.display = 'none';
        if (data.resultUrl) {
          const imgElem = document.getElementById('result-img');
          imgElem.src = data.resultUrl;
          imgElem.style.display = 'block';
        } else {
          alert('حدث خطأ أثناء معالجة الصورة، حاول مجدداً.');
        }
      })
      .catch(err => {
        document.getElementById('overlay').style.display = 'none';
        alert('حدث خطأ في الاتصال، حاول مرة أخرى.');
      });
    }
  </script>
</body>
</html>
  `);
});

app.post('/api/generate', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:55883d738653a205d8362d15be07e138328d23f6a3e0562c468f4368c142fc01",
      {
        input: {
          image: imageUrl,
          prompt: "A high fashion portrait, luxury elegant royal clothes, cinematic lighting, 8k resolution, photorealistic",
          negative_prompt: "blurry, low quality, distorted face",
        }
      }
    );
    res.json({ resultUrl: output[0] });
  } catch (error) {
    res.status(500).json({ error: 'فشل التوليد' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`خادم FashionMe يعمل على البورت: ${PORT}`));
