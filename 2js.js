const fs = require('fs');

// 生成 JavaScript 代码
const codeToGenerate = `
const isBlocked = blockedUrls.some(pattern => {
    const regex = new RegExp(pattern.replace(/\\*/g, '.*'));
    return regex.test(details.url);
});
console.log(isBlocked);
`;

// 将代码写入文件
fs.writeFileSync('generatedCode.js', codeToGenerate, 'utf-8');

console.log('JavaScript code has been generated and saved to generatedCode.js');
