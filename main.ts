import { parseArgs } from "@std/cli/parse-args";
import * as colors from "@std/fmt/colors";
import { HELP } from "./consts/help.ts";
import { buildTargets } from "./consts/build.ts";
import { $ as $dax } from "@david/dax";

const args = parseArgs(Deno.args);

const command = args._[0];

console.log(colors.bgBlue(`📦 Evex CLI`) + "\n")

if (command === "build") {
    console.log(colors.yellow(`🔨 Builder`) + "\n");

    const filepath = String(args._[1]);

    try {
        await Deno.stat(filepath);
    } catch {
        console.error(colors.red(`✘ File not found: ${filepath}`));
        console.log(HELP);
        Deno.exit(1);
    }

    const filename = filepath.split("/").pop() || "";

    const target = String(args["target"] === true ? "auto" : args["target"]) ||
        "auto";

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

    const [builder, targetArch] =
        buildTargets[target as keyof typeof buildTargets];

    const dlxCommands = [
        "npx",
        "pnpx",
        "deno",
    ];

    let command = "";

    if (builder === "porffor") {
        const ext = filename.split(".").pop() || "";

        if (ext !== "js") {
            console.error(colors.red(`✘ Missing file extension`));
            console.log(colors.yellow(`Only precompiled ".js" files are supported`));
            console.log(HELP);
            Deno.exit(1);
        }

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
            deno: "deno run -A npm:porffor",
        }[dlxCommand];

        command += ` ${targetArch} ${filepath} ./${filename.split(".").slice(0, -1).join(".")
            }.${targetArch}`;
    } else if (builder === "deno") {
        const isExists = $dax.commandExistsSync("deno");

        if (!isExists) {
            console.error(colors.red(`✘ No 'deno' command found.`));
            console.log(colors.yellow(`Try Install: deno`));
            console.log(HELP);
            Deno.exit(1);
        }

        command += `deno compile --allow-all ${args["args"] ? args._.slice(2).join(" ") + " " : ""
            }--no-check --node-modules-dir=auto ${targetArch ? (`--target ${targetArch} `) : ""}${filepath}`;
    }

    console.log(colors.green(`✔ Generated: ${command}`));

    const buildCommand = new Deno.Command(
        command.split(" ").shift() as string,
        {
            args: command.split(" ").slice(1),
            stdin: "inherit",
            stdout: "inherit",
            stderr: "inherit",
        },
    );

    await buildCommand.spawn().output();
} else {
    if (command && command !== "help") {
        console.error(colors.red(`✘ Unknown command: ${command}`));
    }
    console.log(HELP);
    Deno.exit(1);
}
