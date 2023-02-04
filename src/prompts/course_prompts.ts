import inquirer from "inquirer";
import { utilFunctions } from "../utils/utils";
import { commonPrompts } from "./common_prompts";

export const coursePrompts = {
  credits: async function () {
    const credits = [
      {
        name: "credits",
        type: "input",
        message: "Who created the course?",
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) reject("Cannot be empty");
            resolve(true);
          });
        }
      }
    ];

    const creditsObj: { credits: string } = await inquirer.prompt(credits);

    return creditsObj;
  },

  ignorePin: async function () {
    const ignorePin = [
      {
        name: "ignorepin",
        type: "input",
        message: "Set your ignore pin (min 4 digits):",
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) reject("Cannot be empty");
            if (isNaN(Number(value))) reject("Must be a number");
            if (value.includes(".")) reject("Must be a whole number");
            if (value.toString().length < 4) reject("Must be minimum 4 digits");
            resolve(true);
          });
        }
      }
    ];

    const ignorePinObj: { ignorepin: number } = await inquirer.prompt(ignorePin);

    return ignorePinObj;
  },

  auth: async function (folder: string, actionLog: string[]) {
    const auth = [
      {
        name: "auth",
        type: "list",
        message: "Enable Github authentication?",
        choices: [
          { name: "Yes", value: 1 },
          { name: "No", value: 0 }
        ]
      }
    ];

    const whitelist = [
      {
        name: "whitelist",
        type: "list",
        message: "Enable whitelist feature?",
        choices: [
          { name: "Yes", value: 1 },
          { name: "No", value: 0 }
        ]
      }
    ];

    const enrollment = [
      {
        name: "enrollment",
        type: "list",
        message: "Enable enrollment feature?",
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ]
      }
    ];

    const authObj: { auth: number; whitelist?: number } = { auth: 0 };

    await inquirer.prompt(auth).then(async (answer) => {
      authObj.auth = answer.auth;
      if (answer.auth == 1) {
        await inquirer.prompt(whitelist).then(async (answer) => {
          if (answer.whitelist == 1) {
            authObj.whitelist = answer.whitelist;
            utilFunctions.copyTemplateFile("course/enrollment.yaml", folder, "enrollment.yaml", actionLog);
            await commonPrompts.checkFileUpdated("enrollment.yaml", `${folder}/enrollment.yaml`);
          } else {
            await inquirer.prompt(enrollment).then(async (answer) => {
              if (answer.enrollment) {
                utilFunctions.copyTemplateFile("course/enrollment.yaml", folder, "enrollment.yaml", actionLog);
                await commonPrompts.checkFileUpdated("enrollment.yaml", `${folder}/enrollment.yaml`);
              }
            });
          }
        });
      }
    });
    return authObj;
  },

  parent: async function () {
    const parentConfirm = [
      {
        name: "parentConfirm",
        type: "list",
        message: "Set parent course?",
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ]
      }
    ];

    const parent = [
      {
        name: "parent",
        type: "input",
        message: "Parent course URL (example: course/wit-hdip-comp-sci-2023)? ",
        validate: (value: string) => {
          return new Promise((resolve, reject) => {
            if (!value) reject("Cannot be empty");
            if (!value.startsWith("course/")) reject("Must start with course/");
            resolve(true);
          });
        },
        filter: (value: string) => {
          return value.replace(/\s/g, "");
        }
      }
    ];

    let parentObj: { parent?: string } = {};

    await inquirer.prompt(parentConfirm).then(async (answer) => {
      if (answer.parentConfirm) {
        parentObj = await inquirer.prompt(parent);
      }
    });

    return parentObj;
  },

  companions: async function () {
    const companionsConfirm = [
      {
        name: "companions",
        type: "checkbox",
        message: "Select communication tools?",
        choices: ["Slack", "Zoom", "Moodle", "YouTube", "Teams"]
      }
    ];

    const companions: {
      name: string;
      type: string;
      message: string;
      validate: (value: string) => Promise<unknown>;
      filter: (value: string) => string;
    }[] = [];

    await inquirer.prompt(companionsConfirm).then((answers) => {
      answers.companions.forEach((companion: string) => {
        companions.push({
          name: companion.toLowerCase(),
          type: "input",
          message: `Enter URL for ${companion} (Include URL protocol: http:// or https://):`,
          validate: (value: string) => {
            return new Promise((resolve, reject) => {
              if (!value) reject("Cannot be empty");
              if (!value.startsWith("http://") && !value.startsWith("https://")) reject("Must include URL protocol: http:// or https://");
              resolve(true);
            });
          },
          filter: (value: string) => {
            return value.replace(/\s/g, "");
          }
        });
      });
    });

    const companionsObj: {
      slack?: string;
      zoom?: string;
      moodle?: string;
      youtube?: string;
      teams?: string;
    } = await inquirer.prompt(companions);

    return companionsObj;
  },

  calendar: async function (folder: string, actionLog: string[]) {
    const calendar = [
      {
        name: "calendar",
        type: "list",
        message: "Use calendar feature?",
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ]
      }
    ];

    await inquirer.prompt(calendar).then(async (answer) => {
      if (answer.calendar) {
        utilFunctions.copyTemplateFile("course/calendar.yaml", folder, "calendar.yaml", actionLog);
        await commonPrompts.checkFileUpdated("calendar.yaml", `${folder}/calendar.yaml`);
      }
    });
  },

  labStepsAutoNumber: async function () {
    const labStepsAutoNumber = [
      {
        name: "labStepsAutoNumber",
        type: "list",
        message: `Would you like lab steps to have a prefix (i.e. "01: Intro" instead of just "intro")?`,
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ]
      }
    ];

    const labStepsAutoNumberObj: { labStepsAutoNumber: boolean } = await inquirer.prompt(labStepsAutoNumber);

    return labStepsAutoNumberObj;
  }
};
