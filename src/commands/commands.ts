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
    console.log(chalk.red("Error: This type of element can only be created at course level"));
  }
}

export async function buildAtCourseOrTopicLevel(element: string) {
  if (fs.existsSync("course.md") || path.basename(process.cwd()).startsWith("topic") ) {
    const context = new Context(element);
    context.runStrategy();
  } else {
    console.log(chalk.red("Error: This type of element can only be created at course or topic level"));
  }
}

export async function buildAtTopicOrUnitLevel(element: string) {
  if (path.basename(process.cwd()).startsWith("topic") || path.basename(process.cwd()).startsWith("unit")) {
    const context = new Context(element);
    context.runStrategy();
  } else {
    console.log(chalk.red("Error: This type of element can only be created at topic or unit level"));
  }
}

export async function buildAtLabLevel(element: string) {
  if (path.basename(process.cwd()).startsWith("book")) {
    const context = new Context(element);
    context.runStrategy();
  } else {
    console.log(chalk.red("Error: This type of element can only be created at lab level"));
  }
}

export async function buildAtUnitLevel(element: string) {
  // if (path.basename(process.cwd()).startsWith("unit")) {
    const context = new Context(element);
    context.runStrategy();
  // } else {
  //   console.log(chalk.red("Error: This type of element can only be created at unit level"));
  // }
}
