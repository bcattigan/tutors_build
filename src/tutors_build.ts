#!/usr/bin/env node
import { program } from "commander";
import { buildCourse } from "./commands/course";
import { buildTopic } from "./commands/topic";

program.name("Test").description("Testing");

program.option("-c, --course", "build a course", buildCourse);
program.option("-t, --topic", "build a topic", buildTopic);

program.parse();
