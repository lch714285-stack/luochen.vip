# luochen.vip

个人作品集静态站点，部署在 GitHub Pages。

## 发布作品

作品页读取 `data/works.json`。一条记录只有在 `published` 为 `true`（或未设置）时才会在网站公开；设为 `false` 可以保留草稿，不会发布。

1. 将封面图放在 `assets/images/<分类>/`，建议使用 WebP、JPG 或 PNG，单张控制在 2 MB 以内。
2. 在 `data/works.json` 的 `works` 数组最前面添加作品信息。`id` 不能重复，`publishedAt` 使用 `YYYY-MM-DD`。
3. 如本机已安装 Node.js，可运行 `npm run validate:works` 预先确认数据有效。
4. 用 GitHub Desktop 提交并推送到 `main`。GitHub 会自动校验作品数据。

GitHub Pages 会在推送后自动发布，通常在数分钟内生效。页面请求作品数据时禁用浏览器缓存，因此部署完成后刷新即可看到最新内容。

示例：

```json
{
  "id": "photo-2026-campus-001",
  "title": "校园影像",
  "category": "photography",
  "categoryName": "摄影作品",
  "year": "2026",
  "image": "assets/images/photography/photo-2026-campus-001.webp",
  "description": "一组关于校园空间与日常人物关系的摄影作品。",
  "published": true,
  "publishedAt": "2026-06-25"
}
```
