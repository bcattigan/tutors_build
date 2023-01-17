import chalk from "chalk";
import { commonPrompts } from "../prompts/common_prompts";

export async function buildTopic() {
  console.log(chalk.greenBright("Build a topic:"));
  const topicObj = await commonPrompts.titleAndDesc("Topic");
  console.log(chalk.red(`Title: ${topicObj.title}`));
  console.log(chalk.red(`Desc: ${topicObj.desc}`));
}
