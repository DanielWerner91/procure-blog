// No layout-level `robots` — child pages own their own robots tag. The detail
// pages flip between noindex/index based on pseo_pages.status; the /data
// landing and category rollups set noindex in their own generateMetadata. A
// layout-level noindex would duplicate the tag and override promoted pages.
export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
