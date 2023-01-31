import * as fs from "fs";
import chalk from "chalk";
import path from "path";
import { Context } from "./command_strategies";

export async function buildAtTopLevel(element: string) {
  const context = new Context(element);
  context.runStrategy();
}

export async function buildAtCourseLevel(element: string) {
  if (fs.existsSync("course.md")) {
    const context = new Context(element);
    context.runStrategy();
  } else {
    console.log(chalk.red("Error: This element cannot be created at course level"));
  }
}

export async function buildAtTopicLevel(element: string) {
  if (path.basename(process.cwd()).startsWith("topic") || path.basename(process.cwd()).startsWith("unit")) {
    const context = new Context(element);
    context.runStrategy();
  } else {
    console.log(chalk.red("Error: This element cannot be created at topic level"));
  }
}
