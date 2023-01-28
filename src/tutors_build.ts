#!/usr/bin/env node
import { program } from "commander";
import { buildCourse } from "./commands/commands";
import { buildTopic, buildAtTopicLevel } from "./commands/commands";

program.name("tutors-build").description("CLI tool to help scaffold projects for the Tutors open source project (tutors.dev)");

program.option("-c, --course", "build a course", buildCourse);
program.option("-t, --topic", "build a topic", buildTopic);
program.option("-s, --segment", "build a segment", () => {
  buildAtTopicLevel("segment");
});
program.option("-w, --web", "build a web link", () => {
  buildAtTopicLevel("web");
});
program.option("-g, --github", "build a github link", () => {
  buildAtTopicLevel("github");
});
program.option("-a, --archive", "build an archive", () => {
  buildAtTopicLevel("archive");
});

program.parse();
