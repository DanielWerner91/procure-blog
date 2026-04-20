import type { Metadata } from 'next';

// The `/data` subtree is a pSEO soft-launch area. Child pages flip their own
// `robots` tag to `index,follow` once promoted via the pseo_pages table.
// The category rollup and /data index stay noindex for the pilot.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
