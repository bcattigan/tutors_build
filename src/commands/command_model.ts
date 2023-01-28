import { commonPrompts } from "../prompts/common_prompts";
import { getFolderCountOfType, writeToTemplate, watchForUpload } from "../utils/utils";

const oldName = new Map([
  ["topic", "topic"],
  ["segment", "unit"],
  ["web", "web"],
  ["github", "github"],
  ["archive", "archive"]
]);

export async function commandModel(type: string) {
  const url = ["web", "github"];
  let obj: { title: string; desc?: string; link?: string; icon?: object; order?: string; folderPrefix?: string };

  obj = await commonPrompts.title(type);
  if (type != "segment") obj = { ...obj, ...(await commonPrompts.desc(type)) };
  if (url.includes(type)) obj = { ...obj, ...(await commonPrompts.url(type)) };
  if (type != "segment") obj = { ...obj, ...(await commonPrompts.icon()) };
  obj = { ...obj, ...getFolderCountOfType(oldName.get(type)) };
  
  console.log();
  
  const folderName = `${obj.folderPrefix}-${obj.title}`;
  writeToTemplate(`${type}/${type}.md`, obj, folderName);
  if (url.includes(type)) writeToTemplate(`${type}/${type}url`, obj, folderName);
  if (type == "archive") await watchForUpload(folderName, true);
  if (type != "segment" && !("icon" in obj)) await watchForUpload(folderName);
}