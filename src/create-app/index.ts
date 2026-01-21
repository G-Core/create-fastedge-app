import arg from "arg";
import { intro, outro, spinner } from "@clack/prompts";
import child_process from "node:child_process";
import util from "node:util";
import color from "picocolors";

import { printHelp, printVersion } from "./print-info.js";
import { confirmSetupConfig } from "./validate-config.js";

import { availableTemplates, ParsedArgs, Template } from "./types.js";
import { createTemplateFiles } from "src/create-app/create-files.js";

const exec = util.promisify(child_process.exec);
const loader = spinner();

const validateTemplate = (value: string): Template => {
  if (availableTemplates.includes(value as Template)) {
    return value as Template;
  }
  return "";
};

let args: ParsedArgs;

try {
  args = arg(
    {
      // Types
      "--version": Boolean,
      "--help": Boolean,
      "--template": validateTemplate,
      "--javascript": Boolean,
      "--typescript": Boolean,
      "--assemblyscript": Boolean,
      "--rust": Boolean,
      "--no-verify": Boolean,
      "--npm": Boolean,
      "--pnpm": Boolean,
      "--yarn": Boolean,

      // Aliases
      "-v": "--version",
      "-h": "--help",
      "-t": "--template",
      "--js": "--javascript",
      "--as": "--assemblyscript",
      "--ts": "--typescript",
      "--rs": "--rust",
    },
    {
      permissive: true,
    },
  ) as ParsedArgs;
} catch (error) {
  printHelp();
  process.exit(0);
}

if (args["--version"]) {
  printVersion();
  process.exit(0);
}

if (args["--help"]) {
  printHelp();
  process.exit(0);
}

console.log();
intro(color.inverse(" create-fastedge-app "));

const config = await confirmSetupConfig(args);

loader.start("Creating project files...");

await createTemplateFiles(config);
await new Promise((resolve) => setTimeout(resolve, 500));

loader.stop("Project files created.");

if (config.language !== "rust") {
  loader.start(`${config.packageManager} installing dependencies...`);

  await exec(`${config.packageManager} install`, {
    cwd: config.directoryPath,
  });

  loader.stop("Dependencies installed.");
}

// Success message with next steps
console.log();
console.log(color.green("✓ ") + color.bold("Project created successfully!"));
console.log();
console.log(color.dim("Next steps:"));
console.log();
console.log(`  ${color.cyan("cd")} ${config.directoryPath}`);

if (config.language !== "rust") {
  console.log(
    `  ${color.cyan(`${config.packageManager} run dev`)} ${color.dim("# Start development server")}`,
  );
  console.log(
    `  ${color.cyan(`${config.packageManager} run build`)} ${color.dim("# Build for production")}`,
  );
} else {
  console.log(
    `  ${color.cyan("cargo build")} ${color.dim("# Build the project")}`,
  );
}

console.log();
outro(color.dim("Happy coding! 🚀"));
