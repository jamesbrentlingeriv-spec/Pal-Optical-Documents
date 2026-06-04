const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/paloptical/.gemini/antigravity/brain/f89774ed-f905-432d-8902-e9fb55f69e45/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

let lineCount = 0;
let matchCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (line.includes('const FORM_CLASSES: Record<string, any>')) {
    try {
      // Clean up JSON line or parse it directly
      // Since it could be a JSON or raw text, let's write it to a text file
      matchCount++;
      fs.writeFileSync(`app_tsx_found_${lineCount}.json`, line);
      console.log(`Line ${lineCount}: Found match, saved to app_tsx_found_${lineCount}.json`);
    } catch (e) {
      console.log(`Error processing line ${lineCount}: ${e.message}`);
    }
  }
});

rl.on('close', () => {
  console.log(`Done. Found ${matchCount} lines.`);
});
