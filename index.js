const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');

const app = express();
app.use(bodyParser.json());

app.post('/lens', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

  const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;

  try {
    const html = await rp({
      url: lensUrl,
      proxy: 'http://brd-customer-hl_0e57dbda-zone-serp_vision:fz4vaifq44zo@brd.superproxy.io:33335',
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Lens Proxy API is running on port ${PORT}`);
});
