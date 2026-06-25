const grid = document.getElementById("works-grid");
const filterBar = document.getElementById("filter-bar");
const status = document.getElementById("works-status");
const updatedAt = document.getElementById("works-updated-at");
let works = [];
let activeCategory = "all";

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderUpdatedAt(value) {
  if (!value) return;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return;

  updatedAt.textContent = `最后更新：${new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date)}`;
}

function renderFilters() {
  filterBar.replaceChildren();
  const categories = new Map();
  works.forEach((work) => categories.set(work.category, work.categoryName));

  const options = [["all", "全部"], ...categories];
  options.forEach(([category, name]) => {
    const button = createElement("button", "filter-btn", name);
    button.type = "button";
    button.dataset.category = category;
    button.classList.toggle("active", category === activeCategory);
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderWorks();
    });
    filterBar.append(button);
  });
}

function renderWorks() {
  grid.innerHTML = "";

  const filteredWorks = activeCategory === "all"
    ? works
    : works.filter((work) => work.category === activeCategory);

  if (filteredWorks.length === 0) {
    grid.append(createElement("p", "empty-state", "这个分类暂时没有公开作品。"));
    return;
  }

  const columns = [createElement("div", "works-column"), createElement("div", "works-column")];
  columns.forEach((column) => grid.append(column));

  filteredWorks.forEach((work, index) => {
    const card = document.createElement("article");
    card.className = "work-card";
    const defaultOpen = work.category === "xiaohongshu";

    const media = createElement("div", "work-media");
    if (work.image) {
      const image = document.createElement("img");
      image.src = work.image;
      image.alt = work.title;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        media.classList.add("is-placeholder");
        media.textContent = "作品预览待上传";
      }, { once: true });
      media.append(image);
    } else {
      media.classList.add("is-placeholder");
      media.textContent = "作品预览待上传";
    }
    card.append(media);

    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "work-summary";
    summary.setAttribute("aria-expanded", String(defaultOpen));

    const info = createElement("div", "work-info");
    const indicator = createElement("span", "work-indicator");
    indicator.textContent = defaultOpen ? "收起作品" : "展开作品";
    info.append(
      createElement("span", "work-meta", `${work.categoryName} · ${work.year}`),
      createElement("h2", "", work.title),
      indicator
    );
    summary.append(info);
    summary.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      summary.setAttribute("aria-expanded", String(isOpen));
      indicator.textContent = isOpen ? "收起作品" : "展开作品";
    });
    card.append(summary);

    if (defaultOpen) {
      card.classList.add("is-open");
    }

    const body = createElement("div", "work-body");
    body.append(createElement("p", "work-description", work.description));

    if (Array.isArray(work.gallery) && work.gallery.length > 0) {
      const gallerySummary = createElement("p", "work-section-label", `图集（${work.gallery.length} 张）`);
      const gallery = createElement("div", "work-gallery");
      gallery.classList.add(`${work.category}-gallery`);
      work.gallery.forEach((source, galleryIndex) => {
        const image = document.createElement("img");
        image.src = source;
        image.alt = `${work.title} ${galleryIndex + 1}`;
        image.loading = "lazy";
        gallery.append(image);
      });
      body.append(gallerySummary, gallery);
    }

    if (work.url) {
      const download = createElement("a", "work-action", "下载 PPT");
      download.href = work.url;
      download.target = "_blank";
      download.rel = "noreferrer";
      body.append(download);
    }

    card.append(body);

    columns[index % 2].append(card);
  });
}

async function loadWorks() {
  try {
    const response = await fetch("data/works.json", { cache: "no-store" });
    if (!response.ok) throw new Error("作品数据无法读取");

    const data = await response.json();
    works = (data.works || [])
      .filter((work) => work.published === true)
      .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
    renderUpdatedAt(data.updatedAt);
    renderFilters();
    renderWorks();
  } catch (error) {
    status.textContent = "作品数据暂时无法加载，请稍后重试。";
  }
}

loadWorks();
