const fs = require('fs');

const files = [
  'app/admin/page.tsx',
  'app/image/blur/page.tsx',
  'components/Header.tsx',
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\{\/\* eslint-disable-next-line @next\/next\/no-img-element \*\/\}\n\s*<img/g, '<>\n{/* eslint-disable-next-line @next/next/no-img-element */}\n<img');
  content = content.replace(/(<img[^>]*referrerPolicy="no-referrer"[^>]*>)/g, '$1\n</>');
  // Note: the second replacement might not match perfectly if there's no referrerPolicy or if it's not at the end.
  // A better way is to just use a script to replace the specific lines.
});
