import * as fs from "fs";
import chalk from "chalk";
import path from "path";
import { Context } from "./command_strategies";

const errorString = "Error: This type of element can only be created at the following level(s):";

function strategy(element: string) {
  const context = new Context(element);
  context.runStrategy();
}

function condition(element: string, conditions: string[]) {
  if (conditions.some((item) => path.basename(process.cwd()).startsWith(item))) {
    strategy(element);
  } else {
    console.log(chalk.red(`${errorString} ${conditions.toString()}`));
  }
}

export async function buildAtTopLevel(element: string) {
  strategy(element);
}

export async function buildAtCourseLevel(element: string) {
  if (fs.existsSync("course.md")) {
    strategy(element);
  } else {
    console.log(chalk.red(`${errorString} course`));
  }
}

export async function buildAtCourseOrTopicLevel(element: string) {
  if (fs.existsSync("course.md") || path.basename(process.cwd()).startsWith("topic")) {
    strategy(element);
  } else {
    console.log(chalk.red(`${errorString} course,topic`));
  }
}

export async function buildAtTopicOrUnitLevel(element: string) {
  condition(element, ["topic", "unit", "side"]);
}

export async function buildAtTopicLevel(element: string) {
  condition(element, ["topic"]);
}

export async function buildAtLabLevel(element: string) {
  condition(element, ["book"]);
}

export async function buildAtUnitLevel(element: string) {
  condition(element, ["unit"]);
}

export async function buildAtResourceLevel(element: string) {
  condition(element, ["talk", "note", "book", "archive", "web", "github"]);
}
