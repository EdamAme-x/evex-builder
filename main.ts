import { parseArgs } from "@std/cli/parse-args";
import * as colors from "@std/fmt/colors";
import { HELP } from "./consts/help.ts";
import { buildTargets } from './consts/build.ts';

const args = parseArgs(Deno.args);

const command = args._[0];

if (command === "build") {
    const filepath = args._[1];
    const target = String(args["target"]) || "auto";

    if (!filepath) {
      console.error(colors.red(`✘ Missing filepath`));
      console.log(HELP);
      Deno.exit(1);
    }
    
    if (!(target in buildTargets)) {
      console.error(colors.red(`✘ Unknown target: ${target}`));
      console.log(HELP);
      Deno.exit(1);
    }

    const [builder, targetArch] = buildTargets[target as keyof typeof buildTargets];

} else {
  if (command && command !== "help") {
    console.error(colors.red(`✘ Unknown command: ${command}`));
  }
  console.log(HELP);
  Deno.exit(1);
}
