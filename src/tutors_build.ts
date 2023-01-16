#!/usr/bin/env node
import { program } from "commander";
import { buildCourse } from "./commands/course";

program.name("Test").description("Testing");

program.option("-c, --course", "build a course", buildCourse);

program.parse();
