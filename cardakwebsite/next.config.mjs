/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'wubahsklurblyqlurwlf.supabase.co',
      'images.unsplash.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://wubahsklurblyqlurwlf.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://wubahsklurblyqlurwlf.supabase.co https://images.unsplash.com; connect-src 'self' https://wubahsklurblyqlurwlf.supabase.co; font-src 'self'; object-src 'none'; media-src 'self'; worker-src 'self'; manifest-src 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig; 