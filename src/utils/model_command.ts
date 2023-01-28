import chalk from "chalk";
import { commonPrompts } from "../prompts/common_prompts";
import { getFolderCountOfType, writeToTemplate, watchForUpload } from "./utils";

const oldName = new Map([
  ["topic", "topic"],
  ["segment", "unit"],
  ["web", "web"],
  ["github", "github"],
  ["archive", "archive"]
]);

export async function modelCommand(type: string) {
  const url = ["web", "github"];
  const noDesc = type != "segment" ? false : true;
  const capitalise = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  let obj: { title: string; desc?: string; link?: string; icon?: object; order?: string; folderPrefix?: string };
  console.log(chalk.greenBright(url.includes(type) ? `Build ${type} link:` : `Build ${type}:`));

  obj = await commonPrompts.titleAndDesc(url.includes(type) ? `${capitalise} link` : capitalise, noDesc);
  if (url.includes(type)) obj = { ...obj, ...(await commonPrompts.url(type)) };
  if (type != "segment") obj = { ...obj, ...(await commonPrompts.icon()) };

  obj = { ...obj, ...getFolderCountOfType(oldName.get(type)) };
  const folderName = `${obj.folderPrefix}-${obj.title}`;
  console.log();
  writeToTemplate(`${type}/${type}.md`, obj, folderName);

  if (url.includes(type)) writeToTemplate(`${type}/${type}url`, obj, folderName);
  if (type == "archive") await watchForUpload(folderName, true);
  if (type != "segment" && !("icon" in obj)) await watchForUpload(folderName);
}
