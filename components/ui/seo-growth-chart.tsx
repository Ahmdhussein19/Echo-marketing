"use client"

import { useEffect, useRef, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface SeoGrowthChartProps {
  alt: string
  animate: boolean
}

export function SeoGrowthChart({ alt, animate }: SeoGrowthChartProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const wasAnimatingRef = useRef(false)

  useEffect(() => {
    if (animate && !wasAnimatingRef.current) {
      setAnimationKey((key) => key + 1)
    }

    wasAnimatingRef.current = animate
  }, [animate])

  const metricItems = [
    ["+570k+", "Return on Investment"],
    ["+690k+", "Monthly Organic Traffic"],
    ["+800k+", "Ranking Keywords"],
  ] as const

  const chartData = [
    { month: "Jan", after: 94, before: 92 },
    { month: "Feb", after: 132, before: 96 },
    { month: "Mar", after: 146, before: 101 },
    { month: "Apr", after: 155, before: 105 },
    { month: "May", after: 226, before: 109 },
    { month: "Jun", after: 249, before: 112 },
    { month: "Jul", after: 275, before: 116 },
    { month: "Aug", after: 302, before: 121 },
    { month: "Sep", after: 326, before: 124 },
    { month: "Oct", after: 418, before: 128 },
  ] as const

  const chartConfig = {
    before: {
      label: "Before SEO",
      color: "rgba(70, 76, 124, 0.52)",
    },
    after: {
      label: "After SEO",
      color: "#535b99",
    },
  } satisfies ChartConfig

  return (
    <div
      aria-label={alt}
      className="relative flex h-full min-h-0 w-full flex-col justify-end overflow-hidden bg-[#030303] px-3 pt-5 pb-4 text-white sm:px-6 sm:pt-8 sm:pb-6"
      role="img"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(86,93,150,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_42%)]"
      />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-x-0 top-0 h-[82%]">
          {[12, 34, 50, 67, 83].map((left, index) => (
            <span
              aria-hidden
              className={cn(
                "absolute top-0 h-full w-px bg-[rgba(87,96,145,0.16)]",
                index === 1 && "bg-[rgba(111,119,190,0.35)]",
              )}
              key={left}
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
        <ChartContainer
          id="seo-growth-chart"
          className="absolute inset-x-0 top-1 h-[86%] w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            key={animationKey}
            margin={{ bottom: 8, left: 8, right: 8, top: 8 }}
          >
            <defs>
              <linearGradient id="fillBeforeSeo" x1="0" x2="0" y1="0" y2="1">
                <stop offset="8%" stopColor="var(--color-before)" stopOpacity={0.34} />
                <stop offset="92%" stopColor="var(--color-before)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillAfterSeo" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-after)" stopOpacity={0.34} />
                <stop offset="95%" stopColor="var(--color-after)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} stroke="rgba(87,96,145,0.16)" vertical />
            <XAxis axisLine={false} dataKey="month" hide tickLine={false} />
            <YAxis domain={[60, 450]} hide />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{
                stroke: "rgba(111,119,190,0.28)",
                strokeWidth: 1,
              }}
            />
            <Area
              activeDot={{
                fill: "var(--color-before)",
                r: 4,
                stroke: "rgba(255,255,255,0.14)",
              }}
              animationDuration={900}
              dataKey="before"
              dot={false}
              fill="url(#fillBeforeSeo)"
              fillOpacity={1}
              isAnimationActive={animate}
              stroke="var(--color-before)"
              strokeWidth={2}
              type="natural"
            />
            <Area
              activeDot={{
                fill: "var(--color-after)",
                r: 5,
                stroke: "rgba(255,255,255,0.18)",
              }}
              animationDuration={900}
              dataKey="after"
              dot={{
                fill: "var(--color-after)",
                r: 4,
                stroke: "rgba(81,89,145,0.28)",
                strokeWidth: 7,
              }}
              fill="url(#fillAfterSeo)"
              fillOpacity={1}
              isAnimationActive={animate}
              stroke="var(--color-after)"
              strokeLinecap="round"
              strokeWidth={3}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
        <div className="seo-chart-callout absolute top-[20%] left-[30%] rounded-full border border-white/5 bg-[#111116]/90 px-5 py-2 font-segoe text-sm font-normal tracking-normal text-[#f4f2fb] shadow-[0_0_24px_rgba(70,75,120,0.28)] backdrop-blur-md sm:left-[29%] sm:px-7 sm:py-3 sm:text-2xl">
          After <span className="text-[#f7f7ff]">↗</span> SEOSpark
        </div>
      </div>
      <div className="relative grid shrink-0 grid-cols-3 gap-2 pt-3 text-center">
        {metricItems.map(([value, label]) => (
          <div className="min-w-0" key={label}>
            <p className="font-segoe text-xl leading-none font-bold tracking-normal text-[#f5f5f7] sm:text-4xl">
              {value}
            </p>
            <p className="mt-2 font-segoe text-[10px] leading-tight font-normal tracking-normal text-[#8f8f94] sm:mt-4 sm:text-lg">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
