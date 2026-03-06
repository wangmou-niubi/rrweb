const fs = require('fs');
const path = require('path');

const files = [
  'packages/rrweb-player/dist/rrweb-player.umd.cjs',
  'packages/rrweb-player/dist/rrweb-player.umd.min.cjs',
];

files.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ 文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 在最后的 return module.exports 之前添加代码来解包 default 导出
  const replaced = content.replace(
    /return module\.exports;\s*}\)\)/,
    `// Unwrap default export for easier usage
if (module.exports && module.exports.default) {
  var _default = module.exports.default;
  for (var key in module.exports) {
    if (key !== 'default' && key !== '__esModule') {
      _default[key] = module.exports[key];
    }
  }
  return _default;
}
return module.exports;
}))`
  );
  
  if (replaced !== content) {
    fs.writeFileSync(filePath, replaced, 'utf-8');
    console.log(`✓ 已修复: ${filePath}`);
  } else {
    console.log(`⚠ 未找到匹配模式: ${filePath}`);
  }
});

console.log('\n修复完成！');
