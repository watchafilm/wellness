
export const scoreHeadings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
export const ageGroupRows = ['26-30', '36-40', '46-50', '56-60', '66-70', '76-80'];

type ZoneRange = { min: number; max: number; zone: number };
type GenderZones = { [ageGroup: string]: ZoneRange[] };

// Zone definition: For a given score, what is the zone number (1-4)?
// 1: Red (Poor), 2: Yellow (Average), 3: Green (Good), 4: Blue (Excellent)
// The ranges are inclusive [min, max].
const zoneData: { male: GenderZones; female: GenderZones } = {
  male: {
      '26-30': [ // 20-29
          { min: 0, max: 8.0, zone: 1 },
          { min: 8.5, max: 8.5, zone: 2 },
          { min: 9.0, max: 9.5, zone: 3 },
          { min: 10, max: 10, zone: 4 },
      ],
      '36-40': [ // 30-39
          { min: 0, max: 7.5, zone: 1 },
          { min: 8, max: 8, zone: 2 },
          { min: 8.5, max: 9.5, zone: 3 },
          { min: 10, max: 10, zone: 4 },
      ],
      '46-50': [ // 40-49
          { min: 0, max: 7, zone: 1 },
          { min: 7.5, max: 7.5, zone: 2 },
          { min: 8, max: 9, zone: 3 },
          { min: 9.5, max: 10, zone: 4 },
      ],
      '56-60': [ // 50-59
          { min: 0, max: 6.5, zone: 1 },
          { min: 7, max: 7, zone: 2 },
          { min: 7.5, max: 8, zone: 3 },
          { min: 8.5, max: 10, zone: 4 },
      ],
      '66-70': [ // 60-69 (Corrected based on logical progression)
          { min: 0, max: 4, zone: 1 },
          { min: 4.5, max: 6.5, zone: 2 },
          { min: 7.0, max: 8.5, zone: 3 },
          { min: 9.0, max: 10, zone: 4 },
      ],
      '76-80': [ // 70+
          { min: 0, max: 0, zone: 1 }, // Assuming 0.5 belongs to yellow as the higher group
          { min: 0.5, max: 3, zone: 2 },
          { min: 3.5, max: 5.5, zone: 3 },
          { min: 6, max: 10, zone: 4 },
      ],
  },
  female: {
      '26-30': [ // 20-29
          { min: 0, max: 8.5, zone: 1 },
          { min: 9, max: 9, zone: 2 },
          { min: 9.5, max: 9.5, zone: 3 },
          { min: 10, max: 10, zone: 4 },
      ],
      '36-40': [ // 30-39
          { min: 0, max: 8, zone: 1 },
          { min: 8.5, max: 9, zone: 2 },
          { min: 9.5, max: 9.5, zone: 3 },
          { min: 10, max: 10, zone: 4 },
      ],
      '46-50': [ // 40-49
          { min: 0, max: 7, zone: 1 },
          { min: 7.5, max: 8, zone: 2 },
          { min: 8.5, max: 9, zone: 3 },
          { min: 9.5, max: 10, zone: 4 },
      ],
      '56-60': [ // 50-59
          { min: 0, max: 6, zone: 1 },
          { min: 6.5, max: 7, zone: 2 },
          { min: 7.5, max: 8.5, zone: 3 },
          { min: 9, max: 10, zone: 4 },
      ],
      '66-70': [ // 60-69
          { min: 0, max: 2, zone: 1 },
          { min: 2.5, max: 5, zone: 2 },
          { min: 5.5, max: 7.5, zone: 3 },
          { min: 8, max: 10, zone: 4 },
      ],
      '76-80': [ // 70+
          { min: 0, max: 0.5, zone: 2 },
          { min: 1, max: 2.5, zone: 3 },
          { min: 3, max: 10, zone: 4 },
      ],
  }
};

export function getSitRiseZone(gender: 'male' | 'female', ageGroup: string, score: number): number {
    const ranges = zoneData[gender][ageGroup as keyof typeof zoneData.female];
    if (!ranges) return 1;

    for (const range of ranges) {
        if (score >= range.min && score <= range.max) {
            return range.zone;
        }
    }
    
    return 1; // Default to Red/Poor if no range matches (e.g., for gaps in data).
}

// Maps the app's age ranges (e.g., "30-39 ปี") to the visual table's age ranges.
export function mapAppAgeToVisualAge(appAgeRange: string): string {
    const lowerBound = parseInt(appAgeRange.split('-')[0]);

    if (lowerBound >= 70) return '76-80';   // 70+
    if (lowerBound >= 60) return '66-70';   // 60-69
    if (lowerBound >= 50) return '56-60';   // 50-59
    if (lowerBound >= 40) return '46-50';   // 40-49
    if (lowerBound >= 30) return '36-40';   // 30-39
    if (lowerBound >= 20) return '26-30';   // 20-29

    // Fallback for any other case, though it shouldn't happen with current data.
    return '26-30';
}
