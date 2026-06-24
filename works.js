const grid = document.getElementById("works-grid");
const filterBar = document.getElementById("filter-bar");
const status = document.getElementById("works-status");
const updatedAt = document.getElementById("works-updated-at");
const lightbox = createLightbox();
let works = [];
let activeCategory = "all";
let lightboxScale = 1;

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function getFileName(source) {
  return source.split("/").pop() || "portfolio-image.jpg";
}

function createImageButton(source, alt, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.source = source;
  button.dataset.alt = alt;
  button.dataset.filename = getFileName(source);
  button.setAttribute("aria-label", `查看大图：${alt}`);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLightbox(source, alt, button.dataset.filename);
  });
  return button;
}

function createLightbox() {
  const overlay = createElement("div", "lightbox");
  overlay.hidden = true;

  const panel = createElement("div", "lightbox-panel");
  const toolbar = createElement("div", "lightbox-toolbar");
  const zoomOut = createElement("button", "lightbox-btn", "缩小");
  const zoomIn = createElement("button", "lightbox-btn", "放大");
  const download = createElement("a", "lightbox-btn lightbox-download", "下载图片");
  const close = createElement("button", "lightbox-btn lightbox-close", "关闭");
  const stage = createElement("div", "lightbox-stage");
  const image = document.createElement("img");

  zoomOut.type = "button";
  zoomIn.type = "button";
  close.type = "button";
  download.target = "_blank";
  download.rel = "noreferrer";
  image.alt = "";

  stage.append(image);
  toolbar.append(zoomOut, zoomIn, download, close);
  panel.append(toolbar, stage);
  overlay.append(panel);
  document.body.append(overlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeLightbox();
  });

  close.addEventListener("click", closeLightbox);
  zoomIn.addEventListener("click", () => setLightboxScale(lightboxScale + 0.25));
  zoomOut.addEventListener("click", () => setLightboxScale(lightboxScale - 0.25));

  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "+") setLightboxScale(lightboxScale + 0.25);
    if (event.key === "-") setLightboxScale(lightboxScale - 0.25);
  });

  return { overlay, image, download };
}

function setLightboxScale(value) {
  lightboxScale = Math.min(3, Math.max(1, value));
  lightbox.image.style.transform = `scale(${lightboxScale})`;
}

function openLightbox(source, alt, fileName) {
  lightbox.overlay.hidden = false;
  lightbox.overlay.classList.add("is-visible");
  lightbox.image.src = source;
  lightbox.image.alt = alt;
  lightbox.download.href = source;
  lightbox.download.download = fileName;
  setLightboxScale(1);
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.overlay.hidden = true;
  lightbox.overlay.classList.remove("is-visible");
  lightbox.image.removeAttribute("src");
  document.body.classList.remove("lightbox-open");
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

    const media = createElement("div", "work-media");
    if (work.image) {
      const mediaButton = createImageButton(work.image, work.title, "work-media-button");
      const image = document.createElement("img");
      image.src = work.image;
      image.alt = work.title;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        mediaButton.remove();
        media.classList.add("is-placeholder");
        media.textContent = "作品预览待上传";
      }, { once: true });
      mediaButton.append(image);
      media.append(mediaButton);
    } else {
      media.classList.add("is-placeholder");
      media.textContent = "作品预览待上传";
    }
    card.append(media);

    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "work-summary";
    summary.setAttribute("aria-expanded", "false");

    const info = createElement("div", "work-info");
    const indicator = createElement("span", "work-indicator");
    indicator.textContent = "展开作品";
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

    const body = createElement("div", "work-body");
    body.append(createElement("p", "work-description", work.description));

    if (Array.isArray(work.gallery) && work.gallery.length > 0) {
      const gallerySummary = createElement("p", "work-section-label", `图集（${work.gallery.length} 张）`);
      const gallery = createElement("div", "work-gallery");
      gallery.classList.add(`${work.category}-gallery`);
      work.gallery.forEach((source, index) => {
        const button = createImageButton(source, `${work.title} ${index + 1}`, "work-gallery-button");
        const image = document.createElement("img");
        image.src = source;
        image.alt = `${work.title} ${index + 1}`;
        image.loading = "lazy";
        button.append(image);
        gallery.append(button);
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
