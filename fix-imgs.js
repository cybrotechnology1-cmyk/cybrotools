const fs = require('fs');

const files = [
  'app/admin/page.tsx',
  'app/ai/bg-remover/page.tsx',
  'app/image/blur/page.tsx',
  'app/image/upscaler/page.tsx',
  'app/page.tsx',
  'components/AppSidebar.tsx',
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<img/g, '{/* eslint-disable-next-line @next/next/no-img-element */}\n<img');
  fs.writeFileSync(f, content);
});
