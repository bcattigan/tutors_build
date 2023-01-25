import chalk from "chalk";
import path from "path";
import { modelCommand } from "../utils/model_command";

export async function buildGithub() {
  if (path.basename(process.cwd()).startsWith("topic") || path.basename(process.cwd()).startsWith("unit")) {
    modelCommand("github", false, true, true);
  } else {
    console.log(chalk.red("Error: Github links can only be created at topic or segment level"));
  }
}
