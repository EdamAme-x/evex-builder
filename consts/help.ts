import * as colors from "@std/fmt/colors";
import { buildTargets } from './build.ts';

export const HELP = `
${colors.bgBlue(`📦 Evex CLI`)}

${colors.yellow(`📂 Commands`)}
${
  colors.gray(
    ` ${
      colors.yellow("├──┬─")
    } 🔨 Build: 'evex build <filepath> --target <target>'`,
  )
}
${
    colors.gray(
        ` ${
            colors.yellow("│  └──┬─") 
        } <target>: Target Architecture`,
    )
}
${
    Object.entries(buildTargets).map(([taget, [builder, target]]) => {
        return colors.gray(
            ` ${
                colors.yellow("│     ├────")
            } ${taget}${" ".repeat(12 - taget.length)}: '${target || "auto-detect-arch"}' with ${builder} ${!target && "(default)"}`,
        )
    }).join("\n")
}
${colors.gray(` ${colors.yellow("└──")} 👉 Help:  'evex help'`)}

${colors.gray(`🌐 Support: 'https://evex.land'`)}
`;
