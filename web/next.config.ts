import type { NextConfig } from 'next';

// A try build (XR_TRY=1 at build time) also compiles the files ending .try.tsx or .try.ts: the
// pages and routes under /try. An ordinary build leaves them out, so it has no such route
// (trying-the-product#AC-2). It builds into its own folder, so the two builds can sit side by side.
const tryBuild = process.env.XR_TRY === '1';

const nextConfig: NextConfig = {
  transpilePackages: ['@xr/contracts'],
  pageExtensions: tryBuild ? ['try.tsx', 'try.ts', 'tsx', 'ts'] : ['tsx', 'ts'],
  distDir: tryBuild ? '.next-try' : '.next',
};

export default nextConfig;
