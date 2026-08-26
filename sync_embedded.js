/* ==========================================================================
   Sync Embedded Data Helper Script
   Reads resources_directory_es.md and resources_directory_en.md and 
   automatically generates embedded_data.js for offline file:// support.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const esPath = path.join(__dirname, 'resources_directory_es.md');
const enPath = path.join(__dirname, 'resources_directory_en.md');
const outputPath = path.join(__dirname, 'embedded_data.js');

try {
  const esMd = fs.readFileSync(esPath, 'utf8');
  const enMd = fs.readFileSync(enPath, 'utf8');

  const content = `/* ==========================================================================
   Embedded Resources Directory Data (Offline & Fallback)
   Version: 1.0
   Updated: 2026-08-26
   ========================================================================== */

window.EMBEDDED_DATA_ES = ${JSON.stringify(esMd)};

window.EMBEDDED_DATA_EN = ${JSON.stringify(enMd)};
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log('✓ embedded_data.js successfully synchronized with Markdown files!');
} catch (err) {
  console.error('✖ Error synchronizing embedded_data.js:', err.message);
}
