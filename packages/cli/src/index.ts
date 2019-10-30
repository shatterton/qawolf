#!/usr/bin/env node

import { CONFIG } from "@qawolf/config";
import { logger } from "@qawolf/logger";
import program from "commander";
import { snakeCase } from "lodash";
import { record } from "./record";
import { test } from "./test";
import { parseUrl, getUrlRoot } from "./utils";

let recordCommand = program
  .command("record <url> [name]")
  .description("record a workflow and create a test");

if (CONFIG.development) {
  recordCommand = recordCommand.option(
    "-e, --events",
    "save events (for debugging)"
  );
}

recordCommand.action(async (urlArgument, optionalName, cmd) => {
  const url = parseUrl(urlArgument);
  logger.verbose(`record url "${url.href}"`);

  const name = snakeCase(optionalName || getUrlRoot(url));
  await record(url, name, cmd.events);
});

program
  .command("test [name]")
  .description("run a test")
  .action(async optionalName => {
    await test(optionalName);
  });

program.allowUnknownOption(false);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log("\n");
  program.outputHelp();
}