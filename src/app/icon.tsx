import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#14b8a6',
          fontWeight: 700,
          borderRadius: 12,
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}
