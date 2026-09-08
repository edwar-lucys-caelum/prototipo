const fs = require('fs');

let fileContent = fs.readFileSync('js/cardsData.js', 'utf8');

// Replace all image properties for cri-001 to cri-122
for (let i = 1; i <= 122; i++) {
  const num = String(i).padStart(3, '0');
  const cardId = `cri-${num}`;
  const officialUrl = `https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/CRI/CRI_${num}_R_ES_MD.png`;

  // Match the block for this card ID and replace its image URL
  const regex = new RegExp(`(id:\\s*"${cardId}"[\\s\\S]*?image:\\s*")[^"]+(")`, 'g');
  fileContent = fileContent.replace(regex, `$1${officialUrl}$2`);
}

fs.writeFileSync('js/cardsData.js', fileContent, 'utf8');
console.log('Successfully updated all 122 card image URLs to official full scans!');
