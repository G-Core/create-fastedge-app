import { confirm, select, log, cancel, text } from "@clack/prompts";

import { FastEdgeTemplates } from "./resources.js";
import { detectPackageManager } from "../utils/detect-package-manager.js";

import {
  availableTemplates,
  CodeLanguage,
  MappedTemplate,
  PackageManager,
  ParsedArgs,
  SetupConfig,
  Template,
  UserInteracted,
} from "./types.js";

const relativePath = (fullPath: string): string => {
  if (fullPath === "." || fullPath === "./") {
    return ".";
  }
  if (fullPath.startsWith("./")) {
    return fullPath;
  }
  return `./${fullPath}`;
};

const mapTemplateName = (template: Template): MappedTemplate => {
  switch (template) {
    case "":
    case "http":
      return "http-base";
    case "cdn":
      return "cdn-base";
    default:
      return template;
  }
};

const templateLanguages = (template: MappedTemplate): Array<CodeLanguage> => {
  return FastEdgeTemplates[template].map(
    (temp) => temp.language as CodeLanguage,
  );
};

const templateLanguageOptions = (
  languages: Array<CodeLanguage>,
): Array<{ value: CodeLanguage; label: string }> => {
  const langMap = {
    assemblyscript: "AssemblyScript",
    javascript: "JavaScript",
    typescript: "TypeScript",
    rust: "Rust",
  };
  return languages.map((language) => ({
    value: language,
    label: langMap[language],
  }));
};

const selectTemplate = async (
  templateArgs: Template,
): Promise<UserInteracted<Template>> => {
  let selectedTemplate = templateArgs;
  if (templateArgs) {
    log.step(`Template: ${selectedTemplate}`);
    return [false, selectedTemplate];
  }
  selectedTemplate = (await select({
    message: "Select a template:",
    options: availableTemplates.filter(Boolean).map((template) => ({
      value: template,
      label: template,
    })),
  })) as Template;
  return [true, selectedTemplate];
};

const validateLanguageSelection = async (
  template: Template,
  args: ParsedArgs,
): Promise<UserInteracted<CodeLanguage>> => {
  const mappedTemplate = mapTemplateName(template);
  const availableLangs = templateLanguages(mappedTemplate);

  let selectedLang = "" as CodeLanguage;

  if (args["--javascript"]) {
    selectedLang = "javascript";
  } else if (args["--typescript"]) {
    selectedLang = "typescript";
  } else if (args["--rust"]) {
    selectedLang = "rust";
  } else if (args["--assemblyscript"]) {
    selectedLang = "assemblyscript";
  }

  if (!availableLangs.includes(selectedLang as CodeLanguage)) {
    if (
      availableLangs.includes("assemblyscript") &&
      selectedLang === "typescript"
    ) {
      // Coerce typescript to assemblyscript if that's the only option
      selectedLang = "assemblyscript";
    } else {
      selectedLang = (await select({
        message: "Select programming language:",
        options: templateLanguageOptions(availableLangs),
      })) as CodeLanguage;
      return [true, selectedLang];
    }
  }
  log.step(`Language: ${selectedLang}`);

  return [false, selectedLang];
};

const selectDirectory = async (
  args: ParsedArgs,
): Promise<UserInteracted<string>> => {
  // remove remaning unkown / un-mapped OPTIONS from args
  const remainingArgs = args._.filter((arg) => arg.startsWith("-") === false);

  const hasSingleDirectoryArg = remainingArgs.length === 1;

  let userInteracted = false;
  let pathArg = "./";
  if (hasSingleDirectoryArg) {
    pathArg = relativePath(remainingArgs[0]);
    log.step(`Creating in provided directory: ${pathArg}`);
  } else {
    userInteracted = true;
    pathArg = (await text({
      message: "FastEdge-app will be created at?",
      initialValue: pathArg,
    })) as string;
  }

  return [userInteracted, pathArg];
};

const confirmSetupConfig = async (args: ParsedArgs): Promise<SetupConfig> => {
  // try to infer template from args if not provided
  if (!args["--template"]) {
    for (const template of availableTemplates) {
      if (args._.includes(`--${template}`)) {
        args["--template"] = template;
        break;
      }
    }
  }

  // Detect package manager from environment.
  let packageManager: PackageManager = detectPackageManager();
  // Override detected package manager if user provided a flag
  if (args["--npm"]) {
    packageManager = "npm";
  } else if (args["--pnpm"]) {
    packageManager = "pnpm";
  } else if (args["--yarn"]) {
    packageManager = "yarn";
  }

  const [directoryInteracted, directoryPath] = await selectDirectory(args);

  const [templateInteracted, template] = await selectTemplate(
    args["--template"] ?? "",
  );

  const [languageInteracted, language] = await validateLanguageSelection(
    template,
    args,
  );

  let configConfirmed = true;
  const needsVerification = !args["--no-verify"];

  if (
    needsVerification &&
    !(directoryInteracted && templateInteracted && languageInteracted)
  ) {
    configConfirmed = (await confirm({
      message: "Do you want to continue?",
    })) as boolean;
  }

  if (!configConfirmed) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  return {
    directoryPath,
    template: mapTemplateName(template),
    language,
    packageManager,
  };
};

export { confirmSetupConfig };
