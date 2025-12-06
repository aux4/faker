import { generateValue, generateObject, setLocale } from "./lib/FakerGenerator.js";
import { convert } from "./lib/Converter.js";

export { generateValue, generateObject };

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
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }
}

// aux4 fake object [--lang locale] [--count N] [--min N] [--max N] --config <name>
// mapping is passed as JSON string from aux4 config
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

  const data = generateObject(mapping, { count, min, max });
  console.log(JSON.stringify(data, null, 2));
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
