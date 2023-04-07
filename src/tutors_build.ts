#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import { program } from "commander";
import {
  buildAtTopLevel,
  buildAtCourseLevel,
  buildAtCourseOrTopicLevel,
  buildAtTopicLevel,
  buildAtTopicOrUnitLevel,
  buildAtLabLevel,
  buildAtUnitLevel,
  buildAtResourceLevel
} from "./commands/commands";

program.name(chalk.blueBright("\n" + figlet.textSync("Tutors build") + "\n")).description("CLI tool to help scaffold components for the Tutors open source project (tutors.dev)");

program.option("-c, --course", "build a course", () => {
  buildAtTopLevel("course");
});
program.option("-t, --topic", "build a topic", () => {
  buildAtCourseLevel("topic");
});
program.option("-u, --unit", "build a unit", () => {
  buildAtCourseOrTopicLevel("unit");
});
program.option("-su, --sideunit", "build a side-unit", () => {
  buildAtTopicLevel("side unit");
});
program.option("-w, --web", "build a web link", () => {
  buildAtTopicOrUnitLevel("web link");
});
program.option("-g, --github", "build a github link", () => {
  buildAtTopicOrUnitLevel("github link");
});
program.option("-a, --archive", "build an archive", () => {
  buildAtTopicOrUnitLevel("archive");
});
program.option("-l, --lab", "build a lab", () => {
  buildAtTopicOrUnitLevel("lab");
});
program.option("-s, --labstep", "build a lab step", () => {
  buildAtLabLevel("lab step");
});
program.option("-p, --presentation", "build a presentation", () => {
  buildAtTopicOrUnitLevel("presentation");
});
program.option("-n, --note", "build a note", () => {
  buildAtTopicOrUnitLevel("note");
});
program.option("-pp, --panelpresentation", "build a panel presentation", () => {
  buildAtUnitLevel("panel presentation");
});
program.option("-pn, --panelnote", "build a panel note", () => {
  buildAtUnitLevel("panel note");
});
program.option("-pv, --panelvideo", "build a panel video", () => {
  buildAtUnitLevel("panel video");
});
program.option("-v, --video", "add a video to a resource", () => {
  buildAtResourceLevel("video");
});

program.parse();

if (process.argv.length < 3) {
  program.help();
}
