#!/usr/bin/env node

const { Engine } = require("@aux4/engine");
const { fakeValueExecutor } = require("./command/FakeValueExecutor");
const { fakeObjectExecutor } = require("./command/FakeObjectExecutor");

process.title = "aux4-faker";

const config = {
  profiles: [
    {
      name: "main",
      commands: [
        {
          name: "fake",
          execute: ["profile:fake"],
          help: {
            text: "Generate fake data"
          }
        }
      ]
    },
    {
      name: "fake",
      commands: [
        {
          name: "value",
          execute: fakeValueExecutor,
          help: {
            text: "<module> <method> Generate fake data",
            variables: [
              {
                name: "count",
                text: "Number of items to generate",
                default: ""
              },
              {
                name: "min",
                text: "Minimum number of items to generate",
                default: ""
              },
              {
                name: "max",
                text: "Maximum number of items to generate",
                default: ""
              }
            ]
          }
        },
        {
          name: "object",
          execute: fakeObjectExecutor,
          help: {
            text: "Generate fake object",
            variables: [
              {
                name: "configFile",
                text: "Configuration file.\nIt automatically reads *config.yaml*, *config.yml*, *config.json*.",
                default: ""
              },
              {
                name: "config",
                text: "Configuration name",
                default: ""
              },
              {
                name: "count",
                text: "Number of items to generate",
                default: ""
              },
              {
                name: "min",
                text: "Minimum number of items to generate",
                default: ""
              },
              {
                name: "max",
                text: "Maximum number of items to generate",
                default: ""
              }
            ]
          }
        }
      ]
    }
  ]
};

(async () => {
  const engine = new Engine({ aux4: config });

  const args = process.argv.splice(2);

  try {
    await engine.run(args);
  } catch (e) {
    console.error(e.message.red);
    process.exit(1);
  }
})();
