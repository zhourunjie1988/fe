/**
 * 获取所有的语言包，然后生成一个完整的 json 文件
 * 语言包来源于
 * 1. src/locales/*\/zh_CN.ts
 * 2. src/components/*\/locale/zh_CN.ts
 * 3. src/pages/*\/locale/zh_CN.ts
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targets = [
  path.resolve(__dirname, '../src/locales/*/zh_CN.ts'),
  path.resolve(__dirname, '../src/components/*/locale/zh_CN.ts'),
  path.resolve(__dirname, '../src/pages/*/locale/zh_CN.ts'),
];
const allfiles: string[] = [];

targets.forEach((target) => {
  const files = glob.sync(target);
  allfiles.push(...files);
});

const allLocales: any = {};

for await (const file of allfiles) {
  const content = await import(file);
  const arr = file.split('/');
  let localeName = arr[arr.length - 2];
  if (localeName === 'locale') {
    localeName = arr[arr.length - 3];
    const module = arr[arr.length - 4];
    allLocales[module] = allLocales[module] || {};
    allLocales[module][localeName] = content.default;
  } else {
    allLocales[localeName] = content.default;
  }
}

const content = JSON.stringify(allLocales, null, 2);

fs.writeFileSync(path.resolve(__dirname, 'n9e_locale.json'), content);
export {};

// Path: scripts/generate_all_locales.js
