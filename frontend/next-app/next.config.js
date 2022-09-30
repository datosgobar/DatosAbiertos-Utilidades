module.exports = {
    output: 'standalone',
    async rewrites () {
        return [
            {
                source: "/seriesApi/:path*",
                destination: "http://apis.datos.gob.ar/series/api/:path*",
            },
            {
                source: "/portal/:path*",
                destination: "http://fastAPI:80/portal/:path*",
            },

        ];
    }
}