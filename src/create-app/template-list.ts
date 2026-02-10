import { FastEdgeTemplates } from "./resources.js";

/**
 * Template metadata for programmatic use
 */
export interface TemplateMetadata {
  name: string;
  description: string;
  languages: string[];
  applicationType: string;
}

/**
 * Generate template list from FastEdgeTemplates (dynamically created from src/assets/)
 *
 * This parses the templates available in the generated FastEdgeTemplates object,
 * which is defined in resources.ts and emitted during build as resources.js.
 * The generated module is imported at runtime from ./resources.js and is based on
 * the actual template files in src/assets/, ensuring the list is always in sync
 *
 * @returns Array of template metadata objects
 */
export function getTemplateList(): TemplateMetadata[] {
  return Object.entries(FastEdgeTemplates).map(([name, variants]) => {
    // Extract unique properties from all language variants
    const languages = Array.from(new Set(variants.map((v) => v.language)));
    const description = variants[0].description; // Same across all variants
    const applicationType = variants[0].applicationType; // Same across all variants

    return {
      name,
      description,
      languages,
      applicationType,
    };
  });
}
