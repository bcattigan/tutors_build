import chalk from "chalk";
import { courseObjPrompts } from "../prompts/course_prompts";

export async function buildCourse() {
  console.log(chalk.greenBright("Build a course:"));
  const courseObj = await courseObjPrompts.titleAndDesc();
  console.log(chalk.red(`Title: ${courseObj.title}`));
  console.log(chalk.red(`Desc: ${courseObj.desc}`));
}
