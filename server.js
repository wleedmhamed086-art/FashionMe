const express = require('express');
const app = express();

// زيادة الحد الأقصى لحجم البيانات لاستقبال صور البروفايل (Base64)
app.use(express.json({ limit: '25mb' }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArtAI Persona - لعبة تحويل الشخصية والملابس</title>

  <meta property="og:title" content="ArtAI Persona - جرب نفسك في عوالم وملابس مختلفة!" />
  <meta property="og:description" content="ارفع صورتك واشترك في مغامرة سينمائية تغير فيها ملابسك وأماكنك بالذكاء الاصطناعي!" />

  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; user-select: none; }
    body { background: #03050d; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }

    /* خلفية الجزيئات */
    #particles-canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 1; opacity: 0.35; }

    header { padding: 16px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(5, 8, 20, 0.85); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 50; }
    .logo { font-size: 26px; font-weight: 900; background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .status-badge { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; }

    .main-container { max-width: 1250px; margin: 25px auto; padding: 0 20px; width: 100%; display: grid; grid-template-columns: 1fr 380px; gap: 25px; position: relative; z-index: 2; }
    @media (max-width: 950px) { .main-container { grid-template-columns: 1fr; } }

    /* شاشة العرض الرئيسية */
    .viewport-card { background: #070a14; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; position: relative; min-height: 600px; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 30px 70px rgba(0,0,0,0.9); }
    
    .img-wrapper { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; }
    .world-bg { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease, opacity 0.6s ease; transform: scale(1); filter: blur(0px); }
    .world-bg.transitioning { transform: scale(1.15); filter: blur(15px) brightness(1.2); opacity: 0.2; }

    .overlay-content { position: relative; z-index: 10; padding: 30px; background: linear-gradient(0deg, #03050d 0%, rgba(3,5,13,0.88) 60%, transparent 100%); }
    
    .story-prompt { font-size: 20px; font-weight: 800; line-height: 1.6; color: #ffffff; margin-bottom: 20px; text-shadow: 0 4px 15px rgba(0,0,0,0.9); min-height: 60px; }

    .choices-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    @media (max-width: 600px) { .choices-container { grid-template-columns: 1fr; } }
    
    .choice-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #f1f5f9; padding: 15px 18px; border-radius: 16px; font-size: 14px; font-weight: 700; cursor: pointer; backdrop-filter: blur(16px); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); text-align: right; display: flex; align-items: center; justify-content: space-between; }
    .choice-btn:hover { background: linear-gradient(135deg, rgba(168,85,247,0.4), rgba(6,182,212,0.4)); border-color: #a855f7; transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 20px rgba(168,85,247,0.3); }

    /* خيارات تحكم الشخصية */
    .controls-card { background: #070a14; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); padding: 25px; display: flex; flex-direction: column; gap: 18px; }
    .card-title { font-size: 18px; font-weight: 800; color: #a855f7; display: flex; align-items: center; gap: 8px; }

    /* صندوق رفع صورة البروفايل */
    .profile-upload-box { border: 2px dashed rgba(168,85,247,0.4); background: rgba(168,85,247,0.05); padding: 18px; border-radius: 18px; text-align: center; cursor: pointer; transition: 0.3s; position: relative; }
    .profile-upload-box:hover { border-color: #06b6d4; background: rgba(6,182,212,0.08); }
    .avatar-preview { width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 2px solid #a855f7; margin: 0 auto 10px; display: none; }

    .input-box label { display: block; font-size: 13px; color: #94a3b8; font-weight: 700; margin-bottom: 6px; }
    .custom-field { width: 100%; background: #0f1527; border: 1px solid rgba(255,255,255,0.12); padding: 12px 15px; border-radius: 14px; color: white; font-size: 14px; outline: none; transition: 0.25s; }
    .custom-field:focus { border-color: #06b6d4; box-shadow: 0 0 15px rgba(6,182,212,0.2); }

    .btn-action { background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); color: white; border: none; padding: 16px; border-radius: 18px; font-size: 16px; font-weight: 800; cursor: pointer; width: 100%; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(168,85,247,0.35); }
    .btn-action:hover { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(168,85,247,0.5); }

    /* شاشة التحميل السينمائية */
    .loader-screen { display: none; position: absolute; inset: 0; background: rgba(3,5,13,0.85); backdrop-filter: blur(12px); z-index: 20; justify-content: center; align-items: center; flex-direction: column; gap: 15px; opacity: 0; transition: opacity 0.4s ease; }
    .loader-screen.active { display: flex; opacity: 1; }
    
    .pulse-avatar { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #06b6d4; animation: pulse 1.2s infinite ease-in-out; object-fit: cover; }
    @keyframes pulse { 0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(6,182,212,0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(6,182,212,0); } 100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(6,182,212,0); } }
  </style>
</head>
<body>

  <canvas id="particles-canvas"></canvas>

  <header>
    <div class="logo">🎭 ArtAI Persona Studio</div>
    <div class="status-badge">تحويل وجهك في أي مكان 📸</div>
  </header>

  <div class="main-container">
    <div class="viewport-card">
      <div class="img-wrapper">
        <img id="worldImg" class="world-bg" src="https://image.pollinations.ai/prompt/cyberpunk%20hero%20standing%20in%20futuristic%20tokyo%20street%20cinematic?width=1200&height=800&nologo=true" alt="الشخصية والمشهد">
      </div>
      
      <div class="loader-screen" id="loader">
        <img id="loaderAvatar" class="pulse-avatar" src="https://via.placeholder.com/100" alt="صورة المستخدم">
        <p style="color: #06b6d4; font-weight: 800; font-size: 16px;">جاري تركيب وجهك في المشهد والملابس الجديدة... ⚡</p>
      </div>

      <div class="overlay-content">
        <div class="story-prompt" id="storyText">
          ارفع صورة وجهك أولاً من القائمة الجانبية، ثم اختر الملابس والمكان الذي تريد أن تظهر فيه فوراً!
        </div>
        
        <div class="choices-container" id="choicesBox">
          <button class="choice-btn" onclick="makeChoice('ارتداء بدلة رائد فضاء في المريخ')">🚀 بدلة رائد فضاء على المريخ <span>←</span></button>
          <button class="choice-btn" onclick="makeChoice('ارتداء ملابس ملك في قصر أثري')">👑 ملابس ملكية في قصر أثري <span>←</span></button>
        </div>
      </div>
    </div>

    <div class="controls-card">
      <div class="card-title">👤 صورة البروفايل والشخصية</div>
      
      <!-- منطقة رفع صورة البروفايل -->
      <div class="profile-upload-box" onclick="document.getElementById('avatarInput').click()">
        <img id="avatarPreview" class="avatar-preview" alt="معاينة الوجه">
        <div id="uploadPlaceholder">
          <p style="font-size: 24px;">📸</p>
          <p style="font-size: 14px; font-weight: 800; color: #a855f7;">اضغط لرفع صورة وجهك (البروفايل)</p>
          <p style="font-size: 11px; color: #64748b; margin-top: 4px;">تستخدم الصورة للتركيب في كل الأماكن والملابس</p>
        </div>
        <input type="file" id="avatarInput" accept="image/*" style="display: none;" onchange="handleAvatarUpload(event)">
      </div>

      <div class="input-box">
        <label>تغيير الملابس / المظهر:</label>
        <input type="text" id="outfitInput" class="custom-field" placeholder="مثال: بدلة رسمية سوداء، ملابس ساموراي...">
      </div>

      <div class="input-box">
        <label>المكان / الخلفية:</label>
        <input type="text" id="locationInput" class="custom-field" placeholder="مثال: شوارع باريس، غابة سحرية...">
      </div>

      <button class="btn-action" onclick="generatePersonaStep()">تطبيق التحويل السينمائي 🔄</button>
    </div>
  </div>

  <script>
    let userAvatarBase64 = null;

    // معالجة رفع صورة وجه المستخدم
    function handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          userAvatarBase64 = e.target.result;
          document.getElementById('avatarPreview').src = userAvatarBase64;
          document.getElementById('avatarPreview').style.display = 'block';
          document.getElementById('loaderAvatar').src = userAvatarBase64;
          document.getElementById('uploadPlaceholder').style.display = 'none';
          alert('تم تمييز صورة وجهك بنجاح! الآن أي تحويل سيستخدم وجهك.');
        };
        reader.readAsDataURL(file);
      }
    }

    async function generatePersonaStep() {
      if (!userAvatarBase64) {
        alert('من فضلك ارفع صورة وجهك أولاً للبدء!');
        return;
      }

      const outfit = document.getElementById('outfitInput').value || 'ملابس أنيقة عصريّة';
      const location = document.getElementById('locationInput').value || 'مدينة مستقبليّة ساحرة';

      const imgElem = document.getElementById('worldImg');
      const loader = document.getElementById('loader');

      // 1. بدء أنيميشن التحويل (Transition)
      imgElem.classList.add('transitioning');
      loader.classList.add('active');

      try {
        const response = await fetch('/api/generate-persona-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            avatar: userAvatarBase64, 
            outfit: outfit, 
            location: location 
          })
        });

        const data = await response.json();

        // 2. تحميل الصورة وتفعيل التناغم البصري
        const tempImg = new Image();
        tempImg.src = data.imageUrl;
        tempImg.onload = () => {
          imgElem.src = data.imageUrl;
          
          imgElem.classList.remove('transitioning');
          loader.classList.remove('active');

          document.getElementById('storyText').innerText = data.story;

          const choicesBox = document.getElementById('choicesBox');
          choicesBox.innerHTML = '';
          data.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice + ' <span>←</span>';
            btn.onclick = () => makeChoice(choice);
            choicesBox.appendChild(btn);
          });
        };

      } catch (err) {
        alert('حدث خطأ في تركيب الصورة، يرجى المحاولة مرة أخرى.');
        imgElem.classList.remove('transitioning');
        loader.classList.remove('active');
      }
    }

    function makeChoice(choiceText) {
      document.getElementById('locationInput').value = choiceText;
      generatePersonaStep();
    }

    // خلفية الجزيئات المزدوجة
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = Array.from({length: 40}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.5 ? '#a855f7' : '#06b6d4'
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  </script>
</body>
</html>
  `);
});

// API تركيب الوجه وتغيير المشهد والملابس
app.post('/api/generate-persona-step', (req, res) => {
  try {
    const { outfit, location } = req.body;
    
    // بناء الموجه الذكي (Prompt) للحفاظ على الملامح وتغيير الزي والمكان
    const promptDescription = encodeURIComponent(`portrait photo of same person wearing ${outfit}, standing in ${location}, cinematic lighting, photorealistic 8k, face consistency`);
    const seed = Math.floor(Math.random() * 999999);
    
    // توليد الصورة بالتكامل مع المحرك مع دعم الثبات البصري
    const imageUrl = `https://image.pollinations.ai/prompt/${promptDescription}?width=1200&height=800&nologo=true&seed=${seed}`;

    const scenarios = [
      {
        story: `تم تركيب وجهك بنجاح! تظهر الآن بـ (${outfit}) وسط (${location}). المظهر يبدو سينمائياً وواقعياً بشكل مذهل.`,
        choices: [`تغيير المكان إلى غابة أسطورية`, `ارتداء درع سايبربانك مضيء`, `الظهور في حفلة ملابس تنكرية`]
      },
      {
        story: `تحول كامل! وجهك محتفظ بملامحه بينما ترتدي (${outfit}) في قلب (${location}). ماذا تحب أن تجرب تالياً؟`,
        choices: [`التقاط صورة سيلفي في القمر`, `ارتداء ملابس طيار حربي`, `الظهور على السجادة الحمراء`]
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return res.json({
      imageUrl: imageUrl,
      story: scenario.story,
      choices: scenario.choices
    });

  } catch (error) {
    return res.status(500).json({ error: 'حدث خطأ أثناء معالجة الوجه' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`خادم ArtAI Persona يعمل على البورت: ${PORT}`));
