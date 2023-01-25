import chalk from "chalk";
import { commonPrompts } from "../prompts/common_prompts";
import { getFolderCountOfType, writeToTemplate, copyGenericTemplateFile } from "./utils";

const oldName = new Map([
  ["topic", "topic"],
  ["segment", "unit"],
  ["web", "web"],
  ["github", "github"]
]);

export async function modelCommand(type: string, noDesc: boolean, icon: boolean, url: boolean) {
  console.log(chalk.greenBright(url ? `Build a ${type} link:` : `Build a ${type}`));

  let obj: { title: string; desc?: string; link?: string; icon?: object; order?: string; folderPrefix?: string };
  const capitalise = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

  obj = await commonPrompts.titleAndDesc(url ? `${capitalise} link` : capitalise, noDesc);
  if (url) obj = { ...obj, ...(await commonPrompts.url(type)) };
  if (icon) obj = { ...obj, ...(await commonPrompts.icon()) };
  console.log();
  obj = { ...obj, ...getFolderCountOfType(oldName.get(type)) };

  const folderName = `${obj.folderPrefix}-${obj.title}`;
  writeToTemplate(`${type}/${type}.md`, obj, folderName);

  if (url) writeToTemplate(`${type}/${type}url`, obj, folderName);

  if (icon && !("icon" in obj)) {
    copyGenericTemplateFile(`${type}/${type}.png`, folderName);
    await commonPrompts.updateGenericTemplateFile(`${type}.png (.png, .jpg, .jpeg and .gif accepted)`, folderName);
  }
}
