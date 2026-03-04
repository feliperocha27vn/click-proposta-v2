import { useAuth } from '@/contexts/auth-context'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { HeroSection } from './-components/hero-section'
import { HowItWorks } from './-components/how-it-works'
import { LandingFooter } from './-components/landing-footer'
import { LandingHeader } from './-components/landing-header'
import { PricingSection } from './-components/pricing-section'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="size-8 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
