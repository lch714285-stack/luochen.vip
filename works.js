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

  filteredWorks.forEach((work) => {
    const card = work.url ? document.createElement("a") : document.createElement("article");
    card.className = "work-card";
    if (work.url) {
      card.href = work.url;
      card.target = "_blank";
      card.rel = "noreferrer";
    }

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

    const info = createElement("div", "work-info");
    info.append(
      createElement("span", "work-meta", `${work.categoryName} · ${work.year}`),
      createElement("h2", "", work.title),
      createElement("p", "", work.description)
    );
    card.append(media, info);

    grid.appendChild(card);
  });
}

async function loadWorks() {
  try {
    const response = await fetch("data/works.json", { cache: "no-store" });
    if (!response.ok) throw new Error("作品数据无法读取");

    const data = await response.json();
    works = (data.works || [])
      .filter((work) => work.published !== false)
      .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
    renderUpdatedAt(data.updatedAt);
    renderFilters();
    renderWorks();
  } catch (error) {
    status.textContent = "作品数据暂时无法加载，请稍后重试。";
  }
}

loadWorks();
