"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  CheckCircle,
  Lightbulb,
  Clock,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for structural data
interface FAQItem {
  question: string;
  answer: string;
}

interface ToolSeoData {
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  faqs: FAQItem[];
  category: "AI Image" | "Image Processing" | "Web Utility" | "Media Helper";
  relatedTools: string[]; // List of toolIds
}

// Map of all tools metadata
const TOOL_METADATA_MAP: Record<string, ToolSeoData> = {
  "bg-remover": {
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
  },
  "upscaler": {
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
  },
  "ocr": {
    title: "AI OCR Reader",
    subtitle: "Extract selectable text from scans, PDFs, and screenshots",
    description: "An incredibly fast, client-side Optical Character Recognition scanner. Instantly convert static text inside images, documents, receipts, or books into fully searchable and editable rich digital text.",
    steps: [
      "Upload a document photo, receipt scan, or screenshot.",
      "Select your document language context (English, Spanish, etc.) for high accuracy.",
      "Wait a brief moment as our neural character model scans the graphics grid.",
      "Edit, format, or copy the parsed digital output text in one click."
    ],
    faqs: [
      {
        question: "What text languages does Cybro OCR recognize?",
        answer: "Our system natively supports English, French, Spanish, German, Portuguese, Italian, Chinese, and many more, with smart language model fallback layers."
      },
      {
        question: "Does it work with low-quality screenshots or blurry photos?",
        answer: "Yes, our pre-processing filters optimize contrast and eliminate noise before character identification, rendering accurate captures even in sub-optimal conditions."
      },
      {
        question: "Can I extract text containing columns, lists, or structured formats?",
        answer: "Yes, the OCR reader preserves logical horizontal text flows to prevent jumbled lines."
      }
    ],
    category: "AI Image",
    relatedTools: ["bg-remover", "text-on-image", "editor", "splitter"]
  },
  "editor": {
    title: "Professional Image Editor",
    subtitle: "Finetune adjustments, filters, and framing on the fly",
    description: "A fast, streamlined graphics editor loaded with standard adjustments (brightness, exposure, saturation, hue), aesthetic presets, and robust canvas cropping and rotation utilities.",
    steps: [
      "Select an image from your device to launch the editor canvas.",
      "Apply adjustment metrics using the smooth interactive sliders.",
      "Utilize crop overlays to frame, flip, or rotate your layers perfectly.",
      "Export your modified design in pixel-perfect raw fidelity."
    ],
    faqs: [
      {
        question: "Are my adjustments non-destructive?",
        answer: "Yes, all canvas manipulations are layered. You can reset individual controls, preview modifications side-by-side, or clear all changes instantly."
      },
      {
        question: "Does the editor reduce the original resolution of my image?",
        answer: "No, our editor renders operations directly on high-DPI canvas contexts matching your source dimensions, guaranteeing maximum resolution export."
      }
    ],
    category: "Image Processing",
    relatedTools: ["converter", "compressor", "blur", "aspect-ratio"]
  },
  "converter": {
    title: "Image Format Converter",
    subtitle: "Change image formats in seconds",
    description: "Seamlessly convert your photos between JPG, PNG, WebP, GIF, and other popular formats directly inside your browser.",
    steps: ["Upload your source image.", "Select your desired output format from the dropdown.", "Click convert and wait for processing.", "Download your new formatted image."],
    faqs: [
      { question: "Is my image uploaded?", answer: "No, everything is processed securely in your browser." },
      { question: "Is this free?", answer: "Yes, 100% free with no watermarks." }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]
  },
  "compressor": {
    title: "Image Compressor",
    subtitle: "Reduce image file size instantly",
    description: "Compress your JPG, PNG, and WebP images efficiently without losing visible quality using our smart compression algorithm.",
    steps: ["Upload your large image file.", "Select your target compression quality.", "Wait as the algorithm optimizes the image data.", "Download your significantly smaller, high-quality image."],
    faqs: [
      { question: "Is my image uploaded?", answer: "No, everything is processed securely in your browser." },
      { question: "Is this free?", answer: "Yes, 100% free with no watermarks." }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]
  },
  "blur": {
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
  },
  "watermark": {
    title: "Watermark Adder",
    subtitle: "Protect your creative work with text & logo overlays",
    description: "Secure your photographs, digital products, and brand assets in seconds. Add customizable repeating text grids, single copyright icons, or transparent image brand logo overlays.",
    steps: [
      "Select your main visual asset to launch the watermark canvas.",
      "Choose 'Text Watermark' or 'Image Logo' as your security layer.",
      "Fine-tune transparency, rotation, spacing, scale, and positioning.",
      "Export your protected, brand-ready copyright files."
    ],
    faqs: [
      {
        question: "What is the benefit of a Repeating Grid watermark?",
        answer: "Tiled grids prevent unauthorized cropping and are extremely difficult to remove using automated AI background repair programs, providing superior security for preview assets."
      },
      {
        question: "Can I upload custom brand logos with transparency?",
        answer: "Yes! Upload transparent PNG or WebP files as your overlay. Our system preserves transparency values perfectly."
      }
    ],
    category: "Image Processing",
    relatedTools: ["text-on-image", "editor", "meme", "aspect-ratio"]
  },
  "text-on-image": {
    title: "Text on Image Designer",
    subtitle: "Add text blocks, typography overlays, and text wraps",
    description: "Craft social media graphics, quote cards, banners, and digital flyers. Overlay gorgeous stylized typography, apply glowing drop-shadows, and adjust alignment with professional precision.",
    steps: [
      "Upload your backdrop graphic or solid color canvas.",
      "Click to add customizable multi-line text boxes.",
      "Select elegant Google Fonts, weights, letter spacing, colors, and shadows.",
      "Drag and scale text objects to finalize your flyer and download."
    ],
    faqs: [
      {
        question: "Which fonts are supported?",
        answer: "We support a highly curated list of premium Google Fonts, including Inter, Space Grotesk, Playfair Display, Montserrat, and JetBrains Mono."
      },
      {
        question: "Can I add multiple, independent text boxes?",
        answer: "Absolutely. You can add, remove, and layer multiple text elements, customizing individual formatting for each box independently."
      }
    ],
    category: "Image Processing",
    relatedTools: ["meme", "watermark", "collage", "rounded-corners"]
  },
  "meme": {
    title: "Custom Meme Generator",
    subtitle: "Create viral memes using classic templates or custom layouts",
    description: "Turn your funny ideas into internet gold. Load legendary meme templates instantly or upload your own, type classic impact captions, and configure hilarious text overlays.",
    steps: [
      "Select a famous trending template or upload your custom layout.",
      "Enter top/bottom punchlines or create multi-box dialogue fields.",
      "Customize white-on-black impact outlines, font scaling, or emojis.",
      "Export your finished meme to share on social media."
    ],
    faqs: [
      {
        question: "Does this generator put a watermarked logo on my memes?",
        answer: "Never! Cybro Tools believes in absolute creative freedom. Your memes are exported 100% clean and free of watermarks."
      },
      {
        question: "Are the meme templates updated?",
        answer: "Yes, our preset database is consistently curated with highly popular, timeless, and trending meme frames."
      }
    ],
    category: "Image Processing",
    relatedTools: ["text-on-image", "collage", "circular-crop", "editor"]
  },
  "passport": {
    title: "Passport Photo Maker",
    subtitle: "Generate compliant passport photo sheets in seconds",
    description: "Stop spending money at specialized print booths. Align your portrait with official US, EU, or international templates, apply mandatory size constraints, and produce printable high-dpi sheets.",
    steps: [
      "Upload a bright, evenly lit portrait facing straight ahead.",
      "Select your country size preset (e.g., US 2x2 inches, EU 35x45mm).",
      "Align your chin, head crown, and eyes using our guidelines mask.",
      "Download a single optimized cutout or an aligned multi-photo print sheet."
    ],
    faqs: [
      {
        question: "What are the rules for a valid passport photo?",
        answer: "Your eyes must look directly at the lens, your facial expression should be neutral, lighting must be balanced with no shadows, and the background must be plain white or light off-white."
      },
      {
        question: "What is the DPI resolution of the export sheets?",
        answer: "We compile print layouts at a professional print resolution of 300 DPI, ensuring zero graininess when printed on photo paper."
      }
    ],
    category: "Image Processing",
    relatedTools: ["id-photo", "bg-remover", "circular-crop", "rounded-corners"]
  },
  "id-photo": {
    title: "ID Photo Creator",
    subtitle: "Produce custom identification & badge layout assets",
    description: "Quickly resize, clip, and compose portrait photos matching standard company badges, driving licenses, student cards, or membership passes with precise centimeter specifications.",
    steps: [
      "Select your portrait image with clean forward-facing orientation.",
      "Choose your ID badge dimensions or set custom width/height in mm.",
      "Position your face perfectly in the centering frame template.",
      "Save your calibrated ID digital asset and printable grid sheets."
    ],
    faqs: [
      {
        question: "How does the custom millimeter dimension tool work?",
        answer: "Enter your exact target physical width and height in millimeters. Our system uses standardized browser DPI ratios to lock the canvas dimensions for perfect physical prints."
      },
      {
        question: "Can I remove my home background and replace it with compliance blue?",
        answer: "Yes, we recommend using our AI Background Remover first to isolate your portrait, and then cropping it here with our solid backdrop options."
      }
    ],
    category: "Image Processing",
    relatedTools: ["passport", "bg-remover", "circular-crop", "aspect-ratio"]
  },
  "collage": {
    title: "Premium Collage Maker",
    subtitle: "Combine multiple photographs into striking layouts",
    description: "Assemble family collages, design mood boards, or combine product frames. Select from multiple asymmetric and symmetric layouts, configure border gaps, and set corner roundness.",
    steps: [
      "Upload from 2 to 12 images you want to assemble.",
      "Select from our list of beautifully proportioned grid patterns.",
      "Adjust border width, margin padding, gap colors, and corner radius.",
      "Download your high-resolution compiled grid compilation."
    ],
    faqs: [
      {
        question: "Can I rearrange the positions of images in the collage grid?",
        answer: "Yes, you can easily drag-and-drop or swap image slots, zoom, and reposition each photo individually within its grid boundary."
      },
      {
        question: "What output file dimensions are supported?",
        answer: "We support high-definition outputs matching standard poster (16:9), Instagram Square (1:1), or Portrait (4:5) frames."
      }
    ],
    category: "Image Processing",
    relatedTools: ["editor", "text-on-image", "rounded-corners", "aspect-ratio"]
  },
  "splitter": {
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
  },
  "aspect-ratio": {
    title: "Aspect Ratio Resizer",
    subtitle: "Perfectly fit social media dimensions",
    description: "Easily crop and resize your photos to perfectly match the required aspect ratios for Instagram, Facebook, Twitter, and more.",
    steps: ["Upload your image.", "Select a social media preset or custom ratio.", "Move the crop box over the desired area.", "Download your perfectly sized photo."],
    faqs: [
      { question: "Is my image uploaded?", answer: "No, everything is processed securely in your browser." },
      { question: "Is this free?", answer: "Yes, 100% free with no watermarks." }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]
  },
  "circular-crop": {
    title: "Circular Profile Crop",
    subtitle: "Make perfect round avatars",
    description: "Crop any photo into a perfect circle instantly. The ideal tool for creating professional profile pictures and circular avatars.",
    steps: ["Upload your portrait or photo.", "Drag and resize the circular crop mask.", "Adjust the positioning until perfect.", "Download the circular image with a transparent background."],
    faqs: [
      { question: "Is my image uploaded?", answer: "No, everything is processed securely in your browser." },
      { question: "Is this free?", answer: "Yes, 100% free with no watermarks." }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]
  },
  "rounded-corners": {
    title: "Rounded Corner Generator",
    subtitle: "Add curved, smooth border corners to any image",
    description: "Soften the edges of your screenshots, web templates, or slides. Soften borders with smooth corner curvature and keep margins perfectly transparent.",
    steps: [
      "Select your image asset to load onto the canvas.",
      "Use our pixel slider to choose the perfect curve radius.",
      "Choose transparent corners or match your target container background.",
      "Download your smooth-bordered asset in WebP or PNG format."
    ],
    faqs: [
      {
        question: "Can I choose which specific corners to round?",
        answer: "By default, our tool rounds all four corners symmetrically for balanced visual aesthetics, but we also support independent corner selection."
      },
      {
        question: "Does it work on vertical banners or panorama shots?",
        answer: "Yes, the corner curvature algorithm dynamically fits the radius to any height or width dimension seamlessly."
      }
    ],
    category: "Image Processing",
    relatedTools: ["circular-crop", "aspect-ratio", "converter", "collage"]
  },
  "text-utils": {
    title: "Advanced Text Utilities",
    subtitle: "Diff comparator, word counter, and placeholder generator",
    description: "Our comprehensive Text Utilities package offers an in-browser word counter, visual text difference comparator, and mock content generator. Ideal for copywriters, developers, and editors needing fast text validation.",
    steps: [
      "Select the desired text tab (Word Counter, Text Diff, or Lorem Ipsum).",
      "Paste your text or original/edited versions into the fields.",
      "View instant character, word, and reading-time metrics, or color-coded diff comparisons.",
      "Copy your formatted outputs or generated mock paragraphs to the clipboard in one click."
    ],
    faqs: [
      { question: "How does the Text Diff tool work?", answer: "It compares word-by-word, highlighting additions in green and deletions in red." },
      { question: "Is my text data private?", answer: "Yes, all processing and comparisons are done 100% locally in your browser. No text is ever sent to servers." }
    ],
    category: "Web Utility",
    relatedTools: ["word-counter", "password", "dev-utils"]
  },
  "password": {
    title: "Secure Password Generator",
    subtitle: "Generate cryptographically secure passwords locally",
    description: "Generate unbreakable, random passwords using standard cryptographic libraries natively in your browser. Customize lengths, characters, and check your password's entropy and strength.",
    steps: [
      "Set your desired password length using the slider.",
      "Toggle character options like uppercase letters, numbers, and special symbols.",
      "Review the live password strength meter and entropy calculation.",
      "Copy your secure, randomized password safely."
    ],
    faqs: [
      { question: "Are my passwords saved anywhere?", answer: "Never. Your passwords are generated locally on your device and are never sent to any server or recorded." },
      { question: "What is entropy?", answer: "Entropy measures the randomness of the password in bits. Higher entropy means it's exponentially harder for hackers to brute-force." }
    ],
    category: "Web Utility",
    relatedTools: ["dev-utils", "text-utils"]
  },
  "dev-utils": {
    title: "Developer Utilities & Formatters",
    subtitle: "JSON validator, Base64 encoder, and URL decoder",
    description: "A lightweight suite of essential developer tools including a real-time JSON formatter/validator, safe Base64 encoder/decoder, and URL encoder/decoder.",
    steps: [
      "Choose your desired developer utility (JSON Formatter, Base64, or URL Encode/Decode).",
      "Paste your raw data or code snippet into the input area.",
      "The tool instantly validates, structures, formats, or decodes your input.",
      "Copy the clean formatted output directly to your code editor."
    ],
    faqs: [
      { question: "Does the JSON formatter validate syntax errors?", answer: "Yes, it provides clear syntax error indicators and auto-indents your JSON for maximum legibility." },
      { question: "Is it safe to decode private API payloads?", answer: "100% safe. Since all processing runs locally on your machine, your API keys and tokens are never exposed." }
    ],
    category: "Web Utility",
    relatedTools: ["password", "color-converter", "generators"]
  },
  "generators": {
    title: "Smart QR Code & Asset Generators",
    subtitle: "Generate high-resolution custom QR codes instantly",
    description: "Create fully customizable, clean QR codes for URLs, text, Wi-Fi networks, and contact info. Export them in high-quality SVG or PNG formats for digital or print media.",
    steps: [
      "Select your QR code input type (URL, Email, Wi-Fi, or plain text).",
      "Type or paste your information into the dynamic generator.",
      "Choose custom colors and adjust dot size/margin parameters.",
      "Download your high-resolution vector QR code instantly."
    ],
    faqs: [
      { question: "Can I use these QR codes for commercial printing?", answer: "Yes, the generated QR codes are exported as clean high-resolution vectors suitable for print and physical banners." },
      { question: "Are there scan limits on the generated codes?", answer: "No, these are standard static QR codes with no scan limits, expiry dates, or tracking scripts." }
    ],
    category: "Web Utility",
    relatedTools: ["dev-utils", "color-tools"]
  },
  "color-converter": {
    title: "Color Format Converter",
    subtitle: "Convert HEX, RGB, HSL, and CMYK formats",
    description: "Seamlessly translate color definitions between HEX, RGB, HSL, and CMYK formats. Features a live visual color picker and color preview for designers and developers.",
    steps: [
      "Use the color picker or input a color code (HEX, RGB, or HSL).",
      "View real-time, matching values across all other color formats instantly.",
      "Adjust individual saturation, hue, and brightness channels.",
      "Copy any of the standardized color codes with a single click."
    ],
    faqs: [
      { question: "Are CMYK values accurate for professional printing?", answer: "Yes, our converter uses standardized color conversion matrices to provide highly accurate RGB-to-CMYK translations." },
      { question: "Does it support transparency or alpha channels?", answer: "Yes, RGBA and HSLA alpha transparency channels are fully supported and mapped cleanly." }
    ],
    category: "Web Utility",
    relatedTools: ["color-tools", "dev-utils"]
  },
  "word-counter": {
    title: "Professional Word & Character Counter",
    subtitle: "Track words, characters, sentences, and reading time",
    description: "A clean, high-precision text analyzer that tracks words, characters, paragraphs, average sentence length, and estimates read time for authors and copywriters.",
    steps: [
      "Type or paste your content into the spacious text editor area.",
      "The counter dynamically updates statistics with zero delay.",
      "Review sentences, reading-time estimates, and paragraph counts.",
      "Save your work or copy the analyzed text cleanly."
    ],
    faqs: [
      { question: "Does it filter extra spaces or punctuation?", answer: "Yes, our smart parsing engine filters out double-spacing and non-printable characters for 100% accurate word counting." },
      { question: "Can it estimate speaking time vs reading time?", answer: "Yes, it estimates reading time based on a standard 200 words-per-minute average." }
    ],
    category: "Web Utility",
    relatedTools: ["text-utils", "password"]
  },
  "color-tools": {
    title: "Palette Generator & Color Extractions",
    subtitle: "Generate beautiful, matching color palettes",
    description: "Extract color palettes from images, generate complementary color matching wheels, and analyze contrast ratios to build beautiful web interfaces.",
    steps: [
      "Upload an image to extract its primary vibrant colors, or click generate for a random palette.",
      "Lock individual colors and generate harmonious matching shades.",
      "Check contrast ratios to ensure accessibility compliance.",
      "Export your palette as a list of HEX codes or Tailwind classes."
    ],
    faqs: [
      { question: "How does image color extraction work?", answer: "It uses a localized k-means clustering algorithm on a canvas element to find the dominant colors in your image." },
      { question: "Does it verify WCAG accessibility?", answer: "Yes, it calculates contrast ratios between text and background colors to ensure your designs are accessible." }
    ],
    category: "Web Utility",
    relatedTools: ["color-converter", "generators"]
  },
  "embed": {
    title: "YouTube Video ID Finder & Embed Generator",
    subtitle: "Extract video IDs and generate clean embed code",
    description: "Instantly parse any YouTube URL to find its direct video ID, shortcode, channel tag, and generate clean, responsive iframe embed code without tracking cookies.",
    steps: [
      "Paste any YouTube video URL, short link, or mobile sharing link.",
      "The tool extracts the absolute Video ID instantly.",
      "Configure your custom player choices (autoplay, controls, start time).",
      "Copy the clean responsive iframe embed code directly."
    ],
    faqs: [
      { question: "Does this support YouTube Shorts and Live streams?", answer: "Yes, it perfectly parses standard videos, YouTube Shorts, mobile link formats, and live stream URLs." },
      { question: "What is privacy-enhanced embedding?", answer: "It generates embeds using 'youtube-nocookie.com' to prevent Google from tracking visitors on your webpage." }
    ],
    category: "Media Helper",
    relatedTools: ["thumbnail"]
  },
  "thumbnail": {
    title: "YouTube Thumbnail Downloader",
    subtitle: "Download high-quality YouTube thumbnails instantly",
    description: "Extract and download all available thumbnail quality levels (Full HD, High, Medium, Default) for any YouTube video in seconds.",
    steps: [
      "Enter or paste any valid YouTube video link.",
      "Wait as our parser extracts all available thumbnail resolutions.",
      "Select your preferred resolution (up to Maximum Resolution 1080p).",
      "Download the thumbnail directly in JPEG format to your local drive."
    ],
    faqs: [
      { question: "Can I download 1080p Full HD thumbnails?", answer: "Yes, if the video creator uploaded a high-resolution video, the Max Resolution (1080p) thumbnail will be available for download." },
      { question: "Is this tool completely free?", answer: "Yes, downloading any YouTube thumbnail is 100% free with unlimited extractions." }
    ],
    category: "Media Helper",
    relatedTools: ["embed"]
  },
  "channel-id": {
    title: "YouTube Channel ID Finder",
    subtitle: "Find the unique Channel ID for any YouTube channel or creator",
    description: "Easily extract the unique 24-character YouTube Channel ID (starting with UC) from any channel URL, handle, or username instantly.",
    steps: [
      "Paste any YouTube channel link, handle (e.g. @username), or custom URL.",
      "Click the Find Channel ID button to begin extraction.",
      "The tool analyzes public channel metadata and extracts the secure UC channel key.",
      "Copy the unique Channel ID to your clipboard instantly for API development, RSS feeds, or SEO integration."
    ],
    faqs: [
      { question: "Can I find Channel IDs using usernames or custom handles?", answer: "Yes, you can enter any channel handle starting with @, custom URL, or standard channel link, and our extractor will resolve it." },
      { question: "Why do I need a YouTube Channel ID?", answer: "Channel IDs are critical for developers using the YouTube API, creating custom RSS feeds, integrating third-party tools, or configuring tracking pixels." }
    ],
    category: "Media Helper",
    relatedTools: ["embed", "thumbnail"]
  }
};

// Static Blog Articles Reference
const RELEVANT_BLOG_ARTICLES = [
  {
    title: "How We Removed Image Backgrounds Instantly & Locally with cybro2.50 (Classic cybro AI)",
    excerpt: "Learn how we use advanced ONNX Runtime Web and WebGL inside Web Workers to perform AI background removal 100% in your browser safely.",
    category: "AI Image",
    readTime: "4 min read",
    href: "/blog"
  },
  {
    title: "Deep Dive into Browser-based Image Cropping & Ratio Math",
    excerpt: "Discover the inner workings of canvas-based responsive cropping, aspect ratio math, and native clipping matrices without external libraries.",
    category: "Image Processing",
    readTime: "5 min read",
    href: "/blog"
  }
];

interface ToolSeoSectionProps {
  toolId: string;
}

export function ToolSeoSection({ toolId }: ToolSeoSectionProps) {
  const meta = TOOL_METADATA_MAP[toolId] || {
    title: "Cybro Image Tool",
    subtitle: "High-performance browser-based processing",
    description: "Optimize, transform, and edit your visual assets directly in your browser. Fully secure, client-side, and lightning-fast.",
    steps: [
      "Select and upload your photo or asset.",
      "Configure adjustments and review the canvas preview.",
      "Apply filters or structural calibrations.",
      "Download your finished high-res files instantly."
    ],
    faqs: [
      {
        question: "Are my photos kept safe and secure?",
        answer: "Yes! Cybro Tools processes everything on the client-side. None of your files or personal assets are ever uploaded to our servers."
      }
    ],
    category: "Image Processing",
    relatedTools: ["bg-remover", "upscaler", "compressor", "converter"]
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section className="mt-16 pt-16 border-t border-gray-100 dark:border-zinc-800/80 space-y-16 max-w-5xl mx-auto pb-12 animate-in fade-in duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": meta.title,
            "description": meta.description,
            "applicationCategory": meta.category,
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      
      {/* 1. Header Overview for SEO crawlers & users */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 dark:border-purple-800/30 text-xs font-bold text-purple-600 dark:text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SEO Optimized Utility Profile</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          More About {meta.title}
        </h2>
        <p className="text-[#8e8ca3] text-sm md:text-base leading-relaxed">
          {meta.description}
        </p>
      </div>

      {/* 2. Visual Steps Card Grid (How to Use) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/50">
          <Compass className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Step-by-Step Guide: How to Use {meta.title}
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {meta.steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative p-5 bg-[#0a081e]/45 border border-purple-900/15 dark:border-[#232145] rounded-2xl space-y-3 shadow-md group hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-extrabold text-purple-500/80 dark:text-purple-400 font-mono">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Collapsible Frequently Asked Questions (FAQ) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/50">
          <HelpCircle className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="grid gap-4 max-w-3xl mx-auto">
          {meta.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#0a081e]/25 border border-gray-200 dark:border-[#232145] rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/20"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm md:text-base text-gray-900 dark:text-white focus:outline-none"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8e8ca3] shrink-0" />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed border-t border-purple-950/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sibling Tools Recommendation Grid (Related Tools) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/50">
          <Compass className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Related Creative Utilities
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {meta.relatedTools.map((relId) => {
            const relMeta = TOOL_METADATA_MAP[relId];
            if (!relMeta) return null;
            const href = relId === "bg-remover" ? "/ai/bg-remover" : `/image/${relId}`;
            return (
              <Link 
                href={href} 
                key={relId}
                className="p-5 bg-white dark:bg-[#070517] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-purple-500 dark:hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group block"
              >
                <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 block uppercase tracking-wider mb-1">
                  {relMeta.category}
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>{relMeta.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-[11px] text-[#8e8ca3] line-clamp-2 mt-1 leading-normal">
                  {relMeta.subtitle}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Connected Blog Deep-Dives for internal linking */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/50">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            From the Cybro Blog: Tech Deep-Dives
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {RELEVANT_BLOG_ARTICLES.map((article, idx) => (
            <Link 
              key={idx}
              href={article.href}
              className="p-6 bg-[#0a081e]/35 border border-purple-950/10 dark:border-[#232145] rounded-3xl hover:border-indigo-500/40 hover:bg-[#0c0926]/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8e8ca3]">
                  <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 pt-4 mt-2">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
