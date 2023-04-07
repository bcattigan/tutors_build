import inquirer from "inquirer";
import path from "path";
import * as fs from "fs";
import yaml from "js-yaml";
import chalk from "chalk";
import { utilFunctions } from "../utils/utils";

export const labStepPrompts = {
  prefix: async function () {
    const prefix = [
      {
        name: "prefix",
        type: "input",
        message: "Enter prefix to lab step (default answer is number for the step i.e. 01 or can change to text i.e. exercises)",
        default: utilFunctions.getFileCount().order,
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) reject("Cannot be empty");
            resolve(true);
          });
        }
      }
    ];

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
      if (path.basename(dir) == "") {
        console.log(chalk.red("Lab step prefix: Error locating properties.yaml"));
        process.exit();
      }
    } catch (err) {
      console.log(chalk.red(`Lab step prefix: Error locating/reading properties.yaml: ${err}`));
    }

    let prefixObj: { prefix?: string } = {};
    if (properties.labStepsAutoNumber) prefixObj = await inquirer.prompt(prefix);

    return prefixObj;
  }
};
