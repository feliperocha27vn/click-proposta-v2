import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useGetProposalAndBudgetStats } from '@/gen/hooks/ProposalsHooks/useGetProposalAndBudgetStats'
import { Loader2 } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const chartConfig = {
  count: {
    label: 'Enviados',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function RecentProposalsChart() {
  const { data, isLoading } = useGetProposalAndBudgetStats({
    query: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  })

  const chartData = data?.stats || []

  return (
    <Card className="col-span-1 border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-white px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Propostas e Orçamentos Criadas
          </CardTitle>
          <p className="text-sm text-slate-500">Últimos 15 dias</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-75 w-full flex items-center justify-center">
            <Loader2 className="size-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-75 w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -20,
                right: 12,
                top: 10,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                fillOpacity={0.4}
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
