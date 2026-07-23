import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Photo Collage Maker | Create Grids Online | Cybro Tools',
  description: 'Create beautiful photo collages and picture grids easily. Combine multiple images into one frame online for free.',
  keywords: 'photo collage, picture collage maker, image grid, photo grid creator, collage maker, free online collage',
  openGraph: {
    title: 'Free Photo Collage Maker | Create Grids Online | Cybro Tools',
    description: 'Create beautiful photo collages and picture grids easily. Combine multiple images into one frame online for free.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
