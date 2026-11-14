const fs = require('fs');
const html = fs.readFileSync('scratch/ig_dom.html', 'utf8');
console.log('HTML Length:', html.length);
const matches = html.match(/https:\/\/[^"'\s]+(?:cdninstagram|fbcdn)[^"'\s]+/g);
if (matches) {
  console.log('Matches:', matches.length);
  matches.slice(0, 5).forEach(m => console.log(m));
} else {
  console.log('No matches');
  const title = html.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', title ? title[1] : 'none');
}
