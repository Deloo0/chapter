const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// إعداد المجلد للملفات المرفوعة
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.static(path.join(__dirname, '../web-app')));

// ============================================
// Multer Configuration
// ============================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('صيغة الملف غير مدعومة'));
        }
    }
});

// ============================================
// Routes
// ============================================

// صفحة رئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-app/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        message: '✅ Chapter Server is running!',
        timestamp: new Date().toISOString()
    });
});

// اختبار API Key
app.post('/api/test-api-key', async (req, res) => {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ success: false, message: 'API Key مطلوب' });
        }

        const response = await axios.get('https://huggingface.co/api/user', {
            headers: { Authorization: `Bearer ${apiKey}` }
        });

        res.json({
            success: true,
            message: '✅ API Key صحيح',
            user: response.data.fullname
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: '❌ API Key غير صحيح'
        });
    }
});

// تحسين الصور (Upscaling)
app.post('/api/enhance-image', upload.single('image'), async (req, res) => {
    try {
        const { apiKey, scale } = req.body;

        if (!apiKey) {
            return res.status(400).json({ success: false, message: 'API Key مطلوب' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'الصورة مطلوبة' });
        }

        console.log('⏳ جاري تحسين الصورة...');

        // قراءة الصورة كـ base64
        const imageBuffer = fs.readFileSync(req.file.path);

        // استدعاء Real-ESRGAN API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/nightmareai/real-esrgan',
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/octet-stream'
                }
            }
        );

        // حفظ الصورة المحسنة
        const enhancedFileName = `enhanced-${Date.now()}.png`;
        const enhancedPath = path.join(uploadsDir, enhancedFileName);
        
        if (response.data instanceof Buffer) {
            fs.writeFileSync(enhancedPath, response.data);
        } else {
            fs.writeFileSync(enhancedPath, Buffer.from(response.data));
        }

        // حذف الصورة الأصلية
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: '✨ تم تحسين الصورة بنجاح',
            image: `/uploads/${enhancedFileName}`
        });
    } catch (error) {
        console.error('❌ خطأ:', error.message);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في تحسين الصورة: ' + error.message
        });
    }
});

// توليد الصور من النصوص
app.post('/api/generate-image', async (req, res) => {
    try {
        const { apiKey, prompt, style, size } = req.body;

        if (!apiKey || !prompt) {
            return res.status(400).json({ 
                success: false, 
                message: 'API Key والـ Prompt مطلوبان' 
            });
        }

        console.log('⏳ جاري توليد الصورة...');

        // بناء Prompt احترافي
        const styleModifiers = {
            realistic: 'pristine, ultra-high-definition, photo-realistic, cinematic, professional photography, studio lighting',
            artistic: 'artistic, painted, oil painting, watercolor, illustration, creative, vibrant colors',
            cinematic: '4K cinematic, Hollywood style, dramatic lighting, film noir, professional cinematography',
            illustration: 'digital illustration, anime, cartoon style, comic art, stylized, vibrant',
            '3d': '3D rendered, CGI, premium quality, Pixar style, unreal engine'
        };

        const modifier = styleModifiers[style] || styleModifiers.realistic;
        const enhancedPrompt = `${prompt}, ${modifier}, masterpiece, award-winning, professional`;

        // استدعاء Stable Diffusion API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            { inputs: enhancedPrompt },
            {
                headers: { Authorization: `Bearer ${apiKey}` }
            }
        );

        // حفظ الصورة المولدة
        const generatedFileName = `generated-${Date.now()}.png`;
        const generatedPath = path.join(uploadsDir, generatedFileName);

        if (response.data instanceof Buffer) {
            fs.writeFileSync(generatedPath, response.data);
        } else {
            fs.writeFileSync(generatedPath, Buffer.from(response.data));
        }

        res.json({
            success: true,
            message: '🎨 تم توليد الصورة بنجاح',
            image: `/uploads/${generatedFileName}`,
            prompt: enhancedPrompt
        });
    } catch (error) {
        console.error('❌ خطأ:', error.message);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في توليد الصورة: ' + error.message
        });
    }
});

// الملفات المرفوعة
app.use('/uploads', express.static(uploadsDir));

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err.message);
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في السيرفر: ' + err.message
    });
});

// ============================================
// Server Start
// ============================================

app.listen(PORT, () => {
    const localIP = getLocalIP();
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║          🚀 Chapter Server is Running! 🚀              ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║ Local:  http://localhost:${PORT}`);
    console.log(`║ Network: http://${localIP}:${PORT}`);
    console.log('║                                                        ║');
    console.log('║ استخدم أحد الروابط أعلاه في Chrome لفتح الأداة         ║');
    console.log('║                                                        ║');
    console.log('║ اضغط Ctrl + C لإيقاف السيرفر                          ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\n');
});

// ============================================
// Utility Functions
// ============================================

function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// ============================================
// Graceful Shutdown
// ============================================

process.on('SIGINT', () => {
    console.log('\n\n👋 جاري إيقاف السيرفر...');
    process.exit(0);
});

module.exports = app;
