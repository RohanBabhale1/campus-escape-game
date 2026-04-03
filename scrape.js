const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const htmlTech = await fetch('https://iiitdwd.ac.in/student-life/clubs/tech/');
    console.log('--- Tech Cards ---');
    const cards = htmlTech.match(/<div class="card[^>]*>[\s\S]*?<\/div>/g) || [];
    cards.forEach(card => {
       const imgMatch = card.match(/<img[^>]+src=["']([^"']+)["']/);
       const h3Match = card.match(/<h3[^>]*>(.*?)<\/h3>/);
       if (h3Match) {
         console.log((h3Match[1]).trim() + " -> " + (imgMatch ? imgMatch[1] : 'No image'));
       }
    });

    console.log('--- Cultural Cards ---');
    const htmlCult = await fetch('https://iiitdwd.ac.in/student-life/clubs/cultural/');
    const cultCards = htmlCult.match(/<div class="card[^>]*>[\s\S]*?<\/div>/g) || [];
    cultCards.forEach(card => {
       const imgMatch = card.match(/<img[^>]+src=["']([^"']+)["']/);
       const h3Match = card.match(/<h3[^>]*>(.*?)<\/h3>/);
       if (h3Match) {
         console.log((h3Match[1]).trim() + " -> " + (imgMatch ? imgMatch[1] : 'No image'));
       }
    });
  } catch(e) { console.error(e); }
})();
