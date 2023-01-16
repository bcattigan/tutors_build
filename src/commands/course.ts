import chalk from "chalk";
import { courseObjPrompts, propertiesObjPrompts, calenderPrompts } from "../prompts/course_prompts";
import { commonPrompts } from "../prompts/common_prompts";
import { writeToTemplate, copyGenericTemplateFile, createYamlFileFromObject } from "../utils/utils";

export async function buildCourse() {
  console.log(chalk.greenBright("Build a course:"));
  const courseObj = await courseObjPrompts.titleAndDesc();
  const propertiesObj = await createPropertiesObj();
  const calendarBoolean = await calenderPrompts.calendarConfirm();
  const enrollmentBoolean = propertiesObj.enrollment;
  delete propertiesObj.enrollment;
  writeToTemplate("course/course.md", courseObj, courseObj.title);
  createYamlFileFromObject("properties", propertiesObj, courseObj.title);
  copyGenericTemplateFiles(propertiesObj, calendarBoolean, enrollmentBoolean, courseObj.title);
  updateGenericTemplateFiles(propertiesObj, calendarBoolean, enrollmentBoolean, courseObj.title);
}

async function createPropertiesObj() {
  const generalItems = {
    hideVideos: false,
    ignore: ["topic-XX-EXAMPLE"]
  };
  return {
    ...(await propertiesObjPrompts.credits()),
    ...(await propertiesObjPrompts.ignorePin()),
    ...(await propertiesObjPrompts.auth()),
    ...(await propertiesObjPrompts.parent()),
    ...(await propertiesObjPrompts.companions()),
    ...(await commonPrompts.icon()),
    ...generalItems
  };
}

function copyGenericTemplateFiles(propertiesObj: object, calendarBoolean: boolean, enrollmentBoolean: boolean | undefined, dir: string) {
  copyGenericTemplateFile("course/package.json", dir);
  if (!("icon" in propertiesObj)) {
    copyGenericTemplateFile("course/course.png", dir);
  }
  if (calendarBoolean) {
    copyGenericTemplateFile("course/calendar.yaml", dir);
  }
  if (enrollmentBoolean || "whitelist" in propertiesObj) {
    copyGenericTemplateFile("course/enrollment.yaml", dir);
  }
}

async function updateGenericTemplateFiles(propertiesObj: object, calendarBoolean: boolean, enrollmentBoolean: boolean | undefined, dir: string) {
  if (!("icon" in propertiesObj)) {
    await commonPrompts.updateGenericTemplateFile("course.png (.png, .jpg, .jpeg and .gif accepted)", `${dir}`);
  }
  if (calendarBoolean) {
    await commonPrompts.updateGenericTemplateFile("calendar.yaml", `${dir}/calendar.yaml`);
  }
  if (enrollmentBoolean || "whitelist" in propertiesObj) {
    await commonPrompts.updateGenericTemplateFile("enrollment.yaml", `${dir}/enrollment.yaml`);
  }
}
