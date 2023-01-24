import chalk from "chalk";
import * as fs from "fs";
import { modelCommand } from "../utils/model_command";

export async function buildTopic() {
  if (fs.existsSync("course.md")) {
    modelCommand("topic", false, true, false);
  } else {
    console.log(chalk.red("Error: Topics can only be created at course level"));
  }
}
