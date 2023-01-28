import * as fs from "fs";
import path from "path";
import jsrender from "jsrender";
import yaml from "js-yaml";
import chalk from "chalk";
import open from "open";
import chokidar from "chokidar";

export const currentDir = process.cwd();
const nodePath = path.dirname(process.argv[1]);

export function writeToTemplate(template: string, input: object, outputDir: string) {
  const templatePath = path.join(nodePath, "templates", template);
  const outputPath = path.join(currentDir, outputDir);
  const outputFilePath = path.join(outputPath, path.basename(templatePath));
  try {
    const fileTemplate = fs.readFileSync(templatePath).toString();
    const renderTemplate = jsrender.templates(fileTemplate);
    const finalTemplate = renderTemplate.render(input);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
      console.log(chalk.yellow(`folder created: ${outputPath}`));
    }
    fs.writeFileSync(outputFilePath, finalTemplate);
    console.log(chalk.yellow(`file created: ${outputFilePath}`));
  } catch (err) {
    catchFileErrors(outputFilePath, err, outputDir);
  }
}

export function copyGenericTemplateFile(template: string, outputDir: string) {
  const templatePath = path.join(nodePath, "templates", template);
  const outputFilePath = path.join(currentDir, outputDir, path.basename(templatePath));
  try {
    fs.copyFileSync(templatePath, outputFilePath);
    console.log(chalk.yellow(`${path.basename(outputFilePath)} created: ${outputFilePath}`));
  } catch (err) {
    catchFileErrors(outputFilePath, err, outputDir);
  }
}

export function createYamlFileFromObject(fileName: string, input: object, outputDir: string) {
  const outputFilePath = path.join(currentDir, outputDir, `${fileName}.yaml`);
  try {
    const data = yaml.dump(input);
    fs.writeFileSync(outputFilePath, data, "utf8");
    console.log(chalk.yellow(`${path.basename(outputFilePath)} created: ${outputFilePath}`));
  } catch (err) {
    catchFileErrors(outputFilePath, err, outputDir);
  }
}

async function catchFileErrors(outputFilePath: string, error: unknown, dir: string) {
  console.log(chalk.red(`Error while creating: ${outputFilePath}: ${error}`));
  const outputs = path.join(currentDir, dir);
  if (fs.existsSync(outputs)) {
    try {
      fs.rmSync(outputs, { recursive: true });
      console.log(chalk.blue("Note: Partially created folder/files were removed"));
    } catch (err) {
      console.log(chalk.blue("Note: Partially created folder/files were not removed successfully, please remove manually:", err));
    } finally {
      process.exit();
    }
  } else {
    process.exit();
  }
}

export function getFolderCountOfType(type: string | undefined): { order: string; folderPrefix: string } {
  let orderObj: { order: string; folderPrefix: string };
  if (type) {
    let fullCount = 1;
    let typeCount = 1;
    try {
      const directoryWalk = fs.readdirSync(".");
      directoryWalk.forEach((item) => {
        if (fs.statSync(item).isDirectory()) {
          fullCount++;
          if (item.startsWith(type)) typeCount++;
        }
      });
      const stringFullCount = fullCount < 10 ? `0${fullCount}` : `${fullCount}`;
      const stringTypeCount = typeCount < 10 ? `0${typeCount}` : `${typeCount}`;
      orderObj = { order: stringFullCount, folderPrefix: `${type}-${stringTypeCount}` };
    } catch (err) {
      console.log(chalk.red(`Error while checking count of folder type (${type}): ${err}`));
      process.exit();
    }
  } else {
    console.log(chalk.red(`Error while checking count of folder type. Type was not defined`));
    process.exit();
  }
  return orderObj;
}

export async function watchForUpload(pathToOpen: string, archive = false) {
  const extensions = archive ? ".zip" : ".png, .jpg , jpeg or .gif";
  const pathName = path.join(currentDir, pathToOpen);
  const watchPath = archive ? `${currentDir}/${pathToOpen}/*.zip` : `${currentDir}/${pathToOpen}/*.{png,jpg,jpeg,gif}`;
  await open(pathName);
  console.log(chalk.bgMagenta(`\n*** Please upload a ${extensions} file to folder /${path.basename(pathName)} ***`));
  const watcher = chokidar.watch(watchPath);
  console.log(chalk.yellow("\nWatching..."));
  const fileAdded = new Promise(function (resolve) {
    watcher.on("add", async (path) => {
      resolve(path);
    });
  });
  console.log(chalk.yellow(`file added: ${await fileAdded}`));
  watcher.close();
}
