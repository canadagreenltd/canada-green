import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const root = path.join(__dirname, "..", "src");
const files = walk(root);
const re = /https:\/\/images\.unsplash\.com\/[^"'`\s)]+/g;
const urls = new Set();
const byFile = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(re)) {
    urls.add(m[0]);
    if (!byFile.has(m[0])) byFile.set(m[0], []);
    byFile.get(m[0]).push(path.relative(path.join(__dirname, ".."), file));
  }
}

const broken = [];
let ok = 0;
for (const url of [...urls].sort()) {
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!(res.ok || res.status === 206)) {
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
      });
    }
    if (res.ok || res.status === 206) {
      ok++;
    } else {
      broken.push({ status: res.status, url, files: byFile.get(url) });
    }
  } catch (e) {
    broken.push({ status: "ERR", url, error: e.message, files: byFile.get(url) });
  }
}

console.log(JSON.stringify({ total: urls.size, ok, broken }, null, 2));
