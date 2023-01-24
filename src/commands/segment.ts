import chalk from "chalk";
import path from "path";
import { modelCommand } from "../utils/model_command";

export async function buildSegment() {
  if (path.basename(process.cwd()).startsWith("topic")) {
    modelCommand("segment", true, false, false);
  } else {
    console.log(chalk.red("Error: Segments can only be created at topic level"));
  }
}
