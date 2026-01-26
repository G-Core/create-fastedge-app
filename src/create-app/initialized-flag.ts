/*
 * When root folder has a .devcontainer folder create a .fastedge-inititalized file inside the .devcontainer folder
 * used for tracking initial creation in codespaces - stops re-initialization.
 */

import path from "node:path";
import fs from "node:fs";

const createInitializedFile = async (): Promise<void> => {
  try {
    const devcontainerPath = path.join(process.cwd(), ".devcontainer");
    const flagFilePath = path.join(devcontainerPath, ".codespace-initialized");

    // Check if .devcontainer directory exists
    const devcontainerExists = await fs.promises
      .access(devcontainerPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (devcontainerExists) {
      // Create the .codespace-initialized file
      await fs.promises.writeFile(flagFilePath, "", "utf8");
    }
  } catch {
    // Fail silently if there's an error
  }
};

export { createInitializedFile };
