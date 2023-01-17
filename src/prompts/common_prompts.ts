import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import open from "open";
import { currentDir } from "../utils/utils";

export const commonPrompts = {
  titleAndDesc: async function (type: string) {
    const titleAndDesc = [
      {
        name: "title",
        type: "input",
        message: `${type} title?`,
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) {
              reject("Cannot be empty");
            }
            resolve(true);
          });
        }
      },
      {
        name: "desc",
        type: "input",
        message: `${type} description?`,
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) {
              reject("Cannot be empty");
            }
            resolve(true);
          });
        }
      }
    ];

    const titleAndDescObj: {
      title: string;
      desc: string;
    } = await inquirer.prompt(titleAndDesc);

    return titleAndDescObj;
  },

  icon: async function () {
    const iconOption = [
      {
        name: "icon",
        type: "list",
        message: "Use iconify or image file for icon?",
        choices: [
          { name: "iconify", value: 1 },
          { name: "image file", value: 0 }
        ]
      }
    ];
    const iconifyPrompts = [
      {
        name: "type",
        type: "input",
        message: "iconify icon name?",
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) {
              reject("Cannot be empty");
            }
            resolve(true);
          });
        }
      },
      {
        name: "iconColor",
        type: "list",
        message: "If applicable would you like to set the colour of your icon?",
        choices: [
          { name: "Yes", value: 1 },
          { name: "No", value: 0 }
        ]
      }
    ];
    const iconifyColorPrompts = [
      {
        name: "color",
        type: "input",
        message: "Input icon colour hex value (exclude #):",
        default: "000000",
        validate: (value: string) => {
          const pattern = /^[0-9A-F]{6}$/i;
          return new Promise((resolve, reject) => {
            if (!pattern.test(value)) {
              if (value.length != 6) {
                reject("Input must be 6 characters");
              }
              reject("Not a valid hex value (valid characters 0-9 A-F)");
            }
            resolve(true);
          });
        }
      }
    ];

    let iconObj: {
      icon?: {
        type?: string;
        color?: string;
      };
    } = {};

    await inquirer.prompt(iconOption).then(async (iconAnswer) => {
      if (iconAnswer.icon == 1) {
        await open("https://icon-sets.iconify.design/");
        await inquirer.prompt(iconifyPrompts).then(async (iconifyAnswers) => {
          iconObj = {
            icon: {
              type: iconifyAnswers.type
            }
          };
          if (iconifyAnswers.iconColor == 1) {
            await inquirer.prompt(iconifyColorPrompts).then((iconifyColorAnswers) => {
              iconObj = {
                icon: {
                  type: iconifyAnswers.type,
                  color: iconifyColorAnswers.color
                }
              };
            });
          }
        });
      }
    });
    return iconObj;
  },

  updateGenericTemplateFile: async function (file: string, pathToOpen: string) {
    const updateFile = [
      {
        name: "updateFile",
        type: "input",
        message: `Have you updated ${file}? (Y/N)`,
        validate: (value: string) => {
          const pattern = /^[YN]{1}$/i;
          const noPattern = /^[N]{1}$/i;
          return new Promise((resolve, reject) => {
            if (!pattern.test(value)) {
              reject("Only valid input is Y/N");
            }
            if (noPattern.test(value)) {
              reject(`Please update ${file}`);
            }
            resolve(true);
          });
        }
      }
    ];

    console.log(chalk.greenBright(`\nPlease update ${file}`));
    const filePath = path.join(currentDir, pathToOpen);
    await open(filePath);
    await inquirer.prompt(updateFile);
  }
};
