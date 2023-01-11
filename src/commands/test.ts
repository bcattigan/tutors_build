import chalk from "chalk";
import { testPrompts } from "../prompts/test_prompts";

export async function testFunction() {
  console.log(chalk.greenBright("Start Test:"));
  const testObj = await testPrompts.promptFunction();
  console.log(chalk.red(testObj.name));
}
