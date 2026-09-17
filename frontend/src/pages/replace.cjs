const fs = require('fs');
const path = require('path');

const filePaths = [
  'd:/SLIIT/SLIIT Y4 S2/MPM/MuseumSmartGuide_WEB/frontend/src/pages/Dashboard.jsx'
];

const emojiMap = {
  '🏛️': '<MdOutlineAccountBalance className="inline-block" />',
  '"🏛️"': '<MdOutlineAccountBalance size={22} />',
  '🖼️': '<MdOutlineCollections className="inline-block" />',
  '"🖼️"': '<MdOutlineCollections size={22} />',
  '🗿': '<MdExplore className="inline-block" />',
  '"🗿"': '<MdExplore size={22} />',
  '"📱"': '<MdOutlineQrCodeScanner size={22} />',
  '📱': '<MdOutlineQrCodeScanner className="inline-block" />',
  '"👤"': '<MdPerson size={22} />',
  '"🛡️"': '<MdAdminPanelSettings size={22} />',
  '📊': '<MdBarChart className="inline-block" />',
  '📁': '<MdUpload className="inline-block" />',
  '🧠': '<MdPsychology className="inline-block" />',
  '📍 ': '<MdLocationOn className="inline-block" /> ',
  '⚡ ': '<MdBolt className="inline-block text-amber-500" /> ',
  '🇱🇰 ': '',
  '🌺 ': '',
  '✓ ': ''
};

filePaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add imports
    const importToAdd = "import { MdOutlineAccountBalance, MdOutlineCollections, MdExplore, MdOutlineQrCodeScanner, MdPerson, MdAdminPanelSettings, MdUpload, MdPsychology, MdLocationOn, MdBolt } from 'react-icons/md';\n";
    if (!content.includes('MdOutlineAccountBalance')) {
      content = content.replace(/import \{[\s\S]*?\} from 'react-icons\/md';/, match => match + '\n' + importToAdd);
    }

    for (const [emoji, icon] of Object.entries(emojiMap)) {
      content = content.split(emoji).join(icon);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced emojis in ${filePath}`);
  }
});
