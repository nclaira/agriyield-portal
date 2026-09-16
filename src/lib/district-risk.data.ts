export type DistrictRisk = {
  district: string;
  province: string;
  crop: string;
  yieldTonnes: number;
  storageCapacityTonnes: number;
  riskScore: number;
  riskCategory: "HIGH" | "MEDIUM" | "LOW";
  lat: number;
  lng: number;
};

// Illustrative post-harvest risk dataset for Rwandan districts,
// structured to mirror NISR seasonal agricultural survey indicators.
export const DISTRICT_RISK: DistrictRisk[] = [
  { district: "Nyagatare", province: "Eastern", crop: "Maize", yieldTonnes: 48200, storageCapacityTonnes: 21000, riskScore: 87, riskCategory: "HIGH", lat: -1.2921, lng: 30.3262 },
  { district: "Gatsibo", province: "Eastern", crop: "Maize", yieldTonnes: 31400, storageCapacityTonnes: 15800, riskScore: 78, riskCategory: "HIGH", lat: -1.5894, lng: 30.4189 },
  { district: "Bugesera", province: "Eastern", crop: "Beans", yieldTonnes: 18900, storageCapacityTonnes: 9400, riskScore: 74, riskCategory: "HIGH", lat: -2.2042, lng: 30.1436 },
  { district: "Kayonza", province: "Eastern", crop: "Maize", yieldTonnes: 22600, storageCapacityTonnes: 12800, riskScore: 69, riskCategory: "MEDIUM", lat: -1.8937, lng: 30.5106 },
  { district: "Ngoma", province: "Eastern", crop: "Beans", yieldTonnes: 15700, storageCapacityTonnes: 9600, riskScore: 61, riskCategory: "MEDIUM", lat: -2.1553, lng: 30.5054 },
  { district: "Rusizi", province: "Western", crop: "Rice", yieldTonnes: 27900, storageCapacityTonnes: 19500, riskScore: 58, riskCategory: "MEDIUM", lat: -2.4847, lng: 28.9072 },
  { district: "Nyamasheke", province: "Western", crop: "Cassava", yieldTonnes: 33200, storageCapacityTonnes: 24100, riskScore: 52, riskCategory: "MEDIUM", lat: -2.3055, lng: 29.1028 },
  { district: "Karongi", province: "Western", crop: "Cassava", yieldTonnes: 24500, storageCapacityTonnes: 19300, riskScore: 44, riskCategory: "LOW", lat: -2.0604, lng: 29.3936 },
  { district: "Musanze", province: "Northern", crop: "Irish Potato", yieldTonnes: 56800, storageCapacityTonnes: 47200, riskScore: 38, riskCategory: "LOW", lat: -1.4998, lng: 29.6349 },
  { district: "Burera", province: "Northern", crop: "Irish Potato", yieldTonnes: 41300, storageCapacityTonnes: 35800, riskScore: 33, riskCategory: "LOW", lat: -1.4762, lng: 29.8527 },
  { district: "Gicumbi", province: "Northern", crop: "Beans", yieldTonnes: 26800, storageCapacityTonnes: 21900, riskScore: 41, riskCategory: "LOW", lat: -1.5762, lng: 30.0693 },
  { district: "Nyamagabe", province: "Southern", crop: "Sweet Potato", yieldTonnes: 38100, storageCapacityTonnes: 26400, riskScore: 56, riskCategory: "MEDIUM", lat: -2.4603, lng: 29.4797 },
  { district: "Huye", province: "Southern", crop: "Beans", yieldTonnes: 19600, storageCapacityTonnes: 15200, riskScore: 47, riskCategory: "LOW", lat: -2.5967, lng: 29.7389 },
  { district: "Nyanza", province: "Southern", crop: "Cassava", yieldTonnes: 22900, storageCapacityTonnes: 16100, riskScore: 59, riskCategory: "MEDIUM", lat: -2.3517, lng: 29.7504 },
  { district: "Ruhango", province: "Southern", crop: "Cassava", yieldTonnes: 21400, storageCapacityTonnes: 13900, riskScore: 64, riskCategory: "MEDIUM", lat: -2.2283, lng: 29.7778 },
  { district: "Gasabo", province: "Kigali City", crop: "Beans", yieldTonnes: 9800, storageCapacityTonnes: 8600, riskScore: 29, riskCategory: "LOW", lat: -1.8897, lng: 30.1315 },
];
