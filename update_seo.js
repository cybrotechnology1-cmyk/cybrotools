const fs = require('fs');

let content = fs.readFileSync('components/ToolSeoSection.tsx', 'utf8');

// Expanded bg-remover
content = content.replace(
  /"bg-remover": \{[\s\S]*?category: "AI Image",\n\s*relatedTools: \["upscaler", "blur", "converter", "compressor"\]\n\s*\},/,
  `"bg-remover": {
    title: "AI Background Remover",
    subtitle: "Instantly remove image backdrops 100% in-browser",
    description: "Our advanced AI-powered background remover is the best free tool to isolate people, products, and objects in milliseconds. Whether you're an e-commerce seller needing clean product photos, a designer creating marketing assets, or just someone making fun profile pictures, our tool works flawlessly. Powered by the state-of-the-art cybro2.50 (Classic cybro AI) model running natively via client-side WebAssembly, your photos stay 100% private and never touch external servers. No watermarks, no sign-ups required, and completely free to use.",
    steps: [
      "Upload your image in JPG, PNG, or WebP format up to 50MB. High resolution is supported.",
      "Wait 2-3 seconds as our locally running neural model perfectly isolates the main subject with hair-level precision.",
      "Optionally select a warm studio, cozy cafe, or lush garden preset backdrop to replace the background.",
      "Adjust the backdrop blur strength or download your transparent cutout instantly in high definition."
    ],
    faqs: [
      {
        question: "Is my image uploaded to any external servers?",
        answer: "Absolutely not. Cybro Tools uses WebAssembly, WebGL, and ONNX Runtime to execute the AI background removal model entirely within your browser's sandboxed environment. Your privacy is 100% guaranteed, making it safe for confidential and personal photos."
      },
      {
        question: "Can I replace the background with a custom image?",
        answer: "Yes! You can choose from our beautiful preset studio backdrops, upload your own custom backdrop picture, or export the image as a transparent PNG for use in other design software."
      },
      {
        question: "Does adjusting backdrop blur create a realistic depth of field?",
        answer: "Yes, our background canvas applies a hardware-accelerated Gaussian blur filter to the backdrop layer before compositing, creating a highly realistic professional DSLR lens blur effect."
      },
      {
        question: "What is the maximum resolution supported?",
        answer: "We support high-definition exports up to 4K resolution, depending on your device's browser memory capacity. There is no artificial downgrading of your image quality."
      },
      {
        question: "Is this tool completely free to use without watermarks?",
        answer: "Yes, the Cybro AI Background Remover is completely free. We do not place any annoying watermarks on your downloaded images, allowing you to use them professionally right away."
      }
    ],
    category: "AI Image",
    relatedTools: ["upscaler", "blur", "converter", "compressor"]
  },`
);

// Expanded upscaler
content = content.replace(
  /"upscaler": \{[\s\S]*?category: "AI Image",\n\s*relatedTools: \["bg-remover", "compressor", "editor", "blur"\]\n\s*\},/,
  `"upscaler": {
    title: "AI Image Upscaler",
    subtitle: "Enhance resolution & reconstruct fine textures using Neural Networks",
    description: "Breathe new life into low-resolution screenshots, old photographs, and digital assets with our free AI Image Upscaler. Our state-of-the-art Super-Resolution technology reconstructs missing high-frequency details, removes ugly JPEG artifacts, and delivers incredibly clean, crisp upscale exports. Unlike traditional resizers that just blur pixels, our AI actually understands the image content to generate realistic textures, making it the perfect tool for restoring old memories or preparing images for large-format printing.",
    steps: [
      "Drag and drop any low-res or blurry image into the workspace. All common image formats are supported.",
      "Select your magnification factor (2x or 4x high-fidelity upscale) based on your needs.",
      "Wait a few seconds as our browser-based neural layers rebuild pixel-perfect borders and textures.",
      "Download your refined, crisp, and clean master file without any watermarks."
    ],
    faqs: [
      {
        question: "How does AI upscaling differ from standard image resizing?",
        answer: "Traditional scaling simply duplicates pixels (nearest neighbor) or averages them (bilinear/bicubic), which results in blurriness and pixelation. AI upscaling uses deep learning models trained on millions of images to predict and generate brand new, sharp textures, lines, and realistic details."
      },
      {
        question: "Is there an image size or aspect ratio restriction?",
        answer: "No, our system accepts any aspect ratio. For optimal performance, we recommend uploading starting files under 2000px wide, as the AI will quadruple the total pixel count."
      },
      {
        question: "Is it safe to upscale sensitive documents or private images?",
        answer: "Yes, since the neural upscaling engine operates entirely on your physical machine via local web threads, your confidential charts, documents, and personal photographs are never uploaded to the cloud."
      },
      {
        question: "Does the upscaler remove noise and artifacts?",
        answer: "Yes, as part of the upscaling process, the AI model automatically identifies and smooths out compression artifacts and digital noise, resulting in a cleaner final image."
      }
    ],
    category: "AI Image",
    relatedTools: ["bg-remover", "compressor", "editor", "blur"]
  },`
);

// Expanded splitter
content = content.replace(
  /"splitter": \{[\s\S]*?category: "Image Processing",\n\s*relatedTools: \["aspect-ratio", "compressor", "converter", "collage"\]\n\s*\},/,
  `"splitter": {
    title: "Grid Image Splitter",
    subtitle: "Split single photos into perfect grids or columns",
    description: "The ultimate free Image Splitter tool perfect for creating stunning Instagram grid layouts, split panoramic grids, or website banner segments. Slice your high-resolution images horizontally and vertically without losing a single pixel of quality. Whether you need a 3x3 grid for your Instagram profile or vertical slices for a seamless carousel post, our intuitive tool makes it effortless. Processed entirely in your browser for maximum privacy and speed.",
    steps: [
      "Upload the image you want to partition from your computer or mobile device.",
      "Configure your split: specify exact columns and rows, or pick a popular social media preset.",
      "Preview the cut lines perfectly overlaid on your graphic instantly.",
      "Download all segmented tiles bundled in a tidy, organized ZIP file for easy posting."
    ],
    faqs: [
      {
        question: "Does splitting an image degrade the output quality?",
        answer: "Not at all. The grid engine utilizes pixel-perfect native canvas slicing matrices, copying exact sub-pixel dimensions to ensure absolutely zero compression or degradation of your original image."
      },
      {
        question: "Can I download individual split tiles separately?",
        answer: "Yes, you can click on individual preview segments to save them one by one, or simply click the 'Download All' button to receive them grouped inside a single ZIP archive."
      },
      {
        question: "What is the best grid size for Instagram?",
        answer: "For an Instagram profile grid, a 3x3 split (9 square images) or 3x1 (3 horizontal images) works best. For seamless swipeable carousel posts, use a 1x3 or 1x4 horizontal split."
      },
      {
        question: "Is there a limit to how many pieces I can split an image into?",
        answer: "While there is technically no hard limit, we recommend staying within a 10x10 grid to ensure the individual resulting images are still of a usable size and resolution."
      }
    ],
    category: "Image Processing",
    relatedTools: ["aspect-ratio", "compressor", "converter", "collage"]
  },`
);

// Expanded blur
content = content.replace(
  /"blur": \{[\s\S]*?category: "Image Processing",\n\s*relatedTools: \["bg-remover", "editor", "watermark", "circular-crop"\]\n\s*\},/,
  `"blur": {
    title: "Image Blur Studio",
    subtitle: "Apply gorgeous depth of field & focal effects",
    description: "Enhance focus, anonymize private details, or create professional photography depth with our free Image Blur Studio. Choose between full-canvas Gaussian blurs, selective radial focal lenses for portrait effects, or boxed pixelation filters to hide sensitive information like faces and license plates. This versatile tool gives you DSLR-like control over your image's depth of field right from your web browser, completely free and 100% private.",
    steps: [
      "Load the image you want to blur or selectively focus.",
      "Choose your blur tool type: smooth Gaussian, Radial Focus for portraits, or Pixelated masking for censoring.",
      "Adjust the blur intensity slider and visually place your focal bounds or masking boxes.",
      "Download your high-depth artistic visual asset or censored image immediately."
    ],
    faqs: [
      {
        question: "How do I create a professional 'Bokeh' background effect?",
        answer: "Choose the Radial Focus style, drag the clear center area over your main subject, and slide up the blur radius. The background will smoothly transition into a gorgeous soft blur while keeping your subject razor-sharp, mimicking an expensive camera lens."
      },
      {
        question: "Can I use this tool to hide faces, license plates, or sensitive info?",
        answer: "Yes, our Box Blur or high-radius pixelation filters are perfect for censoring confidential content before sharing photos online. Simply draw the box over the sensitive area."
      },
      {
        question: "Is the blurring process reversible after downloading?",
        answer: "No, once you download the flattened image, the blurred pixels are permanently altered in the exported file. This ensures maximum security when censoring sensitive information."
      },
      {
        question: "Are my images safe?",
        answer: "Yes! Like all Cybro Tools, the blurring effects are generated entirely using client-side WebGL in your browser. Your images are never sent to a server, ensuring complete privacy."
      }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "editor", "watermark", "circular-crop"]
  },`
);

fs.writeFileSync('components/ToolSeoSection.tsx', content);
