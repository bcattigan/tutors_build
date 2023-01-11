import inquirer from "inquirer";

export const testPrompts = {
  promptFunction: async function () {
    const prompts = [
      {
        name: "name",
        type: "input",
        message: "What is your name?",
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
    const testObj: {
      name: string;
    } = await inquirer.prompt(prompts);

    return testObj;
  }
};
