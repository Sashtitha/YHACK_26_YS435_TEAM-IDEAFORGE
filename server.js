require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { runTransform } = require('./lib/pipeline');
const { FORMAT_SPECS } = require('./lib/prompts');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mode: process.env.GEMINI_API_KEY ? 'live' : 'demo',
    formats: Object.entries(FORMAT_SPECS).map(([key, spec]) => ({
      key,
      label: spec.label
    })),
  });
});

// Accepts either:
//   - multipart/form-data with a `file` field (plain text file) and a `payload` field (JSON string)
//   - application/json body: { source, params, formats }
app.post('/api/transform', upload.single('file'), async (req, res) => {
  try {
    let source = '';
    let params = {};
    let formats = [];

    if (req.file) {
      source = req.file.buffer.toString('utf-8');
      const payload = req.body.payload ? JSON.parse(req.body.payload) : {};
      params = payload.params || {};
      formats = payload.formats || [];
    } else {
      source = req.body.source || '';
      params = req.body.params || {};
      formats = req.body.formats || [];
    }

    if (!source || !source.trim()) {
      return res.status(400).json({ ok: false, error: 'No source content provided.' });
    }
    if (!Array.isArray(formats) || formats.length === 0) {
      return res.status(400).json({ ok: false, error: 'Select at least one output format.' });
    }
    const invalid = formats.filter((f) => !FORMAT_SPECS[f]);
    if (invalid.length) {
      return res.status(400).json({ ok: false, error: `Unknown format(s): ${invalid.join(', ')}` });
    }
    if (source.length > 60000) {
      source = source.slice(0, 60000);
    }

    const result = await runTransform({ sourceText: source, params, formats });
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[server] /api/transform failed:', err);
    res.status(500).json({ ok: false, error: 'Transformation failed. Check server logs.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY
  ? 'LIVE (Gemini API)'
  : 'DEMO (no Gemini API key set — using template fallback)';
  console.log(`TransformAI prototype running at http://localhost:${PORT}`);
  console.log(`Mode: ${mode}`);
});
