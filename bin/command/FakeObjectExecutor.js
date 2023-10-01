const { ConfigLoader } = require("@aux4/config");
const FakerGenerator = require("../../lib/FakerGenerator");

async function fakeObjectExecutor(params) {
  const count = await params.count.then(parseInt);
  const min = await params.min.then(parseInt);
  const max = await params.max.then(parseInt);

  const config = await loadConfig(params);

  try {
    const data = FakerGenerator.generateObject(config, { count, min, max });
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    throw new Error(`Error generating object: ${e.message}`);
  }
}

async function loadConfig(params) {
  const configFile = await params.configFile;
  const configName = await params.config;

  const config = ConfigLoader.load(configFile);
  return config.get(configName);
}

module.exports = { fakeObjectExecutor };
