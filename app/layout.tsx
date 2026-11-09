import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import {sitePath} from '../lib/site-path';
import './globals.css';
export const metadata: Metadata = {title:'Pratyush — Through the glass',description:'Real-time systems, data experiments, and photographs. A journey inside the things I build.'};

const cursorStyle = {
  '--site-cursor': `url("${sitePath('/cursors/screwdriver.svg')}") 3 3`,
} as CSSProperties;

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body style={cursorStyle}>{children}</body></html>;
}
