const markdownModules = import.meta.glob(
  [
    "../../Android/**/*.md",
    "../../ComputerScience/**/*.md",
    "../../General/**/*.md",
    "../../templates.md",
  ],
  { query: "?raw", import: "default", eager: true },
);

const vietnameseModules = import.meta.glob(
  "../translations/vi/**/*.md",
  { query: "?raw", import: "default", eager: true },
);

const vietnameseByPath = new Map(
  Object.entries(vietnameseModules).map(([modulePath, content]) => [
    modulePath.replace("../translations/vi/", ""),
    content,
  ]),
);

const rootLabels = {
  Android: "Android",
  ComputerScience: "Computer Science",
  General: "General",
  templates: "Templates",
};

function cleanName(value) {
  return value
    .replace(/\.md$/i, "")
    .replace(/^\d+[_-]?/, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function titleFromMarkdown(content, path) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading?.replace(/[*_`]/g, "").trim() || cleanName(path.split("/").pop());
}

function summaryFromMarkdown(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_[\]`()~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

export const documents = Object.entries(markdownModules)
  .map(([modulePath, content]) => {
    const path = modulePath.replace("../../", "");
    const parts = path.split("/");
    const root = parts[0].replace(/\.md$/i, "");
    const vietnamese = vietnameseByPath.get(path);
    return {
      path,
      content,
      title: titleFromMarkdown(content, path),
      summary: summaryFromMarkdown(content),
      root,
      rootLabel: rootLabels[root] || cleanName(root),
      folder: parts.slice(1, -1).map(cleanName).join(" / "),
      translations: vietnamese ? { vi: vietnamese } : {},
      searchText: `${path} ${content} ${vietnamese || ""}`.toLocaleLowerCase(),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));

export const documentMap = new Map(documents.map((doc) => [doc.path, doc]));

export function cleanPathLabel(value) {
  return cleanName(value);
}
