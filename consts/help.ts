import * as colors from "@std/fmt/colors";

export const HELP = `
${colors.bgBlue(`📦 Evex CLI`)}

${colors.yellow(`📂 Commands`)}
${
  colors.gray(
    ` ${
      colors.yellow("├──")
    } 🔨 Build: 'evex build <filepath> --target <arch>'`,
  )
}
${colors.gray(` ${colors.yellow("└──")} 👉 Help:  'evex help'`)}

${colors.gray(`🌐 Support: 'https://evex.land'`)}
`;
