
// Data extracted from "TABLE 4.17. Fitness Categories for the YMCA Sit-and-Reach Test (in) by Age and Sex"
// Although the table specifies inches, we are treating the values as cm to maintain consistency with the rest of the application's units.

// Defines the categories and their corresponding percentile scores and points for calculation.
export const percentileCategories = [
    { percentile: 90, label: "Well above average", points: 5 },
    { percentile: 80, label: "Above average", points: 4 },
    { percentile: 70, label: "Above average", points: 4 },
    { percentile: 60, label: "Average", points: 3 },
    { percentile: 50, label: "Average", points: 3 },
    { percentile: 40, label: "Below average", points: 2 },
    { percentile: 30, label: "Below average", points: 2 },
    { percentile: 20, label: "Well below average", points: 1 },
    { percentile: 10, label: "Well below average", points: 1 },
];

// Defines the categories for display in the UI table. We simplify to show the lower bound of each major category.
export const displayCategories = [
    { label: "Well above average", percentile: 90, points: 5 },
    { label: "Above average", percentile: 70, points: 4 },
    { label: "Average", percentile: 50, points: 3 },
    { label: "Below average", percentile: 30, points: 2 },
    { label: "Well below average", percentile: 10, points: 1 },
].sort((a, b) => b.percentile - a.percentile);


// The raw benchmark data from the table.
export const sitReachBenchmarkData = {
    male: {
        '18-25': { 90: 22, 80: 20, 70: 19, 60: 18, 50: 17, 40: 15, 30: 14, 20: 13, 10: 11 },
        '26-35': { 90: 21, 80: 19, 70: 17, 60: 17, 50: 15, 40: 14, 30: 13, 20: 11, 10: 9 },
        '36-45': { 90: 21, 80: 19, 70: 17, 60: 16, 50: 15, 40: 13, 30: 13, 20: 11, 10: 7 },
        '46-55': { 90: 19, 80: 17, 70: 15, 60: 14, 50: 13, 40: 11, 30: 10, 20: 9, 10: 6 },
        '56-65': { 90: 17, 80: 15, 70: 13, 60: 13, 50: 11, 40: 9, 30: 9, 20: 7, 10: 5 },
        '>65':   { 90: 17, 80: 15, 70: 13, 60: 12, 50: 10, 40: 9, 30: 8, 20: 7, 10: 4 },
    },
    female: {
        '18-25': { 90: 24, 80: 22, 70: 21, 60: 20, 50: 19, 40: 18, 30: 17, 20: 16, 10: 14 },
        '26-35': { 90: 23, 80: 21, 70: 20, 60: 20, 50: 19, 40: 17, 30: 16, 20: 15, 10: 13 },
        '36-45': { 90: 22, 80: 21, 70: 19, 60: 18, 50: 17, 40: 16, 30: 15, 20: 14, 10: 12 },
        '46-55': { 90: 21, 80: 20, 70: 18, 60: 17, 50: 16, 40: 14, 30: 14, 20: 12, 10: 10 },
        '56-65': { 90: 20, 80: 19, 70: 17, 60: 16, 50: 15, 40: 14, 30: 13, 20: 11, 10: 9 },
        '>65':   { 90: 20, 80: 18, 70: 17, 60: 17, 50: 15, 40: 14, 30: 13, 20: 11, 10: 9 },
    }
};

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
    percentile: number;
}

/**
 * Calculates the Sit and Reach category based on gender, age, and score.
 * A higher score is better.
 * @returns An object containing the points, label, and matched percentile.
 */
export function calculateSitReachResult(gender: 'male' | 'female', ageRange: string, score: number): SitReachResult {
    const ageKey = ageGroupMapping[ageRange] as keyof typeof sitReachBenchmarkData.male;
    if (!ageKey) return { points: 0, label: 'Poor', percentile: 0 };
    
    const benchmarks = sitReachBenchmarkData[gender][ageKey];
    if (!benchmarks) return { points: 0, label: 'Poor', percentile: 0 };
    
    // Sort categories from highest percentile to lowest to find the first match.
    const sortedCategories = [...percentileCategories].sort((a, b) => b.percentile - a.percentile);

    for (const category of sortedCategories) {
        const requiredScore = benchmarks[category.percentile as keyof typeof benchmarks];
        if (score >= requiredScore) {
            return {
                points: category.points,
                label: category.label,
                percentile: category.percentile,
            };
        }
    }
    
    return { points: 0, label: 'Poor', percentile: 0 };
}
