// Minimal Deno declaration for local TypeScript/IDE checks.
// Supabase Edge Functions run on Deno in the cloud, so this file
// only silences editor/tsc errors locally.
declare const Deno: {
  env: {
    get(name: string): string | undefined
  }
  serve?(handler: (req: Request) => Response | Promise<Response>): void
}

export {}
