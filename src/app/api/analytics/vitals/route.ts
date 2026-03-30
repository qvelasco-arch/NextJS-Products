import { NextResponse } from 'next/server'
import { z } from 'zod'

const VitalSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.enum(['CLS', 'INP', 'LCP', 'FCP', 'TTFB']),
  value: z.number().nonnegative(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  url: z.string().max(2000),
  timestamp: z.number().int().positive(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = VitalSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const vitals = result.data

    // Log to your analytics system (e.g., database, external service)
    console.log('Core Web Vitals:', vitals)

    // Store in database or forward to analytics service
    // await db.vitals.create({ data: vitals })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to record vitals' }, { status: 500 })
  }
}
