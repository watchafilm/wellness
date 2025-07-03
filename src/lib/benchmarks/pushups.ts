
export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table
export const pushupsBenchmarkTextData = {
    male: {
        '20-29': { '5': '>44', '4': '34-44', '3': '29-33', '2': '17-28', '1': '<17' },
        '30-39': { '5': '>34', '4': '25-34', '3': '20-24', '2': '12-19', '1': '<12' },
        '40-49': { '5': '>29', '4': '20-29', '3': '15-19', '2': '10-14', '1': '<10' },
        '50-59': { '5': '>24', '4': '15-24', '3': '10-14', '2': '7-9',   '1': '<7' },
        '60-69': { '5': '>19', '4': '10-19', '3': '8-9',   '2': '5-7',   '1': '<5' },
        '70+':   { '5': '>10', '4': '8-10',  '3': '5-7',   '2': '2-4',   '1': '<2' },
    },
    female: {
        '20-29': { '5': '>34', '4': '25-34', '3': '20-24', '2': '10-19', '1': '<10' },
        '30-39': { '5': '>29', '4': '21-29', '3': '15-20', '2': '8-14',  '1': '<8' },
        '40-49': { '5': '>24', '4': '15-24', '3': '11-14', '2': '5-10',  '1': '<5' },
        '50-59': { '5': '>19', '4': '12-19', '3': '8-11',  '2': '3-7',   '1': '<3' },
        '60-69': { '5': '>14', '4': '10-14', '3': '5-9',   '2': '2-4',   '1': '<2' },
        '70+':   { '5': '>9',  '4': '5-9',   '3': '3-4',   '2': '1-2',   '1': '<1' },
    },
};

// Data for calculation. Ranges are [min, max]. Single numbers are boundaries.
// For points 5, it's score >= value. For points 1, it's score <= value.
const pushupsCalculationData = {
    male: {
        '20-29': { '5': 45, '4': [34, 44], '3': [29, 33], '2': [17, 28], '1': 16 },
        '30-39': { '5': 35, '4': [25, 34], '3': [20, 24], '2': [12, 19], '1': 11 },
        '40-49': { '5': 30, '4': [20, 29], '3': [15, 19], '2': [10, 14], '1': 9 },
        '50-59': { '5': 25, '4': [15, 24], '3': [10, 14], '2': [7, 9], '1': 6 },
        '60-69': { '5': 20, '4': [10, 19], '3': [8, 9], '2': [5, 7], '1': 4 },
        '70+':   { '5': 11, '4': [8, 10], '3': [5, 7], '2': [2, 4], '1': 1 },
    },
    female: {
        '20-29': { '5': 35, '4': [25, 34], '3': [20, 24], '2': [10, 19], '1': 9 },
        '30-39': { '5': 30, '4': [21, 29], '3': [15, 20], '2': [8, 14], '1': 7 },
        '40-49': { '5': 25, '4': [15, 24], '3': [11, 14], '2': [5, 10], '1': 4 },
        '50-59': { '5': 20, '4': [12, 19], '3': [8, 11], '2': [3, 7], '1': 2 },
        '60-69': { '5': 15, '4': [10, 14], '3': [5, 9], '2': [2, 4], '1': 1 },
        '70+':   { '5': 10, '4': [5, 9], '3': [3, 4], '2': [1, 2], '1': 0 },
    },
};

const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29", "30-39 ปี": "30-39", "40-49 ปี": "40-49",
    "50-59 ปี": "50-59", "60-69 ปี": "60-69", "70+ ปี": "70+",
};


export function calculatePushupsPoints(gender: 'male' | 'female', ageRange: string, score: number): number {
    const ageGroupKey = ageGroupMapping[ageRange];
    if (!ageGroupKey) return 0;
    
    const benchmarks = pushupsCalculationData[gender][ageGroupKey as keyof typeof pushupsCalculationData.male];
    if (!benchmarks) return 0;
    
    // Check from highest points to lowest
    for (const p of [5, 4, 3, 2, 1]) {
        const pointsKey = p.toString() as keyof typeof benchmarks;
        const range = benchmarks[pointsKey];

        if (typeof range === 'number') {
            if (p === 5 && score >= range) return 5;
            if (p === 1 && score <= range) return 1;
        } else if (Array.isArray(range)) {
            if (score >= range[0] && score <= range[1]) {
                return p;
            }
        }
    }
    
    return 1; // Default to lowest if score is below all ranges
}
