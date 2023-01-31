#!/usr/bin/env node
import { program } from "commander";
import { buildAtTopLevel, buildAtCourseLevel, buildAtTopicLevel } from "./commands/commands";

program.name("tutors-build").description("CLI tool to help scaffold projects for the Tutors open source project (tutors.dev)");

program.option("-c, --course", "build a course", () => {
  buildAtTopLevel("course");
});
program.option("-t, --topic", "build a topic", () => {
  buildAtCourseLevel("topic");
});
program.option("-s, --segment", "build a segment", () => {
  buildAtTopicLevel("segment");
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

program.parse();
