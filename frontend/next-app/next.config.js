module.exports = {
    output: 'standalone',
    async rewrites () {
        return [
            {
                source: "/portal/:path*",
                destination: "http://fastAPI:80/portal/:path*",
            },
        ];
    }
}