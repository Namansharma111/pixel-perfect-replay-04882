const fs = require('fs');
const path = require('path');

const profiles = [
  { id: 'letsgotrippin', name: "Let's Go Trippin", url: 'https://www.instagram.com/letsgotrippin1/?hl=en' },
  { id: 'sanjay_rattan', name: 'Sanjay Rattan', url: 'https://www.instagram.com/sanjay_rattan/?hl=en' },
  { id: 'bjp4himachal', name: 'BJP Himachal Pradesh', url: 'https://www.instagram.com/bjp4himachal/?hl=en' },
  { id: 'bjp4haryana', name: 'BJP Haryana', url: 'https://www.instagram.com/bjp4haryana/?hl=en' },
  { id: 'we_pahadi', name: 'We Pahadi', url: 'https://www.instagram.com/we._.pahadi/?hl=en' },
  { id: 'pkke_pahadi', name: 'PKKE Pahadi', url: 'https://www.instagram.com/pkke_pahadi/' },
  { id: 'himalayanroutesmusic', name: 'Himalayan Routes Music', url: 'https://www.instagram.com/himalayanroutesmusic/?hl=en' },
  { id: 'khwaab__lushal', name: 'Khwaab Lushal', url: 'https://www.instagram.com/khwaab__lushal/' }
];

async function check() {
  for (const p of profiles) {
    try {
      const res = await fetch(p.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      const ogMatch = text.match(/property="og:image"\s+content="([^"]+)"/i) || text.match(/content="([^"]+)"\s+property="og:image"/i);
      console.log(p.id, '->', ogMatch ? ogMatch[1].slice(0, 80) : 'No og:image in HTML');
    } catch (e) {
      console.error(p.id, e.message);
    }
  }
}

check();
