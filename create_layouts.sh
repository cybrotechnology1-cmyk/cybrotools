#!/bin/bash

# Array of tools
tools=("compressor" "converter" "editor" "circular-crop" "collage" "id-photo" "meme" "passport" "rounded-corners" "text-on-image" "watermark" "aspect-ratio")

# Titles and Descriptions
declare -A titles
titles=(
    ["compressor"]="Free Image Compressor | Reduce Image Size Online | Cybro Tools"
    ["converter"]="Free Image Converter | Change Image Format | Cybro Tools"
    ["editor"]="Free Online Photo Editor | Image Editing Tool | Cybro Tools"
    ["circular-crop"]="Circular Image Crop | Round Profile Picture Maker | Cybro Tools"
    ["collage"]="Free Photo Collage Maker | Create Grids Online | Cybro Tools"
    ["id-photo"]="ID Photo Maker | Free Passport Photo Creator | Cybro Tools"
    ["meme"]="Free Meme Generator | Create Memes Online | Cybro Tools"
    ["passport"]="Passport Photo Maker | Standard Visa Photo Creator | Cybro Tools"
    ["rounded-corners"]="Round Image Corners | Free Online Tool | Cybro Tools"
    ["text-on-image"]="Add Text to Image | Free Online Photo Editor | Cybro Tools"
    ["watermark"]="Add Watermark to Image | Protect Photos Online | Cybro Tools"
    ["aspect-ratio"]="Image Aspect Ratio Changer | Resize Photos Free | Cybro Tools"
)

declare -A descs
descs=(
    ["compressor"]="Compress JPG, PNG, WEBP images without losing quality. 100% free, fast, and secure client-side browser compression."
    ["converter"]="Convert images between JPG, PNG, WEBP, and more formats instantly in your browser. Fast, free, and private."
    ["editor"]="Edit your photos online with our free image editor. Crop, rotate, apply filters, and adjust colors securely in your browser."
    ["circular-crop"]="Crop your images into perfect circles online for free. Ideal for profile pictures, avatars, and logos."
    ["collage"]="Create beautiful photo collages and picture grids easily. Combine multiple images into one frame online for free."
    ["id-photo"]="Create professional ID photos for school, work, or official use. Ensure perfect sizing and alignment online."
    ["meme"]="Generate custom memes by adding text to images. Quick, easy, and free online meme maker with templates."
    ["passport"]="Make standard passport and visa photos online. Ensure correct dimensions and white backgrounds instantly."
    ["rounded-corners"]="Quickly round the corners of your images online. Add smooth curves to any picture for free."
    ["text-on-image"]="Easily add text, titles, and captions to your photos online. Customize fonts, colors, and placement."
    ["watermark"]="Protect your images by adding a custom watermark logo or text. Fast, secure, and free online tool."
    ["aspect-ratio"]="Change the aspect ratio of any image to fit Instagram, Facebook, or Twitter. Easy and free resizing tool."
)

for t in "${tools[@]}"; do
    mkdir -p "app/image/$t"
    cat << LEOF > "app/image/$t/layout.tsx"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${titles[$t]}',
  description: '${descs[$t]}',
  keywords: '$t, image tool, free online tool, cybro tools',
  openGraph: {
    title: '${titles[$t]}',
    description: '${descs[$t]}',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
LEOF
done
