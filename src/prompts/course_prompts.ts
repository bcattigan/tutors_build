import inquirer from "inquirer";

export const courseObjPrompts = {
  titleAndDesc: async function () {
    const titleAndDesc = [
      {
        name: "title",
        type: "input",
        message: "Course title?",
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
        message: "Course description?",
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

    const courseObj: {
      title: string;
      desc: string;
    } = await inquirer.prompt(titleAndDesc);

    return courseObj;
  }
};
