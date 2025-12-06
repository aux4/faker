import { generateValue, generateObject, transformObject, setLocale } from "./lib/FakerGenerator.js";
import { convert } from "./lib/Converter.js";

export { generateValue, generateObject, transformObject };

function parseIntOrEmpty(value) {
  if (!value || value === "") return undefined;
  return parseInt(value);
}

function parseArgs(argsJson) {
  // argsJson is a JSON array string
  // Can be: '["min=1","max=100"]' -> [{ min: 1, max: 100 }]
  // Or: '[["Home","Work","Mobile"]]' -> [["Home","Work","Mobile"]]
  if (!argsJson || argsJson === "") return [];

  const args = JSON.parse(argsJson);
  if (!Array.isArray(args) || args.length === 0) return [];

  // Check if first element is a string with "=" (key=value format)
  if (typeof args[0] === "string" && args[0].includes("=")) {
    const params = args.reduce((acc, arg) => {
      const [key, value] = arg.split("=");
      acc[key] = convert(value);
      return acc;
    }, {});
    return [params];
  }

  // Otherwise pass args as-is (e.g., arrays for arrayElement)
  return args;
}

// aux4 fake value <category> <type> [--lang locale] [--count N] [--min N] [--max N] [--arg key=value...]
async function fakeValue(args) {
  const [lang, category, type, countStr, minStr, maxStr, argsJson] = args;

  if (!category || !type) {
    throw new Error("<category> <type> are required");
  }

  setLocale(lang);

  const count = parseIntOrEmpty(countStr);
  const min = parseIntOrEmpty(minStr);
  const max = parseIntOrEmpty(maxStr);

  const fakerParams = parseArgs(argsJson);

  const data = generateValue(category, type, fakerParams, { count, min, max });

  if (typeof data === "object") {
    console.log(JSON.stringify(data));
  } else {
    console.log(data);
  }
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });
}

function parseInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return { data: null, format: null };

  // Try parsing as JSON array or object first
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const format = Array.isArray(parsed) ? "array" : "object";
      return { data: parsed, format };
    } catch (e) {
      // Not valid JSON, try NDJSON
    }
  }

  // Try parsing as NDJSON (newline-delimited JSON)
  const lines = trimmed.split("\n").filter(line => line.trim());
  const objects = [];
  for (const line of lines) {
    try {
      objects.push(JSON.parse(line));
    } catch (e) {
      // Skip invalid lines
    }
  }
  return objects.length > 0 ? { data: objects, format: "ndjson" } : { data: null, format: null };
}

// aux4 fake object [--lang locale] [--count N] [--min N] [--max N] --config <name>
// mapping is passed as JSON string from aux4 config
// stdin can contain JSON object, array, or NDJSON to transform
async function fakeObject(args) {
  const [lang, countStr, minStr, maxStr, mappingJson] = args;

  if (!mappingJson || mappingJson === "") {
    throw new Error("mapping is required");
  }

  setLocale(lang);

  const count = parseIntOrEmpty(countStr);
  const min = parseIntOrEmpty(minStr);
  const max = parseIntOrEmpty(maxStr);

  const mapping = JSON.parse(mappingJson);

  // Read from stdin
  const stdinData = await readStdin();
  const { data: input, format } = parseInput(stdinData);

  if (input === null) {
    // No stdin input, generate new fake object(s)
    const data = generateObject(mapping, { count, min, max });
    console.log(JSON.stringify(data));
  } else if (format === "ndjson") {
    // NDJSON - transform each and output as NDJSON
    const results = input.map(obj => transformObject(obj, mapping));
    results.forEach(obj => console.log(JSON.stringify(obj)));
  } else if (format === "array") {
    // Array of objects - transform each one
    const results = input.map(obj => transformObject(obj, mapping));
    console.log(JSON.stringify(results));
  } else {
    // Single object - transform it
    const result = transformObject(input, mapping);
    console.log(JSON.stringify(result));
  }
}

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage:");
    console.error("  node index.js value <lang> <category> <type> [count] [min] [max] [argsJson]");
    console.error("  node index.js object <lang> [count] [min] [max] <mappingJson>");
    process.exit(1);
  }

  const action = args[0];
  const actionArgs = args.slice(1);

  try {
    if (action === "value") {
      await fakeValue(actionArgs);
    } else if (action === "object") {
      await fakeObject(actionArgs);
    } else {
      console.error(`Unknown action: ${action}`);
      console.error("Available actions: value, object");
      process.exit(1);
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
})();
