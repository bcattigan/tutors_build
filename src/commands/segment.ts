import chalk from "chalk";
import { commonPrompts } from "../prompts/common_prompts";

export async function buildSegment() {
  console.log(chalk.greenBright("Build a segment:"));
  const segmentObj = await commonPrompts.titleAndDesc("Segment", true);
  console.log(chalk.red(`Title: ${segmentObj.title}`));
}
