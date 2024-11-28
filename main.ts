import { parseArgs } from "@std/cli/parse-args";
import * as colors from "@std/fmt/colors";
import { HELP } from "./consts/help.ts";
import { buildTargets } from './consts/build.ts';
import { $ as $dax } from "@david/dax";

const args = parseArgs(Deno.args);

const command = args._[0];

if (command === "build") {
    const filepath = String(args._[1]);

    try {
        await Deno.stat(filepath);
    } catch {
        console.error(colors.red(`✘ File not found: ${filepath}`));
        console.log(HELP);
        Deno.exit(1);
    }

    const filename = filepath.split("/").pop() || "";

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

    const dlxCommands = [
        "npx",
        "pnpx",
        "deno"
    ]

    let command = "";

    if (builder === "porffor") {
        const dlxCommand = dlxCommands.find((c) => $dax.commandExistsSync(c));

        if (!dlxCommand) {
            console.error(colors.red(`✘ No compatible dlx command found.`));
            console.log(colors.yellow(`Try Install: ${dlxCommands.join(" | ")}`));
            console.log(HELP);
            Deno.exit(1);
        }

        command += {
            npx: "npx porffor",
            pnpx: "pnpx porffor",
            deno: "deno run -A npm:porffor"
        }[dlxCommand];

        command += ` ${targetArch} ${filepath} ./${filename.split(".").slice(0, -1).join(".")}.${targetArch}`;
    } else if (builder === "deno") {
        const isExists = $dax.commandExistsSync("deno");

        if (!isExists) {
            console.error(colors.red(`✘ No 'deno' command found.`));
            console.log(colors.yellow(`Try Install: deno`));
            console.log(HELP);
            Deno.exit(1);
        }

        command += `deno compile --allow-all --unstable --no-check --target ${targetArch} ${filepath} --output ./${filename.split(".").slice(0, -1).join(".")}.${targetArch}`;
    }
} else {
  if (command && command !== "help") {
    console.error(colors.red(`✘ Unknown command: ${command}`));
  }
  console.log(HELP);
  Deno.exit(1);
}
