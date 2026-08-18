#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const translationRoot = join(root, "viewer", "translations", "vi");
const dryRun = process.argv.includes("--dry-run");

// These are English-first terms in Vietnamese developer documentation. The
// source-line check keeps replacements contextual instead of treating every
// Vietnamese word as a technical term.
const rules = [
  { term: "refresh token", source: /\brefresh tokens?\b/gi, targets: [/mã thông báo làm mới/gi, /làm mới token/gi, /token làm mới/gi], allTargets: true },
  { term: "HyperText Transfer Protocol Secure", source: /\bHyperText Transfer Protocol Secure\b/gi, targets: [/HyperText giao thức truyền an toàn/gi, /giao thức truyền HyperText an toàn/gi] },
  { term: "HyperText Transfer Protocol", source: /\bHyperText Transfer Protocol\b/gi, targets: [/HyperText giao thức truyền/gi, /giao thức truyền HyperText/gi] },
  { term: "merge request", source: /\bmerge requests?\b/gi, targets: [/yêu cầu hợp nhất/gi], includePath: /VersionControlSystem\/Git\.md$/, allTargets: true },
  { term: "pull request", source: /\bpull requests?\b/gi, targets: [/yêu cầu kéo/gi], includePath: /VersionControlSystem\/Git\.md$/, allTargets: true },
  { term: "Protocol Buffers", source: /\bprotocol buffers?\b/gi, targets: [/vùng đệm giao thức/gi] },
  { term: "Internet Protocol", source: /\bInternet Protocol\b/gi, targets: [/giao thức Internet/gi] },
  { term: "source code dependency", source: /\bsource code dependenc(?:y|ies)\b/gi, targets: [/phần phụ thuộc source code/gi] },
  { term: "ViewModel dependency", source: /\bViewModel dependenc(?:y|ies)\b/gi, targets: [/phần phụ thuộc ViewModel/gi] },
  { term: "xử lý client request", source: /\bprocess(?:es|ed|ing)? client requests?\b/gi, targets: [/(?:mà )?client process request/gi, /(?:mà )?máy khách process yêu cầu/gi, /yêu cầu (?:của )?máy khách process/gi] },
  { term: "client request", source: /\bclient requests?\b/gi, targets: [/yêu cầu (?:của )?máy khách/gi] },
  { term: "network request", source: /\bnetwork requests?\b/gi, targets: [/yêu cầu (?:của )?mạng/gi] },
  { term: "network response", source: /\bnetwork responses?\b/gi, targets: [/phản hồi (?:của )?mạng/gi] },
  { term: "JSON response", source: /\bJSON responses?\b/gi, targets: [/phản hồi JSON/gi] },
  { term: "nhận được response", source: /\breceives? a response\b/gi, targets: [/nhận được phản hồi/gi] },
  { term: "query request", source: /\bquery requests?\b/gi, targets: [/yêu cầu truy vấn/gi] },
  { term: "log request level", source: /\blog request levels?\b/gi, targets: [/mức yêu cầu nhật ký/gi] },
  { term: "trả response", source: /\b(?:a )?responses?\b/gi, targets: [/phản hồi lại/gi] },
  { term: "Code on demand", source: /\bcode on demand\b/gi, targets: [/mã theo yêu cầu/gi] },
  { term: "web server hay HTTP server", source: /\bweb server or an? HTTP server\b/gi, targets: [/(?:máy chủ|server) web server hoặc HTTP/gi] },
  { term: "HTTP client", source: /\bHTTP clients?\b/gi, targets: [/(?:máy khách|client) HTTP/gi] },
  { term: "API client", source: /\bAPI clients?\b/gi, targets: [/(?:máy khách|client) API/gi] },
  { term: "HTTP server", source: /\bHTTP servers?\b/gi, targets: [/(?:máy chủ|server) HTTP/gi] },
  { term: "web server", source: /\bweb servers?\b/gi, targets: [/(?:máy chủ|server) web/gi] },
  { term: "Bitbucket Server", source: /\bBitbucket Server\b/gi, targets: [/(?:máy chủ|server) Bitbucket/gi] },
  { term: "HTTPS protocol", source: /\bHTTPS protocols?\b/gi, targets: [/(?:giao thức|protocol) HTTPS/gi] },
  { term: "HTTP protocol", source: /\bHTTP protocols?\b/gi, targets: [/(?:giao thức|protocol) HTTP(?!S)/gi] },
  { term: "IP protocol", source: /\bIP protocols?\b/gi, targets: [/(?:giao thức|protocol) IP/gi] },
  { term: "OpenPGP protocol", source: /\bOpenPGP protocols?\b/gi, targets: [/(?:giao thức|protocol) OpenPGP/gi] },
  { term: "network protocol", source: /\bnetwork protocols?\b/gi, targets: [/(?:giao thức|protocol) mạng/gi] },
  { term: "protocol", source: /\bprotocols?\b/gi, targets: [/giao thức/gi] },
  { term: "client", source: /\bclients?\b/gi, targets: [/ứng dụng khách/gi, /máy khách/gi] },
  { term: "client", source: /\bclients?\b/gi, targets: [/khách hàng/gi], exclude: /\bcustomers?\b/i },
  { term: "server", source: /\bservers?\b/gi, targets: [/máy chủ/gi] },
  { term: "request", source: /\brequests?\b/gi, targets: [/yêu cầu/gi], exclude: /\brequest(?:s|ed|ing)?(?: that)? (?:the )?(?:user|another|an action)\b/i },
  { term: "không phản hồi", source: /\bNot Responding\b/gi, targets: [/không response/gi] },
  { term: "response", source: /\bresponses?\b/gi, targets: [/phản hồi/gi], exclude: /\b(?:in response to|Not Responding)\b/i },
  { term: "endpoint", source: /\bendpoints?\b/gi, targets: [/điểm cuối/gi] },
  { term: "payload", source: /\bpayloads?\b/gi, targets: [/tải trọng/gi] },
  { term: "cache", source: /\bcach(?:e|es|ed|ing)\b/gi, targets: [/bộ nhớ đệm/gi] },
  { term: "repository", source: /\brepositor(?:y|ies)\b/gi, targets: [/kho lưu trữ/gi] },
  { term: "dependency", source: /\bdependenc(?:y|ies)\b/gi, targets: [/phần phụ thuộc/gi] },
  { term: "framework", source: /\bframeworks?\b/gi, targets: [/khuôn khổ/gi, /khung(?: công tác)?/gi] },
  { term: "main thread", source: /\bmain threads?\b/gi, targets: [/luồng chính/gi, /thread chính/gi] },
  { term: "Android main thread", source: /\bmain Android thread\b/gi, targets: [/Android thread chính/gi] },
  { term: "main (UI) thread", source: /\bmain \(UI\) thread\b/gi, targets: [/thread chính \(UI\)/gi] },
  { term: "background thread", source: /\bbackground threads?\b/gi, targets: [/(?:chế độ )?nền thread/gi, /luồng nền/gi, /thread nền/gi] },
  { term: "worker thread", source: /\bworker threads?\b/gi, targets: [/luồng công nhân/gi, /thread công nhân/gi, /luồng worker/gi] },
  { term: "UI thread", source: /\bUI threads?\b/gi, targets: [/luồng UI/gi, /thread UI/gi] },
  { term: "I/O thread", source: /\bI\/O threads?\b/gi, targets: [/luồng I\/O/gi] },
  { term: "application thread", source: /\bapplication threads?\b/gi, targets: [/luồng ứng dụng/gi, /thread ứng dụng/gi] },
  { term: "thread", source: /\bthreads?\b/gi, targets: [/luồng/gi], exclude: /\b(?:flows?|streams?)\b/i },
  { term: "process", source: /\bprocess(?:es)?\b/gi, targets: [/tiến trình/gi] },
  { term: "interface", source: /\binterfaces?\b/gi, targets: [/giao diện/gi], exclude: /\b(?:(?:user|graphical|visual) interfaces?|web(?:-based)? interfaces?)\b/i, excludePath: /(?:04_UI_UX|01_UserInterface)\// },
  { term: "callback", source: /\bcallbacks?\b/gi, targets: [/lệnh gọi lại/gi, /cuộc gọi lại/gi, /gọi lại/gi] },
  { term: "listener", source: /\blisteners?\b/gi, targets: [/trình nghe/gi, /người nghe/gi] },
  { term: "handler", source: /\bhandlers?\b/gi, targets: [/trình xử lý/gi] },
  { term: "collection", source: /\bcollections?\b/gi, targets: [/bộ sưu tập/gi] },
  { term: "runtime", source: /\bruntimes?\b/gi, targets: [/thời gian chạy/gi] },
  { term: "compiler", source: /\bcompilers?\b/gi, targets: [/trình biên dịch/gi] },
  { term: "branch", source: /\bbranches?\b/gi, targets: [/chi nhánh/gi, /phân nhánh/gi, /nhánh/gi], includePath: /VersionControlSystem\/Git\.md$/, allTargets: true },
  { term: "commit", source: /\bcommits?\b/gi, targets: [/cam kết/gi], includePath: /VersionControlSystem\/Git\.md$/, allTargets: true },
  { term: "merge", source: /\bmerg(?:e|es|ed|ing)\b/gi, targets: [/sáp nhập/gi, /hợp nhất/gi, /gộp/gi], includePath: /VersionControlSystem\/Git\.md$/, allTargets: true },
];

function markdownFiles() {
  const output = execFileSync("find", [translationRoot, "-type", "f", "-name", "*.md", "-print"], {
    encoding: "utf8",
  });
  return output.trim().split("\n").filter(Boolean).sort();
}

function preserveInitialCase(match, replacement) {
  return match[0] === match[0].toLocaleUpperCase("vi")
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

function replaceLimited(text, pattern, replacement, limit) {
  let count = 0;
  return text.replace(pattern, (match) => {
    if (count >= limit) return match;
    count += 1;
    return preserveInitialCase(match, replacement);
  });
}

function countTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "giu")) ?? []).length;
}

function normalizeLine(sourceLine, translatedLine, path) {
  let normalized = translatedLine;
  for (const rule of rules) {
    if (rule.includePath && !rule.includePath.test(path)) continue;
    if (rule.excludePath?.test(path)) continue;
    if (rule.exclude?.test(sourceLine)) continue;
    const sourceMatches = [...sourceLine.matchAll(rule.source)];
    if (!sourceMatches.length) continue;
    let remaining = rule.allTargets
      ? Number.POSITIVE_INFINITY
      : Math.max(0, sourceMatches.length - countTerm(normalized, rule.term));
    for (const target of rule.targets) {
      if (!remaining) break;
      const before = normalized;
      normalized = replaceLimited(normalized, target, rule.term, remaining);
      remaining -= (before.match(target) ?? []).length;
      if (remaining < 0) remaining = 0;
    }
  }
  return normalized;
}

function splitLines(text) {
  const endings = text.match(/\r\n|\r|\n/g) ?? [];
  const lines = text.split(/\r\n|\r|\n/);
  if (lines.at(-1) === "" && endings.length) lines.pop();
  return { lines, endings };
}

async function main() {
  let changedFiles = 0;
  let changedLines = 0;

  for (const translatedPath of markdownFiles()) {
    const sourcePath = join(root, relative(translationRoot, translatedPath));
    let source;
    try {
      source = await readFile(sourcePath, "utf8");
    } catch {
      continue;
    }

    const translated = await readFile(translatedPath, "utf8");
    const { lines: sourceLines } = splitLines(source);
    const { lines: translatedLines, endings } = splitLines(translated);
    if (sourceLines.length !== translatedLines.length) {
      throw new Error(`Line count differs: ${relative(root, translatedPath)}`);
    }

    let fileChanged = false;
    let inFence = false;
    const normalizedLines = translatedLines.map((line, index) => {
      if (/^[ \t]*(?:```|~~~)/.test(sourceLines[index])) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      const normalized = normalizeLine(sourceLines[index], line, relative(root, translatedPath));
      if (normalized !== line) {
        fileChanged = true;
        changedLines += 1;
        return normalized.replace(/[ \t]+$/, "");
      }
      return normalized;
    });

    if (fileChanged) {
      changedFiles += 1;
      if (!dryRun) {
        const output = normalizedLines.map((line, index) => line + (endings[index] ?? "")).join("");
        await writeFile(translatedPath, output, "utf8");
      }
    }
  }

  console.log(`${dryRun ? "Would update" : "Updated"} ${changedLines} lines in ${changedFiles} files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
