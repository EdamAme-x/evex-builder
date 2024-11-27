import { parseArgs } from "@std/cli/parse-args";
import * as colors from "@std/fmt/colors";
import { HELP } from "./consts/help.ts";

const args = parseArgs(Deno.args);

const command = args._[0];

if (command === "build") {
    const filepath = args._[1];
    const target = args["target"];

    if (!filepath) {
      console.error(colors.red(`✘ Missing filepath`));
      Deno.exit(1);
    }

    if (!target) {
      console.error(colors.red(`✘ Missing target`));
      Deno.exit(1);
    }
} else {
  if (command && command !== "help") {
    console.error(colors.red(`✘ Unknown command: ${command}`));
  }
  console.log(HELP);
  Deno.exit(1);
}
