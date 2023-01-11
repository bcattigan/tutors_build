#!/usr/bin/env node
import { program } from "commander";
import { testFunction } from "./commands/test";

program.name("Test").description("Testing");

program.option("-t, --test", "test", testFunction);

program.parse();
