const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const profiles = [
  { id: 'sanjay_rattan', name: 'Sanjay Rattan', url: 'https://www.instagram.com/sanjay_rattan/?hl=en' },
  { id: 'bjp4himachal', name: 'BJP Himachal Pradesh', url: 'https://www.instagram.com/bjp4himachal/?hl=en' },
  { id: 'bjp4haryana', name: 'BJP Haryana', url: 'https://www.instagram.com/bjp4haryana/?hl=en' },
  { id: 'we_pahadi', name: 'We Pahadi', url: 'https://www.instagram.com/we._.pahadi/?hl=en' },
  { id: 'pkke_pahadi', name: 'PKKE Pahadi', url: 'https://www.instagram.com/pkke_pahadi/' },
  { id: 'himalayanroutesmusic', name: 'Himalayan Routes Music', url: 'https://www.instagram.com/himalayanroutesmusic/?hl=en' },
  { id: 'khwaab__lushal', name: 'Khwaab Lushal', url: 'https://www.instagram.com/khwaab__lushal/' }
];

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = path.join(__dirname, '..', 'public', 'images', 'portfolio', 'social');

async function processProfiles() {
  for (const p of profiles) {
    const outFile = path.join(outputDir, `${p.id}.jpg`);
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
      console.log(`[SKIP] Already exists: ${p.id}`);
      continue;
    }

    console.log(`[FETCHING] ${p.name} (${p.url})...`);
    try {
      const tempDomFile = path.join(__dirname, `temp_${p.id}.html`);
      const cmd = `"${chromePath}" --headless=new --dump-dom --virtual-time-budget=6000 "${p.url}" > "${tempDomFile}"`;
      execSync(cmd, { stdio: 'pipe', timeout: 30000 });

      if (fs.existsSync(tempDomFile)) {
        const dom = fs.readFileSync(tempDomFile, 'utf8');
        fs.unlinkSync(tempDomFile);

        // Look for profile picture img tag
        const match = dom.match(/<img[^>]+alt="[^"]*profile picture"[^>]+src="([^"]+)"/i) ||
                      dom.match(/<img[^>]+src="([^"]+)"[^>]+alt="[^"]*profile picture"/i) ||
                      dom.match(/https:\/\/[^"'\s]+cdninstagram\.com\/v\/t51\.2885-19\/[^"'\s]+/i);

        if (match) {
          const rawUrl = match[1] || match[0];
          const imgUrl = rawUrl.replace(/&amp;/g, '&');
          console.log(`Found image URL for ${p.id}: ${imgUrl.slice(0, 70)}...`);

          const res = await fetch(imgUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            }
          });

          if (res.ok) {
            const buf = await res.arrayBuffer();
            fs.writeFileSync(outFile, Buffer.from(buf));
            console.log(`[SUCCESS] Saved ${p.id}.jpg (${buf.byteLength} bytes)`);
            continue;
          } else {
            console.log(`[HTTP ERROR] ${res.status} for ${p.id}`);
          }
        } else {
          console.log(`[WARN] No profile picture tag found in DOM for ${p.id}`);
        }
      }
    } catch (err) {
      console.error(`[ERROR] Failed for ${p.id}:`, err.message);
    }
  }
}

processProfiles().then(() => console.log('Done profiles fetch!'));
