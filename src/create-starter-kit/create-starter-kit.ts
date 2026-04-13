import fs from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";
import type { ScaffoldData, ScaffoldTemplateType } from "./types.js";

/**
 * Recursively reads all files in a directory and returns them as a flat object
 * with relative paths as keys and file contents as values
 */
async function readDirectoryFiles(
  dirPath: string,
  basePath: string = dirPath
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively read subdirectory files
        const subFiles = await readDirectoryFiles(fullPath, basePath);
        Object.assign(files, subFiles);
      } else if (entry.isFile()) {
        // Read file content and store with relative path
        const relativePath = path.relative(basePath, fullPath);
        const content = await fs.readFile(fullPath, "utf-8");
        files[relativePath] = content;
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dirPath}:`, error);
  }

  return files;
}

/**
 * Gets all language directories for a given template
 */
async function getLanguageDirectories(templatePath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(templatePath, { withFileTypes: true });
    return entries
      .filter((entry: Dirent) => entry.isDirectory())
      .map((entry: Dirent) => entry.name);
  } catch (error) {
    console.warn(
      `Warning: Could not read template directory ${templatePath}:`,
      error
    );
    return [];
  }
}

/**
 * Creates scaffold data for a specific language template
 */
async function createLanguageScaffold(
  languagePath: string,
  language: string,
  description: string,
  applicationType: "cdn" | "http"
): Promise<ScaffoldData> {
  const files = await readDirectoryFiles(languagePath);

  return {
    description,
    language,
    applicationType,
    files,
  };
}

/**
 * Maps template names to their corresponding folder names
 */
function getTemplateFolderName(name: ScaffoldTemplateType): string {
  // Map template types to their actual folder names
  const templateMap: Record<ScaffoldTemplateType, string> = {
    "http-base": "base-example",
    "http-react": "react-app",
    "http-react-hono": "react-app-hono",
    "cdn-base": "base-example",
  };

  return templateMap[name];
}

/**
 * Reads shared files that should be included in all projects
 */
async function readSharedFiles(): Promise<Record<string, string>> {
  const sharedPath = path.join(process.cwd(), "src", "assets", "shared");

  try {
    const sharedFiles = await readDirectoryFiles(sharedPath);
    return sharedFiles;
  } catch (error) {
    console.warn("Warning: Could not read shared files:", error);
    return {};
  }
}

const createStarterKit = async (
  name: ScaffoldTemplateType,
  description: string,
  applicationType: "cdn" | "http"
): Promise<Array<ScaffoldData>> => {
  const templateFolderName = getTemplateFolderName(name);
  const templatePath = path.join(
    process.cwd(),
    "src",
    "assets",
    applicationType,
    templateFolderName
  );

  // Read shared files (like .claude/skills/)
  const sharedFiles = await readSharedFiles();

  // Get all language directories
  const languages = await getLanguageDirectories(templatePath);

  // Create scaffold data for each language
  const scaffoldPromises = languages.map(async (language) => {
    const languagePath = path.join(templatePath, language);
    const languageScaffold = await createLanguageScaffold(
      languagePath,
      language,
      description,
      applicationType
    );

    // Merge shared files into language-specific files
    return {
      ...languageScaffold,
      files: {
        ...sharedFiles,
        ...languageScaffold.files,
      },
    };
  });

  // Wait for all scaffold data to be created
  const scaffoldData = await Promise.all(scaffoldPromises);

  return scaffoldData;
};

export { createStarterKit };
