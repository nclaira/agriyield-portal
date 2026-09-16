import { NextResponse } from 'next/server';
import { DISTRICT_RISK } from '@/lib/district-risk.data';

export async function GET() {
  return NextResponse.json({ success: true, data: DISTRICT_RISK });
}
