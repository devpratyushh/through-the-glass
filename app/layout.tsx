import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Pratyush — Through the glass',description:'Real-time systems, data experiments, and photographs. A journey inside the things I build.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
