import type { ReportData } from '../types'

export async function generateExecutiveSummary(_: ReportData): Promise<string> {
  // Placeholder implementation; wire to Google GenAI if needed.
  return Promise.resolve('Executive summary generated (placeholder).')
}

export async function parseUnstructuredData(raw: string): Promise<Partial<ReportData>> {
  // Very naive parser: split by lines and create mock items; replace with real GenAI call.
  const lines = raw.split('
').filter(Boolean)
  const items = lines.map((l, idx) => ({ id: Date.now()+idx, issueKey: `FBT-${1000+idx}`, summary: l.trim(), status: 'Done' }))
  return Promise.resolve({ sprint1: { metrics: { sprintName: 'Parsed Sprint', startDate: '', endDate: '', averageDeliveryRate: 0 }, items } } as any)
}
