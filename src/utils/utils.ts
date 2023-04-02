import * as fs from "fs";
import path from "path";
import jsrender from "jsrender";
import yaml from "js-yaml";
import chalk from "chalk";
import open from "open";
import chokidar from "chokidar";

export const currentDir = process.cwd();
export const nodePath = require.main ? path.dirname(require.main.filename) : path.dirname(process.argv[1]);

export const constants = {
  oldNames: new Map([
    ["course", "course"],
    ["topic", "topic"],
    ["unit", "unit"],
    ["web link", "web"],
    ["github link", "github"],
    ["archive", "archive"],
    ["lab", "book"],
    ["lab step", "lab step"],
    ["presentation", "talk"],
    ["note", "note"],
    ["panel presentation", "paneltalk"],
    ["panel note", "panelnote"],
    ["panel video", "panelvideo"],
    ["side unit", "side"]
  ])
};

async function catchFileErrors(outputFilePath: string, error: unknown, outputFolderPath: string) {
  console.log(chalk.red(`Error while creating: ${outputFilePath}: ${error}`));
  if (fs.existsSync(outputFolderPath)) {
    try {
      fs.rmSync(outputFolderPath, { recursive: true });
      console.log(chalk.blue(`Note: Partially created folder/files at ${outputFolderPath} were removed`));
    } catch (err) {
      console.log(chalk.blue(`Note: Partially created folder/files at ${outputFolderPath} were not removed successfully, please remove manually:`, err));
    } finally {
      process.exit();
    }
  } else {
    process.exit();
  }
}

export const utilFunctions = {
  createFolder(outputFolder: string, actionLog: string[]) {
    const outputFolderPath = path.join(currentDir, outputFolder);
    try {
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
        actionLog.push(`folder created: ${outputFolderPath}`);
      }
    } catch (err) {
      catchFileErrors(outputFolderPath, err, outputFolderPath);
    }
  },

  writeStringToFile: function (outputFolder: string, outputFile: string, input: string, actionLog: string[]) {
    this.createFolder(outputFolder, actionLog);
    const outputFolderPath = path.join(currentDir, outputFolder);
    const outputFilePath = path.join(outputFolderPath, outputFile);
    try {
      fs.writeFileSync(outputFilePath, input);
      actionLog.push(`file created: ${outputFilePath}`);
    } catch (err) {
      catchFileErrors(outputFilePath, err, outputFolderPath);
    }
  },

  writeToTemplate: function (template: string, outputFolder: string, outputFile: string, input: object, actionLog: string[]) {
    this.createFolder(outputFolder, actionLog);
    const templateFilePath = path.join(nodePath, "templates", template);
    const outputFolderPath = path.join(currentDir, outputFolder);
    const outputFilePath = path.join(outputFolderPath, outputFile);
    try {
      const fileTemplate = fs.readFileSync(templateFilePath).toString();
      const renderTemplate = jsrender.templates(fileTemplate);
      const finalTemplate = renderTemplate.render(input);
      this.writeStringToFile(outputFolder, outputFile, finalTemplate, actionLog);
    } catch (err) {
      catchFileErrors(outputFilePath, err, outputFolderPath);
    }
  },

  copyTemplateFile: function (template: string, outputFolder: string, outputFile: string, actionLog: string[]) {
    this.createFolder(outputFolder, actionLog);
    const templateFilePath = path.join(nodePath, "templates", template);
    const outputFolderPath = path.join(currentDir, outputFolder);
    const outputFilePath = path.join(outputFolderPath, outputFile);
    try {
      fs.copyFileSync(templateFilePath, outputFilePath);
      actionLog.push(`${path.basename(outputFilePath)} created: ${outputFilePath}`);
    } catch (err) {
      catchFileErrors(outputFilePath, err, outputFolderPath);
    }
  },

  createYamlFileFromObject: function (outputFolder: string, outputFile: string, input: object, actionLog: string[]) {
    this.createFolder(outputFolder, actionLog);
    const outputFolderPath = path.join(currentDir, outputFolder);
    const outputFilePath = path.join(outputFolderPath, outputFile);
    try {
      const data = yaml.dump(input);
      fs.writeFileSync(outputFilePath, data, "utf8");
      actionLog.push(`${path.basename(outputFilePath)} created: ${outputFilePath}`);
    } catch (err) {
      catchFileErrors(outputFilePath, err, outputFolderPath);
    }
  },

  watchForUpload: async function (uploadFolder: string, text: string, glob: string, actionLog: string[]) {
    this.createFolder(uploadFolder, actionLog);
    const uploadFolderPath = path.join(currentDir, uploadFolder);
    const watchPath = `${uploadFolderPath}/${glob}`;
    console.log(chalk.bgMagenta(`\n *** Please upload ${text} to folder /${path.basename(uploadFolderPath)} *** `));
    await open(uploadFolderPath);
    const watcher = chokidar.watch(watchPath);
    console.log(chalk.bold("\nProgramme will resume once file uploaded. Watching..."));
    const fileUploaded = new Promise(function (resolve) {
      watcher.on("add", async (path) => {
        console.log();
        resolve(path);
      });
    });
    let uploadedFile = `${await fileUploaded}`;
    if (path.basename(uploadFolderPath) == "img") {
      const labImage = path.join(path.dirname(uploadedFile), `main${path.extname(uploadedFile)}`);
      fs.renameSync(uploadedFile, labImage);
      uploadedFile = labImage;
    }
    actionLog.push(`file uploaded: ${uploadedFile}`);
    console.log(chalk.cyan("File upload detected, thank you"));
    watcher.close();
  },

  getFolderCountOfElement: function (element: string) {
    const elementType = constants.oldNames.get(element);
    let orderObj: { order: string; folderPrefix: string };
    if (elementType) {
      let fullCount = 1;
      let elementCount = 1;
      try {
        const dirWalk = fs.readdirSync(".");
        dirWalk.forEach((item) => {
          if (fs.statSync(item).isDirectory()) {
            fullCount++;
            if (item.startsWith(elementType)) elementCount++;
          }
        });
        const stringFullCount = fullCount < 10 ? `0${fullCount}` : `${fullCount}`;
        const stringElementCount = elementCount < 10 ? `0${elementCount}` : `${elementCount}`;
        orderObj = { order: stringFullCount, folderPrefix: `${elementType}-${stringElementCount}` };
      } catch (err) {
        console.log(chalk.red(`Error while checking count of folders for element (${element}): ${err}`));
        process.exit();
      }
    } else {
      console.log(chalk.red(`Error while checking count of folders for element (${element}). Type was not defined in names map`));
      process.exit();
    }
    return orderObj;
  },

  getFileCount: function () {
    let countObj: { order: string };
    let count = 0;
    try {
      const dirWalk = fs.readdirSync(".");
      dirWalk.forEach((item) => {
        if (fs.statSync(item).isFile()) {
          count++;
        }
      });
      const stringCount = count < 10 ? `0${count}` : `${count}`;
      countObj = { order: stringCount };
    } catch (err) {
      console.log(chalk.red(`Error while checking count of files: ${err}`));
      process.exit();
    }
    return countObj;
  },

  getPropertiesYaml: function () {
    let dir = process.cwd();
    let properties: { labStepsAutoNumber?: boolean } = { labStepsAutoNumber: false };
    try {
      while (path.basename(dir) != "") {
        const propertiesYaml = path.join(dir, "properties.yaml");
        if (fs.existsSync(propertiesYaml)) {
          properties = yaml.load(fs.readFileSync(propertiesYaml, "utf8")) as object;
          break;
        }
        dir = path.resolve(dir, "..");
      }
    } catch (err) {
      console.log(chalk.red(`Error locating/reading properties.yaml: ${err}`));
    }
    return properties;
  }
};
