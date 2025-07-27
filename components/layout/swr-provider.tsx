"use client"

import { SWRConfig } from "swr"
import type { PropsWithChildren } from "react"

export default function SWRProvider({
  children,
  fallback,
}: PropsWithChildren<{ fallback: Record<string, any> }>) {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>
}
