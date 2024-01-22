const fs = require("fs");
const { join } = require("path");

const constants = {
  WEBCOMPONENTS_DIR: join(".", "webcomponents"),
};

const webcomponents = {};

fs.readdirSync(constants.WEBCOMPONENTS_DIR, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .forEach((folder) => {
    console.log("folder", folder);
    const fileNames = fs.readdirSync(
      join(constants.WEBCOMPONENTS_DIR, folder.name)
    );
    fileNames.forEach((fileName) => {
      const dashspilt = fileName.split("-");
      const prefix = dashspilt[0];
      const dotSplit = dashspilt[1].split(".");
      const componentName = dotSplit[0];
      if (!webcomponents[prefix]) {
        webcomponents[prefix] = [];
      }
      webcomponents[prefix].push({
        componentName,
        filePath: join(
          constants.WEBCOMPONENTS_DIR,
          folder.name,
          prefix + "-" + componentName + ".html"
        ),
      });
    });
  });

fs.writeFileSync(
  join(constants.WEBCOMPONENTS_DIR, "index.js"),
  `export const webcomponents=${JSON.stringify(webcomponents)};`
);
