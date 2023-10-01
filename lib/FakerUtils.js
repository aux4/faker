const { faker, simpleFaker } = require("@faker-js/faker");
const Converter = require("./Converter");

function resolveFakerMethod(module, method) {
  if (faker[module] && faker[module][method]) {
    return faker[module][method];
  } else if (simpleFaker[module] && simpleFaker[module][method]) {
    return simpleFaker[module][method];
  }
  throw new Error(`Invalid faker method: ${module} ${method}`);
}

function resolveFakerArgs(args) {
  if (args.length === 0) {
    return [];
  }

  const params = args
    .filter(arg => arg.includes("="))
    .map(arg => arg.split("="))
    .reduce((acc, [key, value]) => {
      acc[key] = Converter.convert(value);
      return acc;
    }, {});

  if (Object.keys(params).length > 0) {
    return params;
  }

  return args.map(Converter.convert);
}

function resolveFakerMultiple({ count, min, max }) {
  if (count && count > 1) {
    return executor => faker.helpers.multiple(executor, { count });
  } else if (min || max) {
    return executor => faker.helpers.multiple(executor, { count: { min, max } });
  }
  return executor => executor();
}

module.exports = { resolveFakerMethod, resolveFakerArgs, resolveFakerMultiple };
