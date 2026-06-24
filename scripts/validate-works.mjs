import { readFile } from "node:fs/promises";

const requiredFields = ["id", "title", "category", "categoryName", "year", "description", "publishedAt"];
const source = new URL("../data/works.json", import.meta.url);
const content = JSON.parse(await readFile(source, "utf8"));
const ids = new Set();

if (!Array.isArray(content.works)) {
  throw new Error("data/works.json 必须包含 works 数组。");
}

for (const [index, work] of content.works.entries()) {
  for (const field of requiredFields) {
    if (!work[field] || typeof work[field] !== "string") {
      throw new Error(`第 ${index + 1} 条作品缺少有效字段：${field}`);
    }
  }

  if (ids.has(work.id)) {
    throw new Error(`作品 id 重复：${work.id}`);
  }
  ids.add(work.id);

  if (Number.isNaN(new Date(work.publishedAt).getTime())) {
    throw new Error(`作品发布日期无效：${work.id}`);
  }
}

console.log(`作品数据有效：${content.works.length} 条，公开 ${content.works.filter((work) => work.published !== false).length} 条。`);
