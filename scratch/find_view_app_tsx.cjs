const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/paloptical/.gemini/antigravity/brain/f89774ed-f905-432d-8902-e9fb55f69e45/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

let lineCount = 0;
let count = 0;

rl.on('line', (line) => {
  lineCount++;
  if (line.includes('view_file') && line.includes('App.tsx')) {
    try {
      const data = JSON.parse(line);
      console.log(`Line ${lineCount}: step=${data.step_index}, type=${data.type}`);
      
      // Let's inspect the step and see if we have tool results
      if (data.tool_calls) {
        console.log(`  Contains tool_calls:`, data.tool_calls.map(t => t.name));
      }
      
      // Look for the output of the tool call
      // In JSONL, the result of a tool execution might be logged as type: "tool_result" or similar
      // Let's write the whole line to a text file for inspection
      fs.writeFileSync(`app_tsx_view_${data.step_index || lineCount}.json`, JSON.stringify(data, null, 2));
      count++;
    } catch (e) {
      console.log(`Error parsing line ${lineCount}: ${e.message}`);
    }
  }
});

rl.on('close', () => {
  console.log(`Done. Found ${count} lines.`);
});
