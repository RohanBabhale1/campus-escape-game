const fs = require('fs');
const d = fs.readFileSync('tmp_b.html', 'utf8');
const m = d.match(/<img[^>]*alt=["']([^"']+)["'][^>]*src=["']([^"']+)["']/g) || [];
let out = '';
m.forEach(x => {
  const alt = x.match(/alt=["']([^"']+)["']/)[1];
  const src = x.match(/src=["']([^"']+)["']/)[1];
  if(alt.length > 3) out += alt + ' ===> ' + src + '\n';
});
fs.writeFileSync('imgs2.txt', out, 'utf8');
