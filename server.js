const express = require('express');
const Replicate = require('replicate');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "1544889360299503";

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
    .btn { background: linear-gradient(45deg, #1877f2, #0056b3); color: white; padding: 15px 30px; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.3s; width: 100%; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3); }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(24, 119, 242, 0.4); }
    .btn-share { background: linear-gradient(45deg, #42b72a, #2b8a1a); box-shadow: 0 4px 12px rgba(66, 183, 42, 0.3); }
    #overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.88); color: white; justify-content: center; align-items: center; flex-direction: column; z-index: 9999; }
    .spinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #1877f2; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    #result-img { max-width: 100%; border-radius: 16px; margin-top: 20px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">FashionMe ✨</div>
    <p>اكتشف مظهرك الفاخر والأنيق بالذكاء الاصطناعي بنقرة واحدة!</p>
    <button class="btn" onclick="startProcess()">جرب إطلالتك مع FashionMe 🚀</button>
    <img id="result-img" src="" alt="نتيجة FashionMe">
    <button id="share-btn" class="btn btn-share" style="display:none; margin-top: 15px;" onclick="shareOnFacebook()">انشر إطلالتك الفاخرة على فيسبوك 📢</button>
  </div>

  <div id="overlay">
    <div class="spinner"></div>
    <h2>FashionMe يُصمم إطلالتك الآن... ⏳</h2>
    <p>يرجى الانتظار قليلاً أثناء تجهيز الزي الملكي الخاص بك</p>
  </div>

  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '${FACEBOOK_APP_ID}',
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    let generatedImageUrl = '';

    function startProcess() {
      FB.login(function(response) {
        if (response.authResponse) {
          FB.api('/me/picture?redirect=false&width=500&height=500', function(picResponse) {
            processImage(picResponse.data.url);
          });
        }
      }, {scope: 'public_profile'});
    }

    function processImage(imageUrl) {
      document.getElementById('overlay').style.display = 'flex';
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageUrl })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById('overlay').style.display = 'none';
        if (data.resultUrl) {
          generatedImageUrl = data.resultUrl;
          const imgElem = document.getElementById('result-img');
          imgElem.src = generatedImageUrl;
          imgElem.style.display = 'block';
          document.getElementById('share-btn').style.display = 'block';
        } else {
          alert('حدث خطأ أثناء معالجة الصورة، حاول مجدداً.');
        }
      });
    }

    function shareOnFacebook() {
      FB.ui({
        method: 'share',
        href: generatedImageUrl,
        hashtag: '#FashionMe',
        quote: 'شاهد إطلالتي الملكية الجديدة عبر تطبيق FashionMe! جربها الآن بنفسك.',
      }, function(response){});
    }
  </script>
  <script async defer crossorigin="anonymous" src="https://connect.facebook.net/ar_AR/sdk.js"></script>
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
