#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const outputRoot = join(root, "viewer", "translations", "vi");
const force = process.argv.includes("--force");
const concurrency = 16;

const glossary = [
  "access token", "adapter pattern", "Android Runtime", "Android SDK",
  "Application Binary Interface", "Application Programming Interface",
  "architectural pattern", "asynchronous programming", "attack surface",
  "authorization server", "back stack", "background service", "behavioral pattern",
  "best practice", "binary tree", "broadcast receiver", "build tool",
  "builder pattern", "call stack", "callback", "cancellation", "clean architecture",
  "client-server", "code block", "code review", "collection", "command pattern",
  "constructor injection", "field injection", "method injection",
  "companion object", "compiler", "composable function", "composition",
  "composition local", "concurrency", "configuration change", "content provider",
  "context switch", "coroutine builder", "coroutine context", "coroutine scope",
  "cryptographic hash function", "data binding", "data class", "data layer",
  "data structure", "database management system", "deep link", "dependency injection",
  "dependency inversion", "design pattern", "domain layer", "dynamic dispatch",
  "encapsulation", "encryption", "event loop", "exception handling", "factory method",
  "foreground service", "framework", "garbage collector", "generic programming",
  "graph", "hash collision", "hash function", "hash table", "higher-order function",
  "hoisting", "HTTP client", "HTTP message", "HTTP server", "identity provider",
  "immutable", "imperative programming", "infix function", "inheritance",
  "input validation", "interface segregation", "interoperability", "iterator pattern",
  "Java Virtual Machine", "Jetpack Compose", "JSON Web Token", "lambda expression",
  "lazy evaluation", "least privilege", "lifecycle", "lifecycle owner",
  "linked list", "local variable", "memory leak", "method overloading",
  "method overriding", "mobile application", "model-view-controller",
  "model-view-intent", "model-view-presenter", "model-view-viewmodel", "multithreading",
  "mutable", "navigation graph", "null safety", "object declaration",
  "object-oriented programming", "observer pattern", "operator overloading",
  "parallelism", "pending intent", "polymorphism", "procedural programming",
  "process", "programming language", "race condition", "raster graphics",
  "receiver", "recomposition", "recursion", "regular expression", "relational database",
  "repository pattern", "resource server", "responsive design", "runtime",
  "scope function", "sealed class", "separation of concerns", "serialization",
  "shared state", "single source of truth", "single responsibility",
  "software architecture", "software development kit", "software framework",
  "software testing", "source code", "state holder", "state hoisting", "static typing",
  "structured concurrency", "suspending function", "synchronization", "thread",
  "thread pool", "thread safety", "token", "type alias", "type casting",
  "type inference", "type-safe builder", "UI layer", "unidirectional data flow",
  "unit test", "user interface", "vector graphics", "version control system",
  "view binding", "view model", "web server", "web service",
  "Activity", "Activities", "Adapter", "API", "ArrayDeque", "Authentication", "Authorization",
  "Bitmap", "BroadcastReceiver", "Bundle", "Channel", "Clean Architecture",
  "Collection", "Composable", "Compose", "ContentProvider", "Coroutine", "Crashlytics",
  "boilerplate", "DataStore", "Dispatcher", "Drawable", "EditText", "Espresso", "Factory",
  "Facade", "Flow", "Fragment", "Fragments", "Framework",
  "Gradle", "HashMap", "HashSet", "Hilt", "HTML", "HTTP", "HTTPS", "Intent",
  "Interceptor", "JVM", "Kotlin", "Lambda", "LinearLayout", "LiveData", "Manifest",
  "Material Design", "MediaPlayer", "Modifier", "MutableSharedFlow", "MutableStateFlow",
  "Navigation", "OAuth", "Observer", "OkHttp", "OWASP", "Parcelable", "RecyclerView",
  "Repository", "REST", "Room", "SAML", "Scaffold", "SharedFlow",
  "SharedPreferences", "Singleton", "SOLID", "SQLite",
  "StateFlow", "StringBuffer", "TextView", "URI", "URL", "View", "ViewBinding",
  "ViewGroup", "ViewModel", "ViewPager2", "XML"
].sort((a, b) => b.length - a.length);

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

function markdownFiles() {
  const output = execFileSync(
    "find",
    [
      ".",
      "-path", "*/node_modules", "-prune", "-o",
      "-type", "f",
      "-name", "*.md",
      "-not", "-path", "./.git/*",
      "-not", "-path", "./vi/*",
      "-not", "-path", "./viewer/translations/*",
      "-print"
    ],
    { cwd: root, encoding: "utf8" }
  );
  return output.trim().split("\n").filter(Boolean).map((path) => path.slice(2)).sort();
}

function placeholder(index) {
  return `ZXQPH${String(index).padStart(6, "0")}QXZ`;
}

function protectText(input) {
  const values = [];
  const stash = (value) => {
    const key = placeholder(values.length);
    values.push(value);
    return key;
  };

  let text = input;
  text = text.replace(/^(?:```|~~~).*$/gm, stash);
  text = text.replace(/`[^`\n]+`/g, stash);
  text = text.replace(/<!--[\s\S]*?-->/g, stash);
  text = text.replace(/<[^>\n]+>/g, stash);
  text = text.replace(/!?\[[^\]\n]*\]\([^) \n]+[^)\n]*\)/g, stash);
  text = text.replace(/\b(?:https?:\/\/|mailto:)[^\s<>)\]]+/gi, stash);
  text = text.replace(/\b[\w.-]+\.(?:kt|kts|java|xml|json|gradle|md|png|jpg|jpeg|gif|webp|svg|sql)\b/gi, stash);
  text = text.replace(/\b(?:[a-z]+[A-Z][A-Za-z0-9]*|[A-Z][a-z]+[A-Z][A-Za-z0-9]*|[A-Z]{2,}[A-Z0-9_-]*)\b/g, stash);

  for (const term of glossary) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleCaseTerm = /^[A-Z][\w]*(?: [A-Z][\w]*)*$/.test(term);
    const flags = term === term.toUpperCase() || titleCaseTerm ? "g" : "gi";
    text = text.replace(new RegExp(`(?<![\\w])${escaped}(?![\\w])`, flags), stash);
  }

  return {
    text,
    restore(translated) {
      let restored = translated;
      for (let index = values.length - 1; index >= 0; index -= 1) {
        const key = placeholder(index);
        const flexibleKey = new RegExp(
          `Z?XQPH0*${index}QXZ`,
          "gi"
        );
        restored = restored.replace(flexibleKey, values[index]);
      }
      return restored;
    }
  };
}

async function googleTranslate(text) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "vi");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data[0].map((item) => item[0]).join("");
    } catch (error) {
      if (attempt === 6) throw error;
      await delay(500 * (2 ** attempt));
    }
  }
}

function splitLargeBlock(block, maxLength = 3500) {
  if (block.length <= maxLength) return [block];
  const lines = block.split("\n");
  const chunks = [];
  let current = "";
  for (const line of lines) {
    if (current && current.length + line.length + 1 > maxLength) {
      chunks.push(current);
      current = "";
    }
    if (line.length <= maxLength) {
      current += `${current ? "\n" : ""}${line}`;
      continue;
    }
    if (current) chunks.push(current);
    current = "";
    for (let offset = 0; offset < line.length; offset += maxLength) {
      chunks.push(line.slice(offset, offset + maxLength));
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateProse(block) {
  if (!/[A-Za-z]{2}/.test(block)) return block;
  const leading = block.match(/^\s*/)?.[0] ?? "";
  const trailing = block.match(/\s*$/)?.[0] ?? "";
  const core = block.slice(leading.length, block.length - trailing.length);
  if (!core) return block;
  const protectedBlock = protectText(core);
  const translated = await googleTranslate(protectedBlock.text);
  return leading + protectedBlock.restore(translated) + trailing;
}

async function translateMarkdown(source) {
  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const prefix = frontmatter?.[0] ?? "";
  const body = source.slice(prefix.length);
  const pieces = body.split(/(^[ \t]*(?:```|~~~).*?$)/gm);
  const translated = [];
  let inFence = false;

  for (let index = 0; index < pieces.length; index += 1) {
    const piece = pieces[index];
    if (index % 2 === 1) {
      translated.push(piece);
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      translated.push(piece);
      continue;
    }
    const blocks = piece.split(/(\r?\n[ \t]*\r?\n)/);
    for (const block of blocks) {
      if (/^\r?\n[ \t]*\r?\n$/.test(block) || !block) {
        translated.push(block);
        continue;
      }
      for (const chunk of splitLargeBlock(block)) {
        translated.push(await translateProse(chunk));
      }
    }
  }
  return prefix + translated.join("");
}

async function translateFile(path, position, total) {
  const sourcePath = join(root, path);
  const destinationPath = join(outputRoot, path);
  try {
    if (!force) {
      await readFile(destinationPath);
      console.log(`[${position}/${total}] skip ${path}`);
      return;
    }
  } catch {
    // The translated file does not exist yet.
  }

  const source = await readFile(sourcePath, "utf8");
  const translated = await translateMarkdown(source);
  await mkdir(dirname(destinationPath), { recursive: true });
  await writeFile(destinationPath, translated, "utf8");
  console.log(`[${position}/${total}] done ${path}`);
}

async function main() {
  const files = markdownFiles();
  await mkdir(outputRoot, { recursive: true });
  let next = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (next < files.length) {
      const index = next;
      next += 1;
      await translateFile(files[index], index + 1, files.length);
    }
  });
  await Promise.all(workers);
  console.log(`Translated ${files.length} Markdown files into ${relative(root, outputRoot)}${sep}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
