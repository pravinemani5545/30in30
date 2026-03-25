'use client'

import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { WeaknessRow } from './WeaknessRow'
import type { Weakness } from '@/types/day6'

export function WeaknessesCard({ weaknesses }: { weaknesses: Weakness[] }) {
  const highestSeverity = weaknesses.some(w => w.severity === 'high')
    ? 'high'
    : weaknesses.some(w => w.severity === 'medium')
    ? 'medium'
    : 'low'

  const borderColor = highestSeverity === 'high'
    ? 'border-l-severity-high'
    : highestSeverity === 'medium'
    ? 'border-l-severity-medium'
    : 'border-l-severity-low'

  return (
    <Card className={`col-span-full border-l-2 ${borderColor}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-severity-high/15">
            <ShieldAlert className="h-3.5 w-3.5 text-severity-high" />
          </div>
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-severity-high">
            Exploitable Weaknesses
          </CardTitle>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-severity-high/15 text-[11px] font-semibold text-severity-high">
            {weaknesses.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {weaknesses.map((weakness, i) => (
            <div key={i}>
              <WeaknessRow weakness={weakness} />
              {i < weaknesses.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
