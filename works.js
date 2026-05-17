const works = [
  {
    title: "城市街头摄影",
    category: "photography",
    categoryName: "摄影作品",
    year: "2026",
    image: "assets/images/photography/photo-2026-001.webp",
    description: "一组关于城市街头、人物关系与日常空间的摄影作品。"
  },
  {
    title: "名创优品出海路径可视化",
    category: "visualization",
    categoryName: "可视化设计",
    year: "2026",
    image: "assets/images/visualization/viz-2026-miniso-001.webp",
    description: "围绕名创优品全球化路径制作的信息可视化作品。"
  },
  {
    title: "大学生证书时间表",
    category: "xiaohongshu",
    categoryName: "小红书图文",
    year: "2026",
    image: "assets/images/xiaohongshu/xhs-2026-certificate-001.webp",
    description: "面向大学生群体的证书报名与考试时间整理图文。"
  },
  {
    title: "纪录片《极致玩家》",
    category: "documentary",
    categoryName: "纪录片项目",
    year: "2026",
    image: "assets/images/documentary/doc-2026-player-001.webp",
    description: "关于狼人杀玩家、桌游空间与兴趣社群的纪录片项目。"
  }
];

const grid = document.getElementById("works-grid");
const buttons = document.querySelectorAll(".filter-btn");

function renderWorks(category = "all") {
  grid.innerHTML = "";

  const filteredWorks = category === "all"
    ? works
    : works.filter(work => work.category === category);

  filteredWorks.forEach(work => {
    const card = document.createElement("article");
    card.className = "work-card";

    card.innerHTML = `
      <img src="${work.image}" alt="${work.title}" loading="lazy">
      <div class="work-info">
        <span>${work.categoryName} · ${work.year}</span>
        <h2>${work.title}</h2>
        <p>${work.description}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderWorks(button.dataset.category);
  });
});

renderWorks();
