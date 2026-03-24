'use client'

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
        <div className="col-span-full rounded-lg border border-border bg-surface p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            Analysis Notes
          </span>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {analysis.analysis_notes}
          </p>
        </div>
      )}
    </div>
  )
}
