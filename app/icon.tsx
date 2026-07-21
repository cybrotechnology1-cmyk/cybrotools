import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          C
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
