import { resolveFakerMultiple, resolveFakerMethod, setFakerLocale } from "./FakerUtils.js";
import { convert } from "./Converter.js";

export function setLocale(locale) {
  setFakerLocale(locale);
}

export function generateValue(category, type, args, options = {}) {
  const multiple = resolveFakerMultiple(options);
  const fakerAction = resolveFakerMethod(category, type);

  return multiple(() => {
    if (!args || args.length === 0) {
      return fakerAction();
    }
    return fakerAction(...args);
  });
}

export function generateObject(config, options) {
  const multiple = resolveFakerMultiple(options);
  // Handle both { mapping: {...} } and direct mapping formats
  const mapping = config.mapping || config;
  return multiple(() => fakeObject(mapping));
}

export function transformObject(input, config) {
  // Handle both { mapping: {...} } and direct mapping formats
  const mapping = config.mapping || config;
  return applyFakeToObject(input, mapping);
}

function applyFakeToObject(input, mapping) {
  // Start with copy of input object
  const object = { ...input };

  Object.entries(mapping)
    .filter(([_, value]) => value.fake || value.mapping)
    .forEach(([key, value]) => {
      if (value.mapping) {
        if (value.type === "array") {
          // If input has this array, transform each item; otherwise generate new
          if (Array.isArray(input[key])) {
            object[key] = input[key].map(item => applyFakeToObject(item, value.mapping));
          } else {
            const multiple = resolveFakerMultiple(value.fake?.options || { min: 0, max: 3 });
            object[key] = multiple(() => fakeObject(value.mapping));
          }
        } else {
          // Nested object - transform if exists, otherwise generate
          if (input[key] && typeof input[key] === "object") {
            object[key] = applyFakeToObject(input[key], value.mapping);
          } else {
            object[key] = fakeObject(value.mapping);
          }
        }
        return;
      }

      // Generate fake value for this field
      let category, type, args;

      if (typeof value.fake === "string") {
        const action = value.fake.split(" ");
        category = action[0];
        type = action[1];
        args = [];
      } else {
        category = value.fake.category;
        type = value.fake.type;
        const fakeArgs = value.fake.args;
        if (!fakeArgs) {
          args = [];
        } else if (Array.isArray(fakeArgs)) {
          args = fakeArgs;
        } else {
          args = [fakeArgs];
        }
      }

      const resolvedArgs = resolveReferences(args, object);
      object[key] = generateValue(category, type, resolvedArgs);
    });

  return object;
}

function resolveReferences(args, object) {
  if (!args || args.length === 0) return args;

  return args.map(arg => {
    if (typeof arg === "string" && arg.startsWith("@")) {
      const refKey = arg.slice(1);
      return object[refKey];
    } else if (Array.isArray(arg)) {
      // Arrays pass through as-is (no references inside arrays)
      return arg;
    } else if (typeof arg === "object" && arg !== null) {
      const resolved = {};
      for (const [key, value] of Object.entries(arg)) {
        if (typeof value === "string" && value.startsWith("@")) {
          const refKey = value.slice(1);
          resolved[key] = object[refKey];
        } else {
          resolved[key] = value;
        }
      }
      return resolved;
    }
    return arg;
  });
}

function fakeObject(mapping) {
  const object = {};

  Object.entries(mapping)
    .filter(([_, value]) => value.fake || value.mapping)
    .forEach(([key, value]) => {
      if (value.mapping) {
        if (value.type === "array") {
          const multiple = resolveFakerMultiple(value.fake?.options || { min: 0, max: 3 });
          object[key] = multiple(() => fakeObject(value.mapping));
        } else {
          object[key] = fakeObject(value.mapping);
        }
        return;
      }

      let category, type, args;

      if (typeof value.fake === "string") {
        // String format: "person firstName"
        const action = value.fake.split(" ");
        category = action[0];
        type = action[1];
        args = [];
      } else {
        // Object format: { category: "person", type: "firstName", args: ["male"] }
        // or { category: "person", type: "fullName", args: { sex: "male" } }
        category = value.fake.category;
        type = value.fake.type;
        const fakeArgs = value.fake.args;
        if (!fakeArgs) {
          args = [];
        } else if (Array.isArray(fakeArgs)) {
          args = fakeArgs;
        } else {
          // args is an object, wrap in array
          args = [fakeArgs];
        }
      }

      // Resolve @references to other fields
      const resolvedArgs = resolveReferences(args, object);

      object[key] = generateValue(category, type, resolvedArgs);
    });

  return object;
}
