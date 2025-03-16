/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME,  // あなたのプロジェクトのホスト名
                port: '',
                pathname: '/storage/v1/object/public/**'
            }
        ]
    },
};

export default nextConfig;
