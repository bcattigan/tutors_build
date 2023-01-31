import chalk from "chalk";
import { commonPrompts } from "../prompts/common_prompts";
import { coursePrompts } from "../prompts/course_prompts";
import { constants, utilFunctions } from "../utils/utils";

export interface Strategy {
  execute(element: string, actionLog: string[]): Promise<void>;
}

export class CourseStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    const courseObj = {
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element))
    };

    utilFunctions.createFolder(courseObj.title, actionLog);
    utilFunctions.writeToTemplate(`${constants.oldNames.get(element)}/${constants.oldNames.get(element)}.md`, courseObj.title, `${element}.md`, courseObj, actionLog);

    let propertiesObj = {
      ...(await coursePrompts.credits()),
      ...(await coursePrompts.ignorePin()),
      ...(await coursePrompts.auth(courseObj.title, actionLog)),
      ...(await coursePrompts.parent()),
      ...(await coursePrompts.companions())
    };
    await coursePrompts.calendar(courseObj.title, actionLog);
    propertiesObj = {
      ...propertiesObj,
      ...(await commonPrompts.icon(courseObj.title, actionLog)),
      ...{ hideVideos: false, ignore: ["topic-XX-EXAMPLE"] }
    };

    utilFunctions.createYamlFileFromObject(courseObj.title, "properties.yaml", propertiesObj, actionLog);
    utilFunctions.copyTemplateFile("course/package.json", courseObj.title, "package.json", actionLog);
  }
}

export class TopicStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    let obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    obj = { ...obj, ...(await commonPrompts.icon(folderName, actionLog)) };
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `${constants.oldNames.get(element)}.md`, obj, actionLog);
  }
}

export class SegmentStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    const obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `${constants.oldNames.get(element)}.md`, obj, actionLog);
  }
}

export class WebStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    let obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element)),
      ...(await commonPrompts.url(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    obj = { ...obj, ...(await commonPrompts.icon(folderName, actionLog)) };
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `${constants.oldNames.get(element)}.md`, obj, actionLog);
    utilFunctions.writeToTemplate(`${element}/weburl`, folderName, `weburl`, obj, actionLog);
  }
}

export class GithubStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    let obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element)),
      ...(await commonPrompts.url(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    obj = { ...obj, ...(await commonPrompts.icon(folderName, actionLog)) };
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `${constants.oldNames.get(element)}.md`, obj, actionLog);
    utilFunctions.writeToTemplate(`${element}/githubid`, folderName, `githubid`, obj, actionLog);
  }
}

export class ArchiveStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    let obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    obj = { ...obj, ...(await commonPrompts.icon(folderName, actionLog)) };
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `${constants.oldNames.get(element)}.md`, obj, actionLog);
    await utilFunctions.watchForUpload(folderName, "zip file (.zip)", "*.zip", actionLog);
  }
}

export class LabStrategy implements Strategy {
  async execute(element: string, actionLog: string[]): Promise<void> {
    let obj = {
      ...utilFunctions.getFolderCountOfElement(element),
      ...(await commonPrompts.title(element)),
      ...(await commonPrompts.desc(element))
    };
    const folderName = `${obj.folderPrefix}-${obj.title}`;
    utilFunctions.createFolder(folderName, actionLog);
    utilFunctions.createFolder(`${folderName}/img`, actionLog);
    utilFunctions.createFolder(`${folderName}/archives`, actionLog);
    obj = { ...obj, ...(await commonPrompts.icon(folderName, actionLog)) };
    utilFunctions.writeToTemplate(`${element}/${element}.md`, folderName, `00.${obj.title}.md`, obj, actionLog);
  }
}

const strategiesMap = new Map<string, Strategy>([
  ["course", new CourseStrategy()],
  ["topic", new TopicStrategy()],
  ["segment", new SegmentStrategy()],
  ["web link", new WebStrategy()],
  ["github link", new GithubStrategy()],
  ["archive", new ArchiveStrategy()],
  ["lab", new LabStrategy()]
]);

export class Context {
  element: string;
  actionLog: string[];
  strategy: Strategy;

  constructor(element: string) {
    this.element = element;
    this.actionLog = [];
    const strategy = strategiesMap.get(this.element);
    if (!strategy) {
      throw new Error(`Strategy not found for element '${this.element}'`);
    }
    this.strategy = strategy;
  }

  setStrategy(element: string) {
    this.element = element;
    this.actionLog = [];
    const strategy = strategiesMap.get(element);
    if (!strategy) {
      throw new Error(`Strategy not found for element '${element}'`);
    }
    this.strategy = strategy;
  }

  async runStrategy(): Promise<void> {
    console.log(chalk.greenBright(`Build ${this.element}:`));
    await this.strategy.execute(this.element, this.actionLog);
    console.log(chalk.bold.bgYellow(`\n *** Summary *** `));
    this.actionLog.forEach((action) => console.log(chalk.yellow(action)));
    console.log(chalk.greenBright(`\nFinished building ${this.element}`));
  }
}
