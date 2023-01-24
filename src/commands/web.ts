import chalk from "chalk";
import path from "path";
import { modelCommand } from "../utils/model_command";

export async function buildWeb() {
  if (path.basename(process.cwd()).startsWith("topic") || path.basename(process.cwd()).startsWith("unit")) {
    modelCommand("web", false, true, true);
  } else {
    console.log(chalk.red("Error: Web links can only be created at topic or segment level"));
  }
}
