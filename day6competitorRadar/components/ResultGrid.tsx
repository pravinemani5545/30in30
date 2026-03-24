'use client'

import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ValuePropCard } from './ValuePropCard'
import { TargetICPCard } from './TargetICPCard'
import { PricingModelCard } from './PricingModelCard'
import { GTMCard } from './GTMCard'
import { WeaknessesCard } from './WeaknessesCard'
import type { CompetitorAnalysis } from '@/types'

export function ResultGrid({ analysis }: { analysis: CompetitorAnalysis }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ValuePropCard
        statement={analysis.value_proposition || ''}
        confidence={analysis.vp_confidence || 'low'}
        evidence={analysis.vp_evidence || ''}
      />
      <TargetICPCard
        description={analysis.target_icp || ''}
        confidence={analysis.icp_confidence || 'low'}
        signals={analysis.icp_signals || []}
      />
      <PricingModelCard
        description={analysis.pricing_model || ''}
        confidence={analysis.pricing_confidence || 'low'}
        signals={analysis.pricing_signals || []}
      />
      <GTMCard
        description={analysis.gtm_motion || ''}
        confidence={analysis.gtm_confidence || 'low'}
        signals={analysis.gtm_signals || []}
      />
      <WeaknessesCard weaknesses={analysis.weaknesses || []} />

      {analysis.analysis_notes && (
        <Card className="col-span-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Analysis Notes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.analysis_notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
