import { confirm, select, log, cancel, text } from "@clack/prompts";

import { FastEdgeTemplates } from "./resources.js";
import { detectPackageManager } from "../utils/detect-package-manager.js";

import {
  availableTemplates,
  CodeLanguage,
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

const templateLanguages = (template: Template): Array<CodeLanguage> => {
  if (template === "") {
    return ["assemblyscript", "javascript", "typescript", "rust"];
  }
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

const availableTemplateOptions = (
  language: CodeLanguage,
): Array<{
  value: Template;
  label: string;
}> => {
  return Object.entries(FastEdgeTemplates)
    .filter(([_, templates]) =>
      templates.some((temp) => temp.language === language),
    )
    .map(([templateName, _]) => ({
      value: templateName as Template,
      label: templateName,
    }));
};

const selectTemplate = async (
  language: CodeLanguage,
  templateArgs: Template,
): Promise<UserInteracted<Template>> => {
  let selectedTemplate = templateArgs;
  if (templateArgs) {
    log.step(`Template: ${selectedTemplate}`);
    return [false, selectedTemplate];
  }
  const templateOptions = availableTemplateOptions(language);
  if (templateOptions.length === 1) {
    selectedTemplate = templateOptions[0].value;
    log.step(`Template: ${selectedTemplate}`);
    return [false, selectedTemplate];
  } else {
    selectedTemplate = (await select({
      message: "Select a template:",
      options: availableTemplateOptions(language),
    })) as Template;
  }
  return [true, selectedTemplate];
};

const getLanguageInput = async (
  availableLangs: Array<CodeLanguage>,
): Promise<UserInteracted<CodeLanguage>> => {
  const userSelectedLang = (await select({
    message: "Select programming language:",
    options: templateLanguageOptions(availableLangs),
  })) as CodeLanguage;
  return [true, userSelectedLang];
};

const validateLanguageSelection = async (
  args: ParsedArgs,
): Promise<UserInteracted<CodeLanguage>> => {
  const providedTemplate = args["--template"] ?? "";
  const availableLangs = templateLanguages(providedTemplate);

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

  if (!selectedLang) {
    const userSelectedLang = await getLanguageInput(availableLangs);
    log.step(`Language: ${userSelectedLang[1]}`);
    return userSelectedLang;
  }

  if (!availableLangs.includes(selectedLang as CodeLanguage)) {
    if (
      availableLangs.includes("assemblyscript") &&
      selectedLang === "typescript"
    ) {
      // Coerce typescript to assemblyscript if that's the only option
      selectedLang = "assemblyscript";
    } else {
      if (providedTemplate) {
        log.warn(
          `The selected template "${providedTemplate}" does not support the provided language "${selectedLang}".`,
        );
      }
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

  const [languageInteracted, language] = await validateLanguageSelection(args);

  const [templateInteracted, template] = await selectTemplate(
    language,
    args["--template"] ?? "",
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
    template,
    language,
    packageManager,
    codespaces: !!args["--codespaces"],
  };
};

export { confirmSetupConfig };
