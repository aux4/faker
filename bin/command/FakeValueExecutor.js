const FakerGenerator = require("../../lib/FakerGenerator");
const { resolveFakerArgs } = require("../../lib/FakerUtils");

async function fakeValueExecutor(params, action) {
  if (action.length < 2) {
    throw new Error("<module> <method> are required");
  }

  const count = await params.count.then(parseInt);
  const min = await params.min.then(parseInt);
  const max = await params.max.then(parseInt);

  try {
    const module = action[0];
    const method = action[1];
    const args = resolveFakerArgs(action.slice(2));

    const data = FakerGenerator.generateValue(module, method, args, { count, min, max });

    if (typeof data === "object") {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(data);
    }
  } catch (e) {
    throw new Error(`Error generating ${action}: ${e.message}`);
  }
}

module.exports = { fakeValueExecutor };
