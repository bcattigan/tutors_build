import inquirer from "inquirer";

export const videoPrompts = {
  video: async function () {
    const video = [
      {
        name: "video",
        type: "input",
        message: "Input youtube video id (found at end of URL, 11 characters, example:1MMnr8gRIkQ):",
        validate: (value: string) => {
          const pattern = /^[a-zA-Z0-9_-]{11}$/;
          return new Promise((resolve, reject) => {
            if (!value) reject("Cannot be empty");
            if (!pattern.test(value)) reject("Not a valid youtube video id");
            resolve(true);
          });
        }
      }
    ];

    const videoObj: { video: string } = await inquirer.prompt(video);

    return videoObj;
  }
};
