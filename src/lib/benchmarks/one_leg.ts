
export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table (text format).
// The range from the source table (e.g., 19.3-34.8) is split into 3 levels (2, 3, 4).
// Level 1 is below the min, Level 5 is above the max.
export const oneLegBenchmarkTextData = {
    male: {
        '20-39': { '5': '> 34.8', '4': '29.7 - 34.8', '3': '24.5 - 29.6', '2': '19.3 - 24.4', '1': '< 19.3' },
        '40-59': { '5': '> 26.9', '4': '21.9 - 26.9', '3': '16.7 - 21.8', '2': '11.5 - 16.6', '1': '< 11.5' },
        '60-80': { '5': '> 13.4', '4': '11.2 - 13.4', '3': '8.8 - 11.1',  '2': '6.4 - 8.7',   '1': '< 6.4' },
    },
    female: {
        '20-39': { '5': '> 26.8', '4': '22.6 - 26.8', '3': '18.4 - 22.5', '2': '14.2 - 18.3', '1': '< 14.2' },
        '40-59': { '5': '> 23.3', '4': '18.9 - 23.3', '3': '14.3 - 18.8', '2': '9.7 - 14.2',  '1': '< 9.7' },
        '60-80': { '5': '> 10.2', '4': '8.4 - 10.2',  '3': '6.5 - 8.3',   '2': '4.6 - 6.4',   '1': '< 4.6' },
    }
};

// Data for calculation logic, structured as an array of thresholds from highest to lowest.
const oneLegCalculationData = {
    male: {
        '20-39': [ // min: 19.3, max: 34.8
            { points: 5, threshold: 34.9 },
            { points: 4, threshold: 29.7 },
            { points: 3, threshold: 24.5 },
            { points: 2, threshold: 19.3 },
        ],
        '40-59': [ // min: 11.5, max: 26.9
            { points: 5, threshold: 27.0 },
            { points: 4, threshold: 21.9 },
            { points: 3, threshold: 16.7 },
            { points: 2, threshold: 11.5 },
        ],
        '60-80': [ // min: 6.4, max: 13.4
            { points: 5, threshold: 13.5 },
            { points: 4, threshold: 11.2 },
            { points: 3, threshold: 8.8 },
            { points: 2, threshold: 6.4 },
        ],
    },
    female: {
        '20-39': [ // min: 14.2, max: 26.8
            { points: 5, threshold: 26.9 },
            { points: 4, threshold: 22.6 },
            { points: 3, threshold: 18.4 },
            { points: 2, threshold: 14.2 },
        ],
        '40-59': [ // min: 9.7, max: 23.3
            { points: 5, threshold: 23.4 },
            { points: 4, threshold: 18.9 },
            { points: 3, threshold: 14.3 },
            { points: 2, threshold: 9.7 },
        ],
        '60-80': [ // min: 4.6, max: 10.2
            { points: 5, threshold: 10.3 },
            { points: 4, threshold: 8.4 },
            { points: 3, threshold: 6.5 },
            { points: 2, threshold: 4.6 },
        ],
    }
};

// Maps app age ranges to benchmark age ranges
export const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-39",
    "30-39 ปี": "20-39",
    "40-49 ปี": "40-59",
    "50-59 ปี": "40-59",
    "60-69 ปี": "60-80",
    "70+ ปี": "60-80",
};

export const reverseAgeGroupMapping = {
    "20-39": "20-39 ปี",
    "40-59": "40-59 ปี",
    "60-80": "60-80 ปี",
};


interface OneLegResult {
    points: number;
    label: string;
}

/**
 * Calculates the One Leg Stand points based on gender, age, and score (in seconds).
 * A higher score is better.
 * @returns An object containing the points and label.
 */
export function calculateOneLegResult(gender: 'male' | 'female', ageRange: string, score: number): OneLegResult {
    const ageKey = ageGroupMapping[ageRange] as keyof typeof oneLegCalculationData.male;
    if (!ageKey) return { points: 0, label: 'N/A' };

    const thresholds = oneLegCalculationData[gender][ageKey];
    if (!thresholds) return { points: 0, label: 'N/A' };

    for (const level of thresholds) {
        if (score >= level.threshold) {
            return { points: level.points, label: pointLevels[level.points] };
        }
    }
    
    // If score is below all thresholds, it's the lowest category.
    return { points: 1, label: pointLevels[1] };
}
