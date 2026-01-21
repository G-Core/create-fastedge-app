const availableTemplates = [
  "http",
  "http-react",
  "http-react-hono",
  "cdn",
  "",
] as const;

type Template = (typeof availableTemplates)[number];

type PackageManager = "npm" | "yarn" | "pnpm";

type MappedTemplate =
  | "http-base"
  | "http-react"
  | "http-react-hono"
  | "cdn-base";

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
  "--no-verify"?: boolean;
  "--npm"?: boolean;
  "--pnpm"?: boolean;
  "--yarn"?: boolean;
}

type CodeLanguage = "assemblyscript" | "javascript" | "typescript" | "rust";

interface SetupConfig {
  directoryPath: string;
  template: MappedTemplate;
  language: CodeLanguage;
  packageManager: PackageManager;
}

type UserInteracted<T> = [boolean, T];

export { availableTemplates };
export type {
  CodeLanguage,
  MappedTemplate,
  PackageManager,
  ParsedArgs,
  SetupConfig,
  Template,
  UserInteracted,
};
