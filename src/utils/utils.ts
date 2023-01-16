import * as fs from "fs";
import path from "path";
import jsrender from "jsrender";
import yaml from "js-yaml";
import chalk from "chalk";

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
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(chalk.yellow("\nCreating..."));
    console.log(chalk.yellow(`folder created: ${outputPath}`));
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
