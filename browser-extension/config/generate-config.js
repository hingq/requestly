const fs = require("fs");
const commonConfigs = require("./configs/common.json");

const OUTPUT_DIR = "dist";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getConfigsToOverride() {
  const configs = {};

  if (process.env.BROWSER) {
    configs.browser = process.env.BROWSER;
  }

  if (process.env.ENV) {
    configs.env = process.env.ENV;
  }

  return configs;
}

function getConfigsData(configs) {
  let configsData = {};

  for (let key of Object.keys(configs)) {
    configsData = { ...configsData, ...getConfigData(key, configs[key]) };
  }

  return configsData;
}

function getConfigData(key, val) {
  let configFilePath = `./configs/${key}/${val}.json`;

  if (fs.existsSync(configFilePath)) {
    return {
      [key]: val,
      ...readJSON(configFilePath),
    };
  } else {
    console.error(`ERROR: Invalid config ${key}=${val}`);
    process.exit(1);
  }
}

(function run() {
  const CONFIG_PATH = `${OUTPUT_DIR}/config.build.json`;

  const existingConfigs = fs.existsSync(CONFIG_PATH) ? readJSON(CONFIG_PATH) : {};

  const configsToOverride = getConfigsToOverride();

  const configs = {
    ...commonConfigs,
    ...getConfigsData(readJSON("./configs/defaults.json")),
    ...existingConfigs,
    ...getConfigsData(configsToOverride),
  };

  const configsJSONContent = JSON.stringify(configs, null, 2);
  fs.writeFileSync(CONFIG_PATH, configsJSONContent);

  const configJSContent = `
window.RQ = window.RQ || {};
window.RQ.configs = ${configsJSONContent};
`;

  fs.writeFileSync(`${OUTPUT_DIR}/config.js`, configJSContent);
})();
