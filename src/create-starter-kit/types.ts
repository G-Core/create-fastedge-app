type ScaffoldTemplateType =
  | "http-base"
  | "cdn-base"
  | "http-react"
  | "http-react-hono";

interface ScaffoldData {
  description: string;
  language: string;
  applicationType: "http" | "cdn";
  files: Record<string, string>;
}

type FastEdgeTemplates = Record<ScaffoldTemplateType, Array<ScaffoldData>>;

export { FastEdgeTemplates, ScaffoldData, ScaffoldTemplateType };
