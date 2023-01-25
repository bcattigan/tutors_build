#!/usr/bin/env node
import { program } from "commander";
import { buildCourse } from "./commands/course";
import { buildTopic } from "./commands/topic";
import { buildSegment } from "./commands/segment";
import { buildWeb } from "./commands/web";
import { buildGithub } from "./commands/github";

program.name("Test").description("Testing");

program.option("-c, --course", "build a course", buildCourse);
program.option("-t, --topic", "build a topic", buildTopic);
program.option("-s, --segment", "build a segment", buildSegment);
program.option("-w, --web", "build a web link", buildWeb);
program.option("-g, --github", "build a github link", buildGithub);

program.parse();
