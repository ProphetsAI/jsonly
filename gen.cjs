const fs = require('fs');

const constants = {
  "WEBCOMPONENTS_DIR": "./webcomponents",
}

const webcomponents = {};

fs.readdirSync(constants.WEBCOMPONENTS_DIR, { withFileTypes: true })
  .filter(dir => dir.isDirectory())
  .forEach(folder => {
    const fileNames = fs.readdirSync(folder.path + "/" + folder.name);
    fileNames.forEach(fileName => {
      const dashspilt = fileName.split("-");
      const prefix = dashspilt[0];
      const dotSplit = dashspilt[1].split(".");
      const componentName = dotSplit[0];
      if (!webcomponents[prefix]) {
        webcomponents[prefix] = [];
      }
      webcomponents[prefix].push({
        componentName,
        "filePath": folder.path + "/" + folder.name + "/" + prefix + "-" + componentName + ".html"
      })
    });
  });

fs.writeFileSync(
  constants.WEBCOMPONENTS_DIR + "/index.js",
  `export const webcomponents=${JSON.stringify(webcomponents)};`
);

