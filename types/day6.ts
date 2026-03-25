export type ConfidenceLevel = 'high' | 'mid' | 'low'
export type WeaknessSeverity = 'high' | 'medium' | 'low'
export type ExtractionQuality = 'rich' | 'partial' | 'minimal'
export type RenderMethod = 'js_rendered' | 'static_only'
export type AnalysisStatus = 'pending' | 'scraping' | 'analysing' | 'complete' | 'failed'

export interface ExtractedContent {
  url: string
  domain: string
  faviconUrl: string
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  cleanedText: string
  wordCount: number
  extractionQuality: ExtractionQuality
  renderMethod: RenderMethod
}

export interface Weakness {
  title: string
  description: string
  severity: WeaknessSeverity
  opportunity: string
  confidence: ConfidenceLevel
}

export interface ValuePropResult {
  statement: string
  confidence: ConfidenceLevel
  evidence: string
}

export interface ICPResult {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export interface PricingResult {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export interface GTMResult {
  description: string
  confidence: ConfidenceLevel
  signals: string[]
}

export interface AnalysisResult {
  valueProp: ValuePropResult
  targetICP: ICPResult
  pricingModel: PricingResult
  gtmMotion: GTMResult
  weaknesses: Weakness[]
  analysisNotes: string
}

export interface CompetitorAnalysis {
  id: string
  user_id: string
  url: string
  domain: string
  favicon_url: string | null
  og_title: string | null
  extraction_quality: ExtractionQuality
  render_method: RenderMethod
  word_count: number | null
  value_proposition: string | null
  vp_confidence: ConfidenceLevel | null
  vp_evidence: string | null
  target_icp: string | null
  icp_confidence: ConfidenceLevel | null
  icp_signals: string[] | null
  pricing_model: string | null
  pricing_confidence: ConfidenceLevel | null
  pricing_signals: string[] | null
  gtm_motion: string | null
  gtm_confidence: ConfidenceLevel | null
  gtm_signals: string[] | null
  weaknesses: Weakness[]
  analysis_notes: string | null
  status: AnalysisStatus
  error_message: string | null
  generation_ms: number | null
  created_at: string
}

export interface CompetitorAnalysisSummary {
  id: string
  domain: string
  favicon_url: string | null
  og_title: string | null
  extraction_quality: ExtractionQuality
  render_method: RenderMethod
  status: AnalysisStatus
  weaknesses: Weakness[]
  created_at: string
}

export interface PreviewResponse {
  title: string | null
  description: string | null
  domain: string
  faviconUrl: string
}

export interface ApiError {
  error: string
  code?: string
}

export interface AnalyzeProgressStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'complete' | 'skipped'
}
