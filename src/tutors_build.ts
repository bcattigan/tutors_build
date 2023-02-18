#!/usr/bin/env node
import { program } from "commander";
import { buildAtTopLevel, buildAtCourseLevel, buildAtTopicLevel, buildAtLabLevel, buildAtUnitLevel} from "./commands/commands";

program.name("tutors-build").description("CLI tool to help scaffold projects for the Tutors open source project (tutors.dev)");

program.option("-c, --course", "build a course", () => {
  buildAtTopLevel("course");
});
program.option("-t, --topic", "build a topic", () => {
  buildAtCourseLevel("topic");
});
program.option("-u, --unit", "build a unit", () => {
  buildAtTopicLevel("unit");
});
program.option("-w, --web", "build a web link", () => {
  buildAtTopicLevel("web link");
});
program.option("-g, --github", "build a github link", () => {
  buildAtTopicLevel("github link");
});
program.option("-a, --archive", "build an archive", () => {
  buildAtTopicLevel("archive");
});
program.option("-l, --lab", "build a lab", () => {
  buildAtTopicLevel("lab");
});
program.option("-s, --labstep", "build a lab step", () => {
  buildAtLabLevel("lab step");
});
program.option("-p, --presentation", "build a presentation", () => {
  buildAtTopicLevel("presentation");
});
program.option("-n, --note", "build a note", () => {
  buildAtTopicLevel("note");
});
program.option("-pp, --panelpresentation", "build a panel presentation", () => {
  buildAtUnitLevel("panel presentation");
});

program.parse();
