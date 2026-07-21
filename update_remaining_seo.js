const fs = require('fs');
let content = fs.readFileSync('components/ToolSeoSection.tsx', 'utf8');

const additionalTools = {
  "compressor": {
    title: "Image Compressor", subtitle: "Reduce image file size instantly",
    desc: "Compress your JPG, PNG, and WebP images efficiently without losing visible quality using our smart compression algorithm.",
    steps: ["Upload your large image file.", "Select your target compression quality.", "Wait as the algorithm optimizes the image data.", "Download your significantly smaller, high-quality image."]
  },
  "converter": {
    title: "Image Format Converter", subtitle: "Change image formats in seconds",
    desc: "Seamlessly convert your photos between JPG, PNG, WebP, GIF, and other popular formats directly inside your browser.",
    steps: ["Upload your source image.", "Select your desired output format from the dropdown.", "Click convert and wait for processing.", "Download your new formatted image."]
  },
  "circular-crop": {
    title: "Circular Profile Crop", subtitle: "Make perfect round avatars",
    desc: "Crop any photo into a perfect circle instantly. The ideal tool for creating professional profile pictures and circular avatars.",
    steps: ["Upload your portrait or photo.", "Drag and resize the circular crop mask.", "Adjust the positioning until perfect.", "Download the circular image with a transparent background."]
  },
  "aspect-ratio": {
    title: "Aspect Ratio Resizer", subtitle: "Perfectly fit social media dimensions",
    desc: "Easily crop and resize your photos to perfectly match the required aspect ratios for Instagram, Facebook, Twitter, and more.",
    steps: ["Upload your image.", "Select a social media preset or custom ratio.", "Move the crop box over the desired area.", "Download your perfectly sized photo."]
  }
};

for (const [key, data] of Object.entries(additionalTools)) {
  const regex = new RegExp('"' + key + '": \\{[\\s\\S]*?category: "[^"]+",\\n\\s*relatedTools: \\[[^\\]]+\\]\\n\\s*\\},');
  const replacement = '"' + key + '": {\n' +
    '    title: "' + data.title + '",\n' +
    '    subtitle: "' + data.subtitle + '",\n' +
    '    description: "' + data.desc + '",\n' +
    '    steps: [' + data.steps.map(s => '"' + s + '"').join(', ') + '],\n' +
    '    faqs: [\n' +
    '      { question: "Is my image uploaded?", answer: "No, everything is processed securely in your browser." },\n' +
    '      { question: "Is this free?", answer: "Yes, 100% free with no watermarks." }\n' +
    '    ],\n' +
    '    category: "Image Utility",\n' +
    '    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]\n' +
    '  },';
  content = content.replace(regex, replacement);
}

fs.writeFileSync('components/ToolSeoSection.tsx', content);
