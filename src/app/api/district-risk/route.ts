import { NextResponse } from 'next/server';
import sasData from '@/data/nisr-sas-data.json';


// Formula weights: Risk Score (Rd) = w1 * (Deficit Ratio) + w2 * (Historical Loss)
const WEIGHT_STORAGE_DEFICIT = 0.6;
const WEIGHT_HISTORICAL_LOSS = 0.4;


export async function GET() {
  try {
    const processedDistricts = sasData.map((item) => {
      // Storage deficit calculation
      const deficitRatio = item.seasonalYieldTonnes > item.storageCapacityTonnes
        ? (item.seasonalYieldTonnes - item.storageCapacityTonnes) / item.seasonalYieldTonnes
        : 0;


      // Mathematical Risk Score computation
      const rawRiskScore = (WEIGHT_STORAGE_DEFICIT * deficitRatio) + (WEIGHT_HISTORICAL_LOSS * item.historicalLossRatio);
      const riskScore = Math.min(Math.max(Number(rawRiskScore.toFixed(2)), 0), 1);


      return {
        district: item.district,
        province: item.province,
        crop: item.crop,
        yieldTonnes: item.seasonalYieldTonnes,
        storageCapacityTonnes: item.storageCapacityTonnes,
        riskScore, // Value normalized between 0.00 and 1.00
        riskCategory: riskScore > 0.6 ? 'HIGH' : riskScore > 0.3 ? 'MEDIUM' : 'LOW'
      };
    });


    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: processedDistricts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process district risk scores' },
      { status: 500 }
    );
  }
}
