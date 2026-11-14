const fs = require('fs');
const html = fs.readFileSync('scratch/ig_dom.html', 'utf8');

const imgTags = html.match(/<img[^>]+>/g) || [];
console.log('Total img tags:', imgTags.length);
imgTags.forEach((img, i) => {
  if (img.includes('profile picture') || img.includes('Profile picture') || img.includes('profile') || img.includes('avatar') || i < 10) {
    console.log(`[${i}]`, img);
  }
});
