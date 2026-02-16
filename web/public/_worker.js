export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname

    // Serve static assets directly
    if (
      pathname.startsWith('/assets/') ||
      pathname.match(
        /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/
      )
    ) {
      return env.ASSETS.fetch(request)
    }

    // For all other routes, serve index.html (SPA routing)
    const indexUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}
