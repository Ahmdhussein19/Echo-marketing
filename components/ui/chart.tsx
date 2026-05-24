"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [key: string]: {
    color?: string
    label?: React.ReactNode
  }
}

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const [isMounted, setIsMounted] = React.useState(false)
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={isMounted ? chartId : undefined}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-current [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-white/10 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-white/10 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        {isMounted ? (
          <>
            <ChartStyle id={chartId} config={config} />
            <RechartsPrimitive.ResponsiveContainer minWidth={0}>
              {children}
            </RechartsPrimitive.ResponsiveContainer>
          </>
        ) : null}
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, value]) => value.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: colorConfig
          .map(
            ([key, item]) =>
              `[data-chart=${id}] { --color-${key}: ${item.color}; }`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartPayloadItem = {
  color?: string
  dataKey?: string | number
  name?: string | number
  value?: React.ReactNode
}

function ChartTooltipContent({
  active,
  className,
  indicator = "dot",
  label,
  labelFormatter,
  payload,
}: React.ComponentProps<"div"> & {
  active?: boolean
  indicator?: "dot" | "line"
  label?: string | number
  labelFormatter?: (
    label: string | number,
    payload: ChartPayloadItem[]
  ) => React.ReactNode
  payload?: ChartPayloadItem[]
}) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "grid min-w-[9rem] gap-2 rounded-lg border border-white/10 bg-[#0b0b0f]/95 px-3 py-2 text-xs text-[#f4f2fb] shadow-[0_12px_34px_rgba(0,0,0,0.45)] backdrop-blur-md",
        className
      )}
    >
      {label ? (
        <div className="font-segoe text-[11px] font-medium tracking-normal text-[#8f8f94]">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = `${item.dataKey ?? item.name ?? ""}`
          const itemConfig = config[key]
          const color = item.color ?? itemConfig?.color

          return (
            <div
              className="flex items-center justify-between gap-5 font-segoe tracking-normal"
              key={key}
            >
              <div className="flex min-w-0 items-center gap-2">
                {indicator === "dot" ? (
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ) : (
                  <span
                    className="h-px w-4 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="truncate text-[#b5b5bd]">
                  {itemConfig?.label ?? item.name}
                </span>
              </div>
              <span className="font-medium text-[#f5f5f7]">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

type ChartLegendPayloadItem = {
  color?: string
  dataKey?: string | number
  value?: React.ReactNode
}

function ChartLegendContent({
  className,
  payload,
}: React.ComponentProps<"div"> & {
  payload?: ChartLegendPayloadItem[]
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-5 font-segoe text-xs tracking-normal text-[#8f8f94]",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${item.dataKey ?? item.value ?? ""}`
        const itemConfig = config[key]

        return (
          <div className="flex items-center gap-2" key={key}>
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {itemConfig?.label ?? item.value}
          </div>
        )
      })}
    </div>
  )
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
