const fs = require('fs');
const path = require('path');

const targetDir = 'D:\\CODE\\personal_project\\chrome-plugins\\streamax-tool\\libs';

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
  {
    src: 'packages/rrweb/dist/rrweb.umd.min.cjs',
    dest: path.join(targetDir, 'rrweb.min.js')
  },
  {
    src: 'packages/rrweb/dist/style.min.css',
    dest: path.join(targetDir, 'rrweb.min.css')
  },
  {
    src: 'packages/rrweb-player/dist/rrweb-player.umd.min.cjs',
    dest: path.join(targetDir, 'rrweb-player.min.js')
  },
  {
    src: 'packages/rrweb-player/dist/style.min.css',
    dest: path.join(targetDir, 'rrweb-player.min.css')
  }
];

files.forEach(({ src, dest }) => {
  try {
    let content = fs.readFileSync(src, 'utf-8');
    // 去掉 sourceMappingURL 注释，避免浏览器找不到 map 文件报错
    content = content.replace(/\/\/[#@]\s*sourceMappingURL=.*$/gm, '');
    content = content.replace(/\/\*[#@]\s*sourceMappingURL=.*?\*\//g, '');
    fs.writeFileSync(dest, content, 'utf-8');
    console.log(`✓ 已复制: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`✗ 复制失败: ${src}`, error.message);
  }
});

console.log('\n所有文件复制完成！');
