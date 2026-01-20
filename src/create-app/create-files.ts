import path from "node:path";
import fs from "node:fs";

import { SetupConfig } from "./types.js";
import { FastEdgeTemplates } from "./resources.js";

const createTemplateFiles = async (config: SetupConfig): Promise<boolean> => {
  try {
    const templateFiles = FastEdgeTemplates[config.template].find(
      (temp) => temp.language === config.language,
    );

    // create the install directory path if it doesn't exist
    const installDir = path.resolve(process.cwd(), config.directoryPath);

    await fs.promises.mkdir(installDir, { recursive: true });

    if (!templateFiles?.files) {
      throw new Error(
        `No template files found for template "${config.template}" and language "${config.language}".`,
      );
    }
    // Loop through each file in the template and create it in the install directory
    // Convert the files object to an array of { path, content } entries
    const fileEntries = Object.entries(templateFiles.files).map(
      ([path, content]) => ({
        path,
        content,
      }),
    );

    for (const file of fileEntries) {
      const filePath = path.join(installDir, file.path);
      const dirPath = path.dirname(filePath);

      // Create the directory if it doesn't exist
      await fs.promises.mkdir(dirPath, { recursive: true });

      // Write the file content
      await fs.promises.writeFile(filePath, file.content, "utf8");
    }

    return true;
  } catch (error) {
    console.error("Error creating template files:", error);
    return false;
  }
};

export { createTemplateFiles };
