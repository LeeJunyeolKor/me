import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f7f6f1',
        color: '#161714',
        padding: '80px',
      }}>
      <div style={{ display: 'flex', width: 96, height: 8, backgroundColor: '#2250d9' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 92, lineHeight: 1 }}>JY / LOG</div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 36, color: '#686b64' }}>Junyeol Lee</div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
