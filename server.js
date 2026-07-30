const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

// 1. واجهة اللعبة السينمائية الكاملة (Frontend)
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArtAI - لعبة العوالم التوليدية بالذكاء الاصطناعي</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', sans-serif; user-select: none; }
    body { background: #050714; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }

    header { padding: 18px 35px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(10, 15, 30, 0.85); backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 50; }
    .logo { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 10px; }
    .status-badge { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); color: #38bdf8; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; }

    .main-container { max-width: 1250px; margin: 25px auto; padding: 0 20px; width: 100%; display: grid; grid-template-columns: 1fr 360px; gap: 25px; }
    @media (max-width: 950px) { .main-container { grid-template-columns: 1fr; } }

    .viewport-card { background: #0b0f19; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; position: relative; min-height: 560px; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 25px 60px rgba(0,0,0,0.8); }
    .world-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.8s ease-in-out; }
    
    .overlay-content { position: relative; z-index: 10; padding: 35px; background: linear-gradient(0deg, #050714 0%, rgba(5,7,20,0.85) 60%, transparent 100%); }
    .story-prompt { font-size: 22px; font-weight: 800; line-height: 1.6; color: #ffffff; margin-bottom: 22px; text-shadow: 0 4px 15px rgba(0,0,0,0.9); }

    .choices-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 600px) { .choices-container { grid-template-columns: 1fr; } }
    
    .choice-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #f1f5f9; padding: 16px 20px; border-radius: 16px; font-size: 15px; font-weight: 700; cursor: pointer; backdrop-filter: blur(12px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-align: right; display: flex; align-items: center; justify-content: space-between; }
    .choice-btn:hover { background: linear-gradient(135deg, rgba(168,85,247,0.35), rgba(6,182,212,0.35)); border-color: #a855f7; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(168,85,247,0.2); }

    .controls-card { background: #0b0f19; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); padding: 25px; display: flex; flex-direction: column; gap: 20px; }
    .card-title { font-size: 18px; font-weight: 800; color: #a855f7; display: flex; align-items: center; gap: 8px; }

    .input-box label { display: block; font-size: 13px; color: #94a3b8; font-weight: 700; margin-bottom: 8px; }
    .custom-field { width: 100%; background: #141c2e; border: 1px solid rgba(255,255,255,0.12); padding: 14px; border-radius: 14px; color: white; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .custom-field:focus { border-color: #06b6d4; }

    .btn-action { background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); color: white; border: none; padding: 16px; border-radius: 16px; font-size: 17px; font-weight: 800; cursor: pointer; width: 100%; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(168,85,247,0.35); }
    .btn-action:hover { opacity: 0.95; transform: scale(1.02); }

    .loader-screen { display: none; position: absolute; inset: 0; background: rgba(5,7,20,0.88); backdrop-filter: blur(14px); z-index: 20; justify-content: center; align-items: center; flex-direction: column; gap: 18px; }
    .spinner { width: 55px; height: 55px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #a855f7; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>

  <header>
    <div class="logo">✨ ArtAI Engine</div>
    <div class="status-badge">محرك التوليد الفوري: نشط 🟢</div>
  </header>

  <div class="main-container">
    <div class="viewport-card">
      <img id="worldImg" class="world-bg" src="https://image.pollinations.ai/prompt/cyberpunk%20futuristic%20city%20unreal%20engine%208k?width=1200&height=800&nologo=true" alt="العالم التفاعلي">
      
      <div class="loader-screen" id="loader">
        <div class="spinner"></div>
        <p style="color: #a855f7; font-weight: 800; font-size: 16px;">جاري توليد المشهد والقصة بالذكاء الاصطناعي... ⏳</p>
      </div>

      <div class="overlay-content">
        <div class="story-prompt" id="storyText">
          مرحباً بك في عالم ArtAI التفاعلي! اكتب فكرة أي عالم تخيله في ذهنك، وسيقوم الذكاء الاصطناعي بإنشائه وقصته فورياً.
        </div>
        <div class="choices-container" id="choicesBox">
          <button class="choice-btn" onclick="makeChoice('استكشاف المدينة النيون المستقبلية')">🌆 استكشاف المدينة النيون <span>←</span></button>
          <button class="choice-btn" onclick="makeChoice('دخول المختبر المظلم')">🔬 دخول المختبر المظلم <span>←</span></button>
        </div>
      </div>
    </div>

    <div class="controls-card">
      <div class="card-title">🎨 تحكم العوالم والتوليد</div>
      
      <div class="input-box">
        <label>الوصف / العالم الذي تريد بناءه:</label>
        <textarea id="promptInput" class="custom-field" rows="4" placeholder="مثال: غابة سحرية مضيئة في الليل مع مخلوقات أسطورية..."></textarea>
      </div>

      <div class="input-box">
        <label>نمط الجرافيك (Art Style):</label>
        <select id="styleSelect" class="custom-field">
          <option value="Cyberpunk Neon">Cyberpunk / نيون</option>
          <option value="Unreal Engine 5 Render">واقعي 8K / Unreal Engine 5</option>
          <option value="Dark Fantasy Concept Art">فانتزي مظلم / Dark Fantasy</option>
          <option value="Anime Studio Ghibli Style">أنيمي / Anime Art</option>
        </select>
      </div>

      <button class="btn-action" onclick="generateNewStep()">توليد وانطلاق 🚀</button>
    </div>
  </div>

  <script>
    async function generateNewStep() {
      const prompt = document.getElementById('promptInput').value || 'عالم سحري غامض';
      const style = document.getElementById('styleSelect').value;

      showLoader(true);

      try {
        const response = await fetch('/api/generate-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: prompt, style: style })
        });

        const data = await response.json();
        
        // تحديث الصورة مع ضمان التحميل
        const imgElem = document.getElementById('worldImg');
        imgElem.src = data.imageUrl;
        
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

      } catch (err) {
        alert('حدث خطأ في الاتصال بالسيرفر، أعد المحاولة.');
      } finally {
        showLoader(false);
      }
    }

    function makeChoice(choiceText) {
      document.getElementById('promptInput').value = choiceText;
      generateNewStep();
    }

    function showLoader(show) {
      document.getElementById('loader').style.display = show ? 'flex' : 'none';
    }
  </script>
</body>
</html>
  `);
});

// 2. المحرك الخلفي المستقل (Backend API)
app.post('/api/generate-step', (req, res) => {
  try {
    const { action, style } = req.body;
    
    // بناء استعلام الصورة
    const cleanPrompt = encodeURIComponent(`${action}, ${style}, highly detailed, epic cinematic lighting, 8k resolution`);
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1200&height=800&nologo=true&seed=${seed}`;

    // مصفوفة توليد الأحداث والسيناريو التفاعلي تلقائياً
    const scenarios = [
      {
        story: `وصلت الآن إلى "${action}". الجو مشحون بالطاقة الاستثنائية، وبفضل تأثير نمط (${style}) تلاحظ ظهور بوابة رئيسية تتوهج بأحرف قديمة.`,
        choices: ["عبور البوابة المتوهجة", "فحص الأحرف المنقوشة", "استخدام سلاحك للحماية"]
      },
      {
        story: `أثناء تقدمك في "${action}"، تغيرت البيئة المحيطة فجأة! تحولت الأضواء وظهر أمامك كيان يراقب تحركاتك عن كثب.`,
        choices: ["التحدث مع الكيان الغريب", "استكشاف الممر الجانبي", "التراجع واستطلاع المكان"]
      },
      {
        story: `قراراتك قادتك لعمق "${action}". اكتشفت صندوقاً أثرياً يشع بنور أزرق داكن وسط تحف معمارية مذهلة.`,
        choices: ["فتح الصندوق الأثري", "مسح المنطقة بأكملها", "متابعة السير نحو الضوء"]
      }
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return res.json({
      imageUrl: imageUrl,
      story: randomScenario.story,
      choices: randomScenario.choices
    });
  } catch (error) {
    return res.status(500).json({ error: 'حدث خطأ في التوليد' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`خادم ArtAI يعمل بنجاح وكفاءة على البورت: ${PORT}`));
