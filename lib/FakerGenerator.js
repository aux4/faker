const { resolveFakerMultiple, resolveFakerMethod } = require("./FakerUtils");
const Converter = require("./Converter");

class FakerGenerator {
  static generateValue(module, method, args, options = {}) {
    const multiple = resolveFakerMultiple(options);
    const fakerAction = resolveFakerMethod(module, method);

    return multiple(() => {
      if (Array.isArray(args)) {
        return fakerAction(...args);
      }
      return fakerAction({ ...args });
    });
  }

  static generateObject(config, options) {
    const multiple = resolveFakerMultiple(options);
    return multiple(() => fakeObject(config));
  }
}

function fakeObject(config) {
  const object = {};

  Object.entries(config.mapping)
    .filter(([_, value]) => value.fake || value.mapping)
    .forEach(([key, value]) => {
      if (value.mapping) {
        if (value.type === "array") {
          const multiple = resolveFakerMultiple(value.fake?.options || { min: 0, max: 3 });
          object[key] = multiple(() => fakeObject(value));
        } else {
          object[key] = fakeObject(value);
        }
        return;
      }

      const fake = typeof value.fake === "object" ? value.fake : { value: value.fake };
      const action = fake.value.split(" ");
      const module = action[0];
      const method = action[1];
      const args = (fake.args || []).map(Converter.convert);
      const params = fake.params;

      object[key] = FakerGenerator.generateValue(module, method, args.length > 0 ? args : params, fake.options);
    });

  return object;
}

module.exports = FakerGenerator;
