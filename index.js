const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/lens', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

  const proxy = 'http://brd-customer-USERNAME-zone-YOURZONE:PASSWORD@brd.superproxy.io:22225';

  try {
    const browser = await puppeteer.launch({
      args: [`--proxy-server=${proxy}`],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;

    await page.goto(lensUrl, { waitUntil: 'networkidle2' });

    // الآن تستخرج البيانات من الـ DOM بعد ما الصفحة اتنفذت
    const result = await page.evaluate(() => {
      const title = document.querySelector('.something-class')?.innerText || 'N/A';
      const image = document.querySelector('img.some-class')?.src || 'N/A';
      return { title, image };
    });

    await browser.close();
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Running Puppeteer Lens Proxy on port ${PORT}`);
});
