# 自定义修改记录

本项目基于 [rrweb](https://github.com/rrweb-io/rrweb) 进行二次开发和维护。

## 修改历史

### 2026-02-25: 修复 Windows 构建问题

**问题描述：**
在 Windows 系统上运行 `yarn build:all` 时，`rrweb-snapshot` 包构建失败，报错：
```
"default" is not exported by "../utils/dist/utils.js"
```

**根本原因：**
`vite.config.default.ts` 中的 `minifyAndUMDPlugin` 插件在处理路径时使用了硬编码的 Unix 风格路径分隔符 `/`，导致在 Windows 系统（使用 `\` 作为路径分隔符）上路径替换失败。结果 UMD 格式的文件覆盖了 ES 模块格式的 `utils.js` 文件。

**修复方案：**
1. 修改 `vite.config.default.ts` 中的路径处理逻辑
2. 使用正则表达式 `/[\/\\]dist[\/\\]/` 匹配两种路径分隔符
3. 使用 `path.sep` 生成正确的平台特定路径分隔符
4. 添加 `recursive: true` 选项确保目录创建成功

**修改文件：**
- `vite.config.default.ts`

**影响范围：**
- 修复了跨平台构建兼容性问题
- 确保 ES 模块文件不会被 UMD 文件覆盖
- UMD 文件现在正确地放在 `umd` 目录中

## 开发环境

- Node.js: v22.21.1
- Yarn: 1.23.0
- 操作系统: Windows

## 构建命令

```bash
# 安装依赖
yarn install

# 构建所有包
yarn build:all

# 构建单个包
yarn workspace @rrweb/utils build
yarn workspace rrweb-snapshot build
```

## 维护说明

本仓库将持续维护和更新，包括：
- 修复跨平台兼容性问题
- 添加新功能
- 性能优化
- 依赖更新

## 原始项目

- 原始仓库: https://github.com/rrweb-io/rrweb
- 许可证: MIT License
