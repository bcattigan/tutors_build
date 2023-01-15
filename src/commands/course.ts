import chalk from "chalk";
import { courseObjPrompts, propertiesObjPrompts } from "../prompts/course_prompts";
import { commonPrompts } from "../prompts/common_prompts";

export async function buildCourse() {
  console.log(chalk.greenBright("Build a course:"));
  const courseObj = await courseObjPrompts.titleAndDesc();
  const propertiesObj = await createPropertiesObj();
  console.log(chalk.red(JSON.stringify(courseObj)));
  console.log(chalk.red(JSON.stringify(propertiesObj)));
}

async function createPropertiesObj() {
  const generalItems = {
    hideVideos: false,
    ignore: ["topic-XX-EXAMPLE"]
  };
  return {
    ...(await propertiesObjPrompts.credits()),
    ...(await propertiesObjPrompts.ignorePin()),
    ...(await propertiesObjPrompts.auth()),
    ...(await propertiesObjPrompts.parent()),
    ...(await propertiesObjPrompts.companions()),
    ...(await commonPrompts.icon()),
    ...generalItems
  };
}
