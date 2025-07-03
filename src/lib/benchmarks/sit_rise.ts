
export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Poor',
};

// Data for display in the UI table
export const sitRiseBenchmarkTextData = {
    male: {
        '20-29': { '5': '>=9.0', '4': '8.5-8.9', '3': '8.0-8.4', '2': '<8.0' },
        '30-39': { '5': '>=9.0', '4': '8.0-8.9', '3': '7.5-7.9', '2': '<7.5' },
        '40-49': { '5': '>=8.5', '4': '7.5-8.4', '3': '7.0-7.4', '2': '<7.0' },
        '50-59': { '5': '>=8.0', '4': '7.0-7.9', '3': '6.0-6.9', '2': '<6.0' },
        '60-69': { '5': '>=7.5', '4': '6.5-7.4', '3': '5.5-6.4', '2': '<5.5' },
        '70+':   { '5': '>=6.5', '4': '5.0-6.4', '3': '2.5-4.9', '2': '<2.5' },
    },
    female: {
        '20-29': { '5': '>=9.5', '4': '9.0-9.4', '3': '8.5-8.9', '2': '<8.5' },
        '30-39': { '5': '>=9.5', '4': '8.5-9.4', '3': '8.0-8.4', '2': '<8.0' },
        '40-49': { '5': '>=9.0', '4': '8.0-8.9', '3': '7.5-7.9', '2': '<7.5' },
        '50-59': { '5': '>=8.5', '4': '7.5-8.4', '3': '7.0-7.4', '2': '<7.0' },
        '60-69': { '5': '>=8.0', '4': '7.0-7.9', '3': '6.0-6.9', '2': '<6.0' },
        '70+':   { '5': '>=7.0', '4': '6.0-6.9', '3': '3.5-5.9', '2': '<3.5' },
    },
};

// Data for calculation. Ranges are [min, max]. For points 5, it's score >= value. For points 2, it's score < value.
const sitRiseCalculationData = {
    male: {
        '20-29': { '5': 9.0, '4': [8.5, 8.99], '3': [8.0, 8.49], '2': 8.0 },
        '30-39': { '5': 9.0, '4': [8.0, 8.99], '3': [7.5, 7.99], '2': 7.5 },
        '40-49': { '5': 8.5, '4': [7.5, 8.49], '3': [7.0, 7.49], '2': 7.0 },
        '50-59': { '5': 8.0, '4': [7.0, 7.99], '3': [6.0, 6.99], '2': 6.0 },
        '60-69': { '5': 7.5, '4': [6.5, 7.49], '3': [5.5, 6.49], '2': 5.5 },
        '70+':   { '5': 6.5, '4': [5.0, 6.49], '3': [2.5, 4.99], '2': 2.5 },
    },
    female: {
        '20-29': { '5': 9.5, '4': [9.0, 9.49], '3': [8.5, 8.99], '2': 8.5 },
        '30-39': { '5': 9.5, '4': [8.5, 9.49], '3': [8.0, 8.49], '2': 8.0 },
        '40-49': { '5': 9.0, '4': [8.0, 8.99], '3': [7.5, 7.99], '2': 7.5 },
        '50-59': { '5': 8.5, '4': [7.5, 8.49], '3': [7.0, 7.49], '2': 7.0 },
        '60-69': { '5': 8.0, '4': [7.0, 7.99], '3': [6.0, 6.99], '2': 6.0 },
        '70+':   { '5': 7.0, '4': [6.0, 6.99], '3': [3.5, 5.99], '2': 3.5 },
    },
};

const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29", "30-39 ปี": "30-39", "40-49 ปี": "40-49",
    "50-59 ปี": "50-59", "60-69 ปี": "60-69", "70+ ปี": "70+",
};


export function calculateSitRisePoints(gender: 'male' | 'female', ageRange: string, score: number): number {
    const ageGroupKey = ageGroupMapping[ageRange];
    if (!ageGroupKey) return 0;
    
    const benchmarks = sitRiseCalculationData[gender][ageGroupKey as keyof typeof sitRiseCalculationData.male];
    if (!benchmarks) return 0;
    
    // Check from highest points to lowest
    for (const p of [5, 4, 3, 2]) {
        const pointsKey = p.toString() as keyof typeof benchmarks;
        const range = benchmarks[pointsKey];

        if (typeof range === 'number') {
            if (p === 5 && score >= range) return 5;
            if (p === 2 && score < range) return 2;
        } else if (Array.isArray(range)) {
            if (score >= range[0] && score <= range[1]) {
                return p;
            }
        }
    }
    
    // If score is below the "Poor" threshold, it's still "Poor".
    return 2;
}
