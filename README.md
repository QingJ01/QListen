<div align="center">

<img src="/public/logo.svg" alt="QListen Logo" width="120" height="120">

# 轻听音乐 (QListen)

**极简 · 优雅 · 沉浸式**

基于 Next.js 和 TuneHub API 构建的现代化在线音乐播放器

[在线体验](https://music.byebug.cn) · [反馈问题](https://github.com/QingJ01/QListen/issues) · [加入社群](#-加入社群)

</div>

---

## ✨ 核心特性

### 🎨 Apple 设计美学
- 💎 **毛玻璃效果** - 沉浸式视觉体验，模糊背景与内容完美融合
- 🌊 **流畅动画** - 丝滑的页面过渡与交互反馈
- � **像素级精细** - 严格遵循 Apple 设计规范的排版与间距
- 🌗 **智能主题** - 深色/浅色模式自动跟随系统设置

### 🎵 沉浸式播放
- 🎬 **影院级全屏** - 超大封面与歌词展示，专注音乐本身
- 🖼️ **动态封面** - 封面尺寸可达 560px，视觉冲击力十足
- 📝 **逐字歌词** - LRC 格式歌词实时滚动高亮，精准同步
- 🌍 **多源支持** - 网易云音乐、酷我音乐、QQ 音乐等平台

### 📚 强大功能
- 🏆 **发现音乐** - 热门榜单、精选歌单一网打尽
- ❤️ **本地收藏** - 喜爱的歌曲永久保存在本地
- 🔍 **聚合搜索** - 全网搜索，秒速找到心仪歌曲
- 📋 **播放队列** - 灵活的播放列表管理，支持多种播放模式

---

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 15 (App Router) |
| **语言** | TypeScript |
| **样式** | CSS Modules + Tailwind CSS |
| **图标** | Lucide React |
| **API** | [TuneHub API](https://tunehub.sayqz.com/) |
| **状态管理** | React Context + LocalStorage |

---

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm / pnpm / yarn

### 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/QingJ01/QListen.git

# 2. 进入目录
cd QListen

# 3. 安装依赖
npm install

# 4. 配置环境变量
# 复制示例文件并填入 TUNEHUB_API_KEY (必需)
# Mac/Linux: cp .env.example .env.local
# Windows: copy .env.example .env.local

# 5. 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可预览。

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 📸 预览截图

<div align="center">

### 主页
<img width="800" alt="主页" src="https://github.com/user-attachments/assets/1bf15e36-fd1b-40bb-983a-bd5f31403b8e" />

### 最近播放
<img width="800" alt="最近播放" src="https://github.com/user-attachments/assets/15e69ca4-f98b-4bc6-a0b6-5a4a59183db5" />

### 我喜欢
<img width="800" alt="我喜欢" src="https://github.com/user-attachments/assets/db9d83db-954f-4e1f-81b6-a0bdb61c71f6" />

### 搜索
<img width="800" alt="搜索" src="https://github.com/user-attachments/assets/9454170e-9f9c-4864-86d7-17a2227d2800" />

### 播放列表
<img width="800" alt="播放列表" src="https://github.com/user-attachments/assets/341fca76-86fa-4fa7-9f9c-6920f6b00ef9" />

### 全屏播放器
<img width="800" alt="播放器" src="https://github.com/user-attachments/assets/0cded079-8b06-4f36-8716-97eb066f2557" />

</div>

---

## 🤝 加入社群

欢迎加入我们的社群，获取最新动态、反馈问题或参与讨论：

- 📱 **Telegram 频道**: [@QingJG](https://t.me/QingJG)
- 💬 **QQ 交流群**: [点击加入](https://qm.qq.com/cgi-bin/qm/qr?k=S7aiwtH0mCFgzKRiAph-caj4pzpC0QJU&jump_from=webapi)

---

## 📚 开发计划

- [ ] 添加音频可视化效果
- [ ] 支持自定义主题颜色
- [ ] 移动端适配优化
- [ ] PWA 支持

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

---

## 💖 致谢

- **设计与开发**: QingJ & Cluade & Gemini
- **API 支持**: [TuneHub API](https://tunehub.sayqz.com/)
- **灵感来源**: Apple Music

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [QingJ](https://github.com/QingJ01)

</div>
