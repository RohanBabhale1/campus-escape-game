const https = require('https');
const fs = require('fs');

https.get('https://iiitdwd.ac.in/academics/faculty/', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    fs.writeFileSync('faculty.html', d);
    console.log('Saved to faculty.html');
  });
}).on('error', e => console.error(e));
