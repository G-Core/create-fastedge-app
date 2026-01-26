import { availableTemplates } from "./available-templates.js";

type Template = (typeof availableTemplates)[number];

type PackageManager = "npm" | "yarn" | "pnpm";

/**
 * Represents the parsed arguments from the CLI.
 */
interface ParsedArgs {
  _: string[];
  "--version"?: boolean;
  "--help"?: boolean;
  "--template"?: Template;
  "--javascript"?: boolean;
  "--assemblyscript"?: boolean;
  "--typescript"?: boolean;
  "--rust"?: boolean;
  "--npm"?: boolean;
  "--pnpm"?: boolean;
  "--yarn"?: boolean;
  // Un-documented options:
  "--no-verify"?: boolean; // for skipping verification steps
  "--codespaces"?: boolean; // for codespaces initialization
}

type CodeLanguage = "assemblyscript" | "javascript" | "typescript" | "rust";

interface SetupConfig {
  directoryPath: string;
  template: Omit<Template, "">;
  language: CodeLanguage;
  packageManager: PackageManager;
  codespaces: boolean;
}

type UserInteracted<T> = [boolean, T];

export { availableTemplates };
export type {
  CodeLanguage,
  PackageManager,
  ParsedArgs,
  SetupConfig,
  Template,
  UserInteracted,
};
