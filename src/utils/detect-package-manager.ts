import type { PackageManager } from "../create-app/types.js";

/**
 * Detects the package manager that invoked this script by checking
 * the npm_config_user_agent environment variable.
 *
 * @returns The detected package manager: 'npm', 'pnpm', 'yarn', or 'npm' as default
 *
 * @example
 * // When run with: npx create-fastedge-app
 * detectPackageManager() // => 'npm'
 *
 * @example
 * // When run with: pnpm create fastedge-app
 * detectPackageManager() // => 'pnpm'
 *
 * @example
 * // When run with: yarn create fastedge-app
 * detectPackageManager() // => 'yarn'
 */
export const detectPackageManager = (): PackageManager => {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return "npm";
  }

  if (userAgent.startsWith("pnpm")) {
    return "pnpm";
  }

  if (userAgent.startsWith("yarn")) {
    return "yarn";
  }

  return "npm";
};
