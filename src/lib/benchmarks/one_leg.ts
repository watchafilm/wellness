
export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table (text format)
export const oneLegBenchmarkTextData = {
    male: {
        '20-39': { '5': '>= 45.0', '4': '34.8 - 44.9', '3': '19.3 - 34.7', '2': '5.0 - 19.2', '1': '< 5.0' },
        '40-59': { '5': '>= 40.0', '4': '27.0 - 39.9', '3': '11.5 - 26.9', '2': '4.0 - 11.4', '1': '< 4.0' },
        '60-80': { '5': '>= 20.0', '4': '13.5 - 19.9', '3': '6.4 - 13.4', '2': '3.0 - 6.3', '1': '< 3.0' },
    },
    female: {
        '20-39': { '5': '>= 40.0', '4': '26.9 - 39.9', '3': '14.2 - 26.8', '2': '5.0 - 14.1', '1': '< 5.0' },
        '40-59': { '5': '>= 35.0', '4': '23.4 - 34.9', '3': '9.7 - 23.3', '2': '4.0 - 9.6', '1': '< 4.0' },
        '60-80': { '5': '>= 15.0', '4': '10.3 - 14.9', '3': '4.6 - 10.2', '2': '2.0 - 4.5', '1': '< 2.0' },
    }
};

// Data for calculation logic, simplified to make the calculation function more robust.
const oneLegCalculationData = {
    male: {
        '20-39': { '5': 45.0, '4': [34.8, 44.9], '3': [19.3, 34.7], '2': [5.0, 19.2] },
        '40-59': { '5': 40.0, '4': [27.0, 39.9], '3': [11.5, 26.9], '2': [4.0, 11.4] },
        '60-80': { '5': 20.0, '4': [13.5, 19.9], '3': [6.4, 13.4], '2': [3.0, 6.3] },
    },
    female: {
        '20-39': { '5': 40.0, '4': [26.9, 39.9], '3': [14.2, 26.8], '2': [5.0, 14.1] },
        '40-59': { '5': 35.0, '4': [23.4, 34.9], '3': [9.7, 23.3], '2': [4.0, 9.6] },
        '60-80': { '5': 15.0, '4': [10.3, 14.9], '3': [4.6, 10.2], '2': [2.0, 4.5] },
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

    const benchmarks = oneLegCalculationData[gender][ageKey];
    if (!benchmarks) return { points: 0, label: 'N/A' };

    // Check from highest points to lowest
    if (score >= benchmarks['5']) return { points: 5, label: pointLevels[5] };
    
    const range4 = benchmarks['4'];
    if (score >= range4[0] && score <= range4[1]) return { points: 4, label: pointLevels[4] };
    
    const range3 = benchmarks['3'];
    if (score >= range3[0] && score <= range3[1]) return { points: 3, label: pointLevels[3] };
    
    const range2 = benchmarks['2'];
    if (score >= range2[0] && score <= range2[1]) return { points: 2, label: pointLevels[2] };
    
    // If it's none of the above, it's poor (point 1)
    return { points: 1, label: pointLevels[1] };
}
