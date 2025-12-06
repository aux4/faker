import { Faker, base, en, en_US, pt_BR, es, de, fr, it, ja, ko, zh_CN, zh_TW, ru, ar, nl, pl, sv, tr } from "@faker-js/faker";
import { convert } from "./Converter.js";

const locales = {
  en,
  en_US,
  pt_BR,
  es,
  de,
  fr,
  it,
  ja,
  ko,
  zh_CN,
  zh_TW,
  ru,
  ar,
  nl,
  pl,
  sv,
  tr
};

let faker = new Faker({ locale: [en_US, en, base] });

export function setFakerLocale(locale) {
  const selectedLocale = locales[locale];
  if (selectedLocale) {
    faker = new Faker({ locale: [selectedLocale, en, base] });
  }
}

export function resolveFakerMethod(category, type) {
  if (faker[category] && faker[category][type]) {
    return faker[category][type];
  }
  throw new Error(`Invalid faker category/type: ${category} ${type}`);
}

export function resolveFakerArgs(args) {
  if (args.length === 0) {
    return [];
  }

  const params = args
    .filter(arg => arg.includes("="))
    .map(arg => arg.split("="))
    .reduce((acc, [key, value]) => {
      acc[key] = convert(value);
      return acc;
    }, {});

  if (Object.keys(params).length > 0) {
    return params;
  }

  return args.map(convert);
}

export function resolveFakerMultiple({ count, min, max }) {
  if (count && count > 1) {
    return executor => faker.helpers.multiple(executor, { count });
  } else if (min || max) {
    return executor => faker.helpers.multiple(executor, { count: { min, max } });
  }
  return executor => executor();
}
