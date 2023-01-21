import chalk from "chalk";
import path from "path";
import { commonPrompts } from "../prompts/common_prompts";
import { getFolderCountOfType, writeToTemplate } from "../utils/utils";

export async function buildSegment() {
  if (path.basename(process.cwd()).startsWith("topic")) {
    console.log(chalk.greenBright("Build a segment:"));
    const segmentObj = await commonPrompts.titleAndDesc("Segment", true);
    const folderName = `${getFolderCountOfType("unit")}-${segmentObj.title}`;
    writeToTemplate("segment/segment.md", segmentObj, folderName);
  } else {
    console.log(chalk.red("Error: Segments can only be created at topic level"));
  }
}
