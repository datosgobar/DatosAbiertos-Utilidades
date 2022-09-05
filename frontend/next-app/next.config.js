module.exports = {
    output: 'standalone',
    async rewrites () {
        return [
            {
                source: "/portal/:path*",
                destination: "http://localhost:8080/portal/:path*",
            },
        ];
    }
}