import { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleX,
  FileText,
  Folder,
  Languages,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  Sun,
} from "lucide-react";
import { marked } from "marked";
import { cleanPathLabel, documentMap, documents } from "./documents";

const DEFAULT_PATH =
  "ComputerScience/00_Fundamentals/00_Essentials/04_WebTechnologies/00_HTTP.md";

marked.setOptions({ gfm: true, breaks: false });

function getInitialPath() {
  const match = window.location.hash.match(/^#\/doc\/(.+)$/);
  if (match) {
    const path = decodeURIComponent(match[1]);
    if (documentMap.has(path)) return path;
  }
  return documentMap.has(DEFAULT_PATH) ? DEFAULT_PATH : documents[0]?.path;
}

function slugify(text) {
  return text
    .toLocaleLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(markdown) {
  const counts = new Map();
  return [...markdown.matchAll(/^(#{2,4})\s+(.+)$/gm)].map((match) => {
    const label = match[2].replace(/[*_`[\]]/g, "").trim();
    const base = slugify(label) || "section";
    const seen = counts.get(base) || 0;
    counts.set(base, seen + 1);
    return {
      id: seen ? `${base}-${seen}` : base,
      label,
      level: match[1].length,
    };
  });
}

function normalizeDocumentUrl(source, currentPath) {
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(source)) return source;
  if (source.startsWith("/resources/")) return source;
  const base = new URL(currentPath, "https://notes.local/");
  return new URL(source, base).pathname.replace(/^\//, "");
}

function prepareMarkdown(markdown, path) {
  return markdown.replace(
    /(!?\[[^\]]*]\()([^) \t]+)(\s*(?:["'][^"']*["'])?\))/g,
    (full, prefix, source, suffix) => {
      if (/^(https?:|mailto:|tel:|data:|#)/i.test(source)) return full;
      const normalized = normalizeDocumentUrl(source, path).replace(/^\/+/, "");
      const href = normalized.startsWith("resources/")
        ? `/${normalized}`
        : normalized.endsWith(".md")
          ? `#doc:${encodeURIComponent(normalized)}`
          : `/${normalized}`;
      return `${prefix}${href}${suffix}`;
    },
  );
}

function getStoredList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function useMedia(query) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function buildDocumentTree(items) {
  const roots = new Map();

  items.forEach((doc) => {
    const parts = doc.path.split("/");
    const rootKey = parts[0].replace(/\.md$/i, "");
    let node = roots.get(rootKey);

    if (!node) {
      node = {
        key: rootKey,
        label: doc.rootLabel,
        path: rootKey,
        folders: new Map(),
        documents: [],
      };
      roots.set(rootKey, node);
    }

    parts.slice(1, -1).forEach((folder) => {
      const folderPath = `${node.path}/${folder}`;
      let child = node.folders.get(folder);
      if (!child) {
        child = {
          key: folder,
          label: cleanPathLabel(folder),
          path: folderPath,
          folders: new Map(),
          documents: [],
        };
        node.folders.set(folder, child);
      }
      node = child;
    });

    node.documents.push(doc);
  });

  return [...roots.values()];
}

function countFolderDocuments(node) {
  return node.documents.length
    + [...node.folders.values()].reduce(
      (total, child) => total + countFolderDocuments(child),
      0,
    );
}

function FolderSection({
  activePath,
  depth = 0,
  forceOpen = false,
  node,
  onOpen,
}) {
  const containsActive = activePath === node.path
    || activePath.startsWith(`${node.path}/`);
  const shouldOpen = forceOpen || containsActive;
  const [open, setOpen] = useState(shouldOpen);

  useEffect(() => {
    if (shouldOpen) setOpen(true);
  }, [shouldOpen]);

  return (
    <details
      className="folder-section"
      data-depth={depth}
      open={forceOpen || open}
      onToggle={(event) => {
        if (!forceOpen) setOpen(event.currentTarget.open);
      }}
    >
      <summary title={node.path}>
        <span className="folder-summary-label">
          <Folder size={depth === 0 ? 15 : 14} />
          <span>{node.label}</span>
        </span>
        <span className="folder-summary-meta">
          <small>{countFolderDocuments(node)}</small>
          <ChevronDown size={14} />
        </span>
      </summary>
      <div className="folder-contents">
        {node.documents.map((doc) => (
          <button
            key={doc.path}
            className={`document-link ${doc.path === activePath ? "active" : ""}`}
            onClick={() => onOpen(doc.path)}
            title={doc.path}
          >
            <FileText size={13} />
            <span>{doc.title}</span>
          </button>
        ))}
        {[...node.folders.values()].map((child) => (
          <FolderSection
            activePath={activePath}
            depth={depth + 1}
            forceOpen={forceOpen}
            key={child.path}
            node={child}
            onOpen={onOpen}
          />
        ))}
      </div>
    </details>
  );
}

function Sidebar({
  activePath,
  favorites,
  onClose,
  onOpen,
  recent,
  visible,
}) {
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filtered = useMemo(() => {
    if (!normalizedQuery) return documents;
    return documents
      .filter((doc) => doc.searchText.includes(normalizedQuery))
      .slice(0, 80);
  }, [normalizedQuery]);
  const tree = useMemo(() => buildDocumentTree(filtered), [filtered]);

  return (
    <>
      <button
        className={`mobile-backdrop ${visible ? "is-visible" : ""}`}
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className={`sidebar ${visible ? "is-visible" : ""}`}>
        <div className="brand-row">
          <button className="brand" onClick={() => onOpen(documents[0].path)}>
            <span className="brand-mark"><BookOpen size={19} /></span>
            <span>
              <strong>Stack Notes</strong>
              <small>Engineering library</small>
            </span>
          </button>
          <button className="icon-button mobile-only" onClick={onClose} aria-label="Close menu">
            <ChevronLeft size={20} />
          </button>
        </div>

        <label className="search-box">
          <Search size={17} />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 365 notes…"
            aria-label="Search notes"
          />
          {query ? (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <CircleX size={16} />
            </button>
          ) : (
            <kbd>⌘K</kbd>
          )}
        </label>

        {!normalizedQuery && (favorites.length > 0 || recent.length > 0) && (
          <div className="quick-links">
            {favorites.length > 0 && (
              <QuickSection
                icon={<Star size={14} />}
                label="Favorites"
                paths={favorites}
                onOpen={onOpen}
              />
            )}
            {recent.length > 0 && (
              <QuickSection
                icon={<FileText size={14} />}
                label="Recent"
                paths={recent.slice(0, 3)}
                onOpen={onOpen}
              />
            )}
          </div>
        )}

        <div className="library-label">
          <span>{normalizedQuery ? `${filtered.length} results` : "Library"}</span>
          {!normalizedQuery && <span>{documents.length}</span>}
        </div>

        <nav className="document-nav" aria-label="Document library">
          {tree.map((root) => (
            <FolderSection
              activePath={activePath}
              forceOpen={normalizedQuery.length > 0}
              key={root.path}
              node={root}
              onOpen={onOpen}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty-search">
              <Search size={22} />
              <strong>No matching notes</strong>
              <span>Try a broader keyword.</span>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

function QuickSection({ icon, label, onOpen, paths }) {
  return (
    <div className="quick-section">
      <div className="quick-title">{icon}<span>{label}</span></div>
      {paths.map((path) => {
        const doc = documentMap.get(path);
        return doc ? (
          <button key={path} onClick={() => onOpen(path)}>{doc.title}</button>
        ) : null;
      })}
    </div>
  );
}

function TableOfContents({ activeId, headings, onNavigate }) {
  if (!headings.length) return null;
  return (
    <aside className="toc">
      <div className="toc-heading">On this page</div>
      <nav>
        {headings.map((heading) => (
          <a
            className={`${activeId === heading.id ? "active" : ""} level-${heading.level}`}
            href={`#${heading.id}`}
            key={heading.id}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(heading.id);
            }}
          >
            {heading.label}
          </a>
        ))}
      </nav>
      <div className="toc-footer">
        <span>Reading progress</span>
        <div><i id="progress-bar" /></div>
      </div>
    </aside>
  );
}

function App() {
  const isDesktop = useMedia("(min-width: 1100px)");
  const [path, setPath] = useState(getInitialPath);
  const [sidebarOpen, setSidebarOpen] = useState(() => matchMedia("(min-width: 760px)").matches);
  const [desktopSidebar, setDesktopSidebar] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("notes-theme") || "light",
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("notes-language") || "en",
  );
  const [favorites, setFavorites] = useState(() => getStoredList("notes-favorites"));
  const [recent, setRecent] = useState(() => getStoredList("notes-recent"));
  const [activeHeading, setActiveHeading] = useState("");
  const articleRef = useRef(null);
  const doc = documentMap.get(path) || documents[0];
  const hasVietnamese = Boolean(doc.translations.vi);
  const activeLanguage = language === "vi" && hasVietnamese ? "vi" : "en";
  const content = activeLanguage === "vi" ? doc.translations.vi : doc.content;
  const displayTitle =
    content.match(/^#\s+(.+)$/m)?.[1].replace(/[*_`]/g, "").trim() || doc.title;
  const displaySummary = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_[\]`()~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);

  const headings = useMemo(() => extractHeadings(content), [content]);
  const html = useMemo(() => {
    const sanitized = DOMPurify.sanitize(
      marked.parse(prepareMarkdown(content, doc.path)),
    );
    const template = document.createElement("template");
    template.innerHTML = sanitized;
    template.content
      .querySelectorAll("h2, h3, h4")
      .forEach((heading, index) => {
        if (headings[index]) heading.id = headings[index].id;
      });
    return template.innerHTML;
  }, [content, doc.path, headings]);

  const openDocument = (nextPath) => {
    if (!documentMap.has(nextPath)) return;
    setPath(nextPath);
    window.location.hash = `/doc/${encodeURIComponent(nextPath)}`;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (window.innerWidth < 760) setSidebarOpen(false);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("notes-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#111411" : "#f6f4ee",
    );
  }, [theme]);

  useEffect(() => {
    document.title = `${displayTitle} · Stack Notes`;
    const nextRecent = [doc.path, ...recent.filter((item) => item !== doc.path)].slice(0, 8);
    setRecent(nextRecent);
    localStorage.setItem("notes-recent", JSON.stringify(nextRecent));
    // Recent is intentionally updated only when the document path changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.path, displayTitle]);

  useEffect(() => {
    localStorage.setItem("notes-language", language);
    document.documentElement.lang = activeLanguage;
  }, [activeLanguage, language]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const nodes = [...article.querySelectorAll("h2, h3, h4")];
    setActiveHeading(headings[0]?.id || "");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveHeading(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [html, headings]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    article.querySelectorAll("img").forEach((image) => {
      const showFallback = () => {
        if (!image.isConnected) return;
        const fallback = document.createElement("span");
        fallback.className = "broken-image";
        fallback.textContent = `Image unavailable · ${image.src.split("/").pop()}`;
        image.replaceWith(fallback);
      };
      image.addEventListener("error", showFallback, { once: true });
      if (image.complete && image.naturalWidth === 0) showFallback();
    });
    article.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.target = "_blank";
      link.rel = "noreferrer noopener";
    });
  }, [html]);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      const percent = height > 0 ? Math.min(100, (scrollY / height) * 100) : 0;
      document.getElementById("progress-bar")?.style.setProperty("width", `${percent}%`);
    };
    addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => removeEventListener("scroll", updateProgress);
  }, [doc.path]);

  const toggleFavorite = () => {
    const next = favorites.includes(doc.path)
      ? favorites.filter((item) => item !== doc.path)
      : [doc.path, ...favorites];
    setFavorites(next);
    localStorage.setItem("notes-favorites", JSON.stringify(next));
  };

  const navigateToHeading = (headingId) => {
    const heading = document.getElementById(headingId);
    if (!heading) return;

    const topbarHeight =
      document.querySelector(".topbar")?.getBoundingClientRect().height || 64;
    const destination =
      heading.getBoundingClientRect().top + window.scrollY - topbarHeight - 24;

    setActiveHeading(headingId);
    window.scrollTo({
      top: Math.max(0, destination),
      behavior: "smooth",
    });
  };

  const handleArticleClick = async (event) => {
    const copyButton = event.target.closest(".copy-code");
    if (copyButton) {
      const code = copyButton.parentElement.querySelector("code")?.textContent || "";
      await navigator.clipboard.writeText(code);
      copyButton.dataset.copied = "true";
      setTimeout(() => delete copyButton.dataset.copied, 1200);
      return;
    }

    const link = event.target.closest("a");
    if (!link) return;
    const encodedPath = link.getAttribute("href")?.match(/^#doc:(.+)$/)?.[1];
    if (encodedPath) {
      event.preventDefault();
      openDocument(decodeURIComponent(encodedPath));
    }
  };

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    article.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-code")) return;
      const button = document.createElement("button");
      button.className = "copy-code";
      button.type = "button";
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = '<span>Copy</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      pre.appendChild(button);
    });
  }, [html]);

  const currentIndex = documents.findIndex((item) => item.path === doc.path);
  const previous = documents[currentIndex - 1];
  const next = documents[currentIndex + 1];
  const showSidebar = isDesktop ? desktopSidebar : sidebarOpen;

  return (
    <div className={`app-shell ${showSidebar ? "" : "sidebar-collapsed"}`}>
      <Sidebar
        activePath={doc.path}
        favorites={favorites}
        onClose={() => setSidebarOpen(false)}
        onOpen={openDocument}
        recent={recent}
        visible={showSidebar}
      />

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button"
              onClick={() => isDesktop ? setDesktopSidebar(!desktopSidebar) : setSidebarOpen(true)}
              aria-label="Toggle navigation"
            >
              {showSidebar && isDesktop ? <PanelLeftClose size={19} /> : isDesktop ? <PanelLeftOpen size={19} /> : <Menu size={20} />}
            </button>
            <div className="breadcrumbs" title={doc.path}>
              <span>{doc.rootLabel}</span>
              {doc.folder && <><ChevronRight size={14} /><span>{doc.folder.split(" / ").at(-1)}</span></>}
            </div>
          </div>
          <div className="topbar-actions">
            <div
              className="language-toggle"
              title={hasVietnamese ? "Document language" : "Vietnamese translation unavailable"}
            >
              <Languages size={15} />
              <button
                className={activeLanguage === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                className={activeLanguage === "vi" ? "active" : ""}
                disabled={!hasVietnamese}
                onClick={() => setLanguage("vi")}
              >
                VI
              </button>
            </div>
            <button
              className={`icon-button ${favorites.includes(doc.path) ? "is-favorite" : ""}`}
              onClick={toggleFavorite}
              aria-label="Toggle favorite"
              title="Favorite"
            >
              <Star size={18} fill={favorites.includes(doc.path) ? "currentColor" : "none"} />
            </button>
            <button
              className="icon-button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="reading-layout">
          <section className="content-column">
            <div className="article-intro">
              <div className="eyebrow"><FileText size={14} /> Knowledge note</div>
              <h1>{displayTitle}</h1>
              <p>{displaySummary}</p>
              <div className="document-meta">
                <span>{Math.max(1, Math.ceil(content.split(/\s+/).length / 220))} min read</span>
                <i />
                <span>{headings.length} sections</span>
              </div>
            </div>

            {headings.length > 0 && (
              <label className="section-select">
                <span>Jump to section</span>
                <select
                  value={activeHeading}
                  onChange={(event) => {
                    navigateToHeading(event.target.value);
                  }}
                >
                  {headings.map((heading) => (
                    <option key={heading.id} value={heading.id}>
                      {"— ".repeat(Math.max(0, heading.level - 2))}{heading.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <article
              ref={articleRef}
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: html }}
              onClick={handleArticleClick}
            />

            <nav className="page-nav" aria-label="Adjacent documents">
              {previous ? (
                <button onClick={() => openDocument(previous.path)}>
                  <ChevronLeft size={18} />
                  <span><small>Previous</small><strong>{previous.title}</strong></span>
                </button>
              ) : <span />}
              {next && (
                <button className="next" onClick={() => openDocument(next.path)}>
                  <span><small>Next</small><strong>{next.title}</strong></span>
                  <ChevronRight size={18} />
                </button>
              )}
            </nav>
          </section>
          <TableOfContents
            activeId={activeHeading}
            headings={headings}
            onNavigate={navigateToHeading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
