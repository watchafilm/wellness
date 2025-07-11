

// Data extracted from "TABLE 4.17. Fitness Categories for the YMCA Sit-and-Reach Test (in) by Age and Sex"
// Original values were in inches and have been converted to cm (x 2.54 and rounded).

export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// The raw benchmark data from the table, indexed by percentile.
// Values have been converted from inches to cm.
export const sitReachBenchmarkData = {
    male: {
        '18-25': { 90: 56, 80: 51, 70: 48, 60: 46, 50: 43, 40: 38, 30: 36, 20: 33, 10: 28 },
        '26-35': { 90: 53, 80: 48, 70: 43, 60: 43, 50: 38, 40: 36, 30: 33, 20: 28, 10: 23 },
        '36-45': { 90: 53, 80: 48, 70: 43, 60: 41, 50: 38, 40: 33, 30: 33, 20: 28, 10: 18 },
        '46-55': { 90: 48, 80: 43, 70: 38, 60: 36, 50: 33, 40: 28, 30: 25, 20: 23, 10: 15 },
        '56-65': { 90: 43, 80: 38, 70: 33, 60: 33, 50: 28, 40: 23, 30: 23, 20: 18, 10: 13 },
        '>65':   { 90: 43, 80: 38, 70: 33, 60: 30, 50: 25, 40: 23, 30: 20, 20: 18, 10: 10 },
    },
    female: {
        '18-25': { 90: 61, 80: 56, 70: 53, 60: 51, 50: 48, 40: 46, 30: 43, 20: 41, 10: 36 },
        '26-35': { 90: 58, 80: 53, 70: 51, 60: 51, 50: 48, 40: 43, 30: 41, 20: 38, 10: 33 },
        '36-45': { 90: 56, 80: 53, 70: 48, 60: 46, 50: 43, 40: 41, 30: 38, 20: 36, 10: 30 },
        '46-55': { 90: 53, 80: 51, 70: 46, 60: 43, 50: 41, 40: 36, 30: 36, 20: 30, 10: 25 },
        '56-65': { 90: 51, 80: 48, 70: 43, 60: 41, 50: 38, 40: 36, 30: 33, 20: 28, 10: 23 },
        '>65':   { 90: 51, 80: 46, 70: 43, 60: 43, 50: 38, 40: 36, 30: 33, 20: 28, 10: 23 },
    }
};

// Defines the percentile threshold for each point level.
export const pointThresholds = [
    { points: 5, percentile: 90 },
    { points: 4, percentile: 70 },
    { points: 3, percentile: 50 },
    { points: 2, percentile: 30 },
    { points: 1, percentile: 10 },
];

// Maps app age ranges to benchmark age ranges.
export const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "18-25",
    "30-39 ปี": "26-35",
    "40-49 ปี": "36-45",
    "50-59 ปี": "46-55",
    "60-69 ปี": "56-65",
    "70+ ปี": ">65",
};

export const reverseAgeGroupMapping = Object.fromEntries(Object.entries(ageGroupMapping).map(([key, value]) => [value, key]));

interface SitReachResult {
    points: number;
    label: string;
}

/**
 * Calculates the Sit and Reach points based on gender, age, and score.
 * A higher score is better.
 * @returns An object containing the points and label.
 */
export function calculateSitReachResult(gender: 'male' | 'female', ageRange: string, score: number): SitReachResult {
    const ageKey = ageGroupMapping[ageRange] as keyof typeof sitReachBenchmarkData.male;
    if (!ageKey) return { points: 0, label: 'N/A' };
    
    const benchmarks = sitReachBenchmarkData[gender][ageKey];
    if (!benchmarks) return { points: 0, label: 'N/A' };
    
    // Check from highest points to lowest to find the first match.
    for (const threshold of pointThresholds) {
        const requiredScore = benchmarks[threshold.percentile as keyof typeof benchmarks];
        if (score >= requiredScore) {
            return {
                points: threshold.points,
                label: pointLevels[threshold.points],
            };
        }
    }
    
    // If score is below all defined percentile thresholds, it's the lowest category.
    return { points: 1, label: pointLevels[1] };
}
