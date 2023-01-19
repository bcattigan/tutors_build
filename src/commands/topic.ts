import chalk from "chalk";
import * as fs from "fs";
import { commonPrompts } from "../prompts/common_prompts";
import { getFolderCountOfType, writeToTemplate, copyGenericTemplateFile } from "../utils/utils";

export async function buildTopic() {
  if (fs.existsSync("course.md")) {
    console.log(chalk.greenBright("Build a topic:"));
    const topicObj = {
      ...(await commonPrompts.titleAndDesc("Topic")),
      ...(await commonPrompts.icon())
    };
    const folderName = `${getFolderCountOfType("topic")}-${topicObj.title}`;
    writeToTemplate("topic/topic.md", topicObj, folderName);
    if (!("icon" in topicObj)) {
      copyGenericTemplateFile("topic/topic.png", folderName);
      await commonPrompts.updateGenericTemplateFile("topic.png (.png, .jpg, .jpeg and .gif accepted)", `${folderName}`);
    }
  } else {
    console.log(chalk.red("Error: Topics can only be created at course level"));
  }
}
