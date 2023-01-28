import chalk from "chalk";
import * as fs from "fs";
import path from "path";
import { courseObjPrompts, propertiesObjPrompts, calenderPrompts } from "../prompts/course_prompts";
import { commonPrompts } from "../prompts/common_prompts";
import { writeToTemplate, copyGenericTemplateFile, createYamlFileFromObject, watchForUpload } from "../utils/utils";
import { modelCommand } from "../utils/model_command";

export async function buildCourse() {
  console.log(chalk.greenBright("Build course:"));
  const courseObj = await courseObjPrompts.titleAndDesc();
  const propertiesObj = {
    ...(await propertiesObjPrompts.credits()),
    ...(await propertiesObjPrompts.ignorePin()),
    ...(await propertiesObjPrompts.auth()),
    ...(await propertiesObjPrompts.parent()),
    ...(await propertiesObjPrompts.companions()),
    ...(await commonPrompts.icon()),
    ...{ hideVideos: false, ignore: ["topic-XX-EXAMPLE"] }
  };
  const calendarBoolean = await calenderPrompts.calendarConfirm();
  const enrollmentBoolean = propertiesObj.enrollment;
  delete propertiesObj.enrollment;
  const dir = courseObj.title;
  console.log();
  writeToTemplate("course/course.md", courseObj, dir);
  createYamlFileFromObject("properties", propertiesObj, dir);
  copyGenericTemplateFile("course/package.json", dir);
  if (calendarBoolean) copyGenericTemplateFile("course/calendar.yaml", dir);
  if (enrollmentBoolean || "whitelist" in propertiesObj) copyGenericTemplateFile("course/enrollment.yaml", dir);
  if (calendarBoolean) await commonPrompts.updateGenericTemplateFile("calendar.yaml", `${dir}/calendar.yaml`);
  if (enrollmentBoolean || "whitelist" in propertiesObj) await commonPrompts.updateGenericTemplateFile("enrollment.yaml", `${dir}/enrollment.yaml`);
  if (!("icon" in propertiesObj)) await watchForUpload(dir);
}

export async function buildTopic() {
  if (fs.existsSync("course.md")) {
    modelCommand("topic");
  } else {
    console.log(chalk.red("Error: Topics can only be created at course level"));
  }
}

export async function buildAtTopicLevel(type: string) {
  if (path.basename(process.cwd()).startsWith("topic") || path.basename(process.cwd()).startsWith("unit")) {
    modelCommand(type);
  } else {
    console.log(chalk.red("Error: This type cannot be created at this level"));
  }
}
