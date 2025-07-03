'use server';

export const scoreHeadings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
export const ageGroupRows = ['16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70', '71-75', '76-80', '81-85', '>85'];

// Zone definition: For a given score, what is the zone number (1-4)?
// 1: Red (Poor), 2: Yellow (Average), 3: Green (Good), 4: Blue (Excellent)
// The key is the minimum score required to enter that zone.
const zoneData = {
  female: {
    '16-20': { '8.0': 2, '9.0': 3, '10.0': 4 },
    '21-25': { '8.0': 2, '9.0': 3, '9.5': 4 },
    '26-30': { '7.5': 2, '8.5': 3, '9.5': 4 },
    '31-35': { '7.5': 2, '8.5': 3, '9.0': 4 },
    '36-40': { '7.0': 2, '8.0': 3, '9.0': 4 },
    '41-45': { '6.5': 2, '7.5': 3, '8.5': 4 },
    '46-50': { '6.0': 2, '7.0': 3, '8.5': 4 },
    '51-55': { '5.0': 2, '6.5': 3, '8.0': 4 },
    '56-60': { '4.0': 2, '6.0': 3, '7.5': 4 },
    '61-65': { '3.5': 2, '5.5': 3, '7.0': 4 },
    '66-70': { '2.5': 2, '4.5': 3, '6.5': 4 },
    '71-75': { '1.5': 2, '3.5': 3, '5.5': 4 },
    '76-80': { '1.0': 2, '2.5': 3, '4.5': 4 },
    '81-85': { '0.5': 2, '1.5': 3, '3.5': 4 },
    '>85':   { '0.0': 2, '1.0': 3, '2.5': 4 },
  },
  male: {
    '16-20': { '8.0': 2, '9.0': 3, '10.0': 4 },
    '21-25': { '8.0': 2, '9.0': 3, '9.5': 4 },
    '26-30': { '7.5': 2, '8.5': 3, '9.5': 4 },
    '31-35': { '7.0': 2, '8.5': 3, '9.0': 4 },
    '36-40': { '7.0': 2, '8.0': 3, '9.0': 4 },
    '41-45': { '6.5': 2, '7.5': 3, '8.5': 4 },
    '46-50': { '6.0': 2, '7.0': 3, '8.0': 4 },
    '51-55': { '5.5': 2, '6.5': 3, '7.5': 4 },
    '56-60': { '4.5': 2, '6.0': 3, '7.0': 4 },
    '61-65': { '3.5': 2, '5.0': 3, '6.5': 4 },
    '66-70': { '2.5': 2, '4.0': 3, '6.0': 4 },
    '71-75': { '1.0': 2, '3.0': 3, '5.0': 4 },
    '76-80': { '0.5': 2, '2.0': 3, '4.0': 4 },
    '81-85': { '0.0': 2, '1.0': 3, '3.0': 4 },
    '>85':   { '0.0': 2, '0.5': 3, '2.0': 4 },
  },
};

export function getSitRiseZone(gender: 'male' | 'female', ageGroup: string, score: number): number {
    const thresholds = zoneData[gender][ageGroup as keyof typeof zoneData.female];
    if (!thresholds) return 1;

    let zone = 1; // Default to Poor
    if (score >= parseFloat(Object.keys(thresholds).find(k => thresholds[k as keyof typeof thresholds] === 2) || '99')) zone = 2;
    if (score >= parseFloat(Object.keys(thresholds).find(k => thresholds[k as keyof typeof thresholds] === 3) || '99')) zone = 3;
    if (score >= parseFloat(Object.keys(thresholds).find(k => thresholds[k as keyof typeof thresholds] === 4) || '99')) zone = 4;
    
    return zone;
}

// Maps the app's age ranges (e.g., "30-39 ปี") to the visual table's age ranges (e.g., "36-40").
export function mapAppAgeToVisualAge(appAgeRange: string): string {
    const lowerBound = parseInt(appAgeRange.split('-')[0]);
    if (lowerBound >= 86) return '>85';
    if (lowerBound >= 81) return '81-85';
    if (lowerBound >= 76) return '76-80';
    if (lowerBound >= 71) return '71-75';
    if (lowerBound >= 66) return '66-70';
    if (lowerBound >= 61) return '61-65';
    if (lowerBound >= 56) return '56-60';
    if (lowerBound >= 51) return '51-55';
    if (lowerBound >= 46) return '46-50';
    if (lowerBound >= 41) return '41-45';
    if (lowerBound >= 36) return '36-40';
    if (lowerBound >= 31) return '31-35';
    if (lowerBound >= 26) return '26-30';
    if (lowerBound >= 21) return '21-25';
    return '16-20';
}
