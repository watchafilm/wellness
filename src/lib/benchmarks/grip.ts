"use client";

export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table (text format).
export const gripBenchmarkTextData = {
    male: {
        '20-29': { '5': '>125.9', '4': '111.4 - 125.9', '3': '96.8 - 111.3', '2': '82.2 - 96.7', '1': '<82.2' },
        '30-39': { '5': '>122.9', '4': '108.4 - 122.9', '3': '93.8 - 108.3', '2': '79.2 - 93.7', '1': '<79.2' },
        '40-49': { '5': '>121.2', '4': '106.7 - 121.2', '3': '92.1 - 106.6', '2': '77.5 - 92.0', '1': '<77.5' },
        '50-59': { '5': '>109.5', '4': '96.4 - 109.5', '3': '83.2 - 96.3', '2': '70.1 - 83.1', '1': '<70.1' },
        '60-69': { '5': '>101.5', '4': '89.2 - 101.5', '3': '76.8 - 89.1', '2': '64.4 - 76.7', '1': '<64.4' },
        '70+':   { '5': '>77.5',  '4': '67.4 - 77.5',  '3': '57.2 - 67.3', '2': '47.0 - 57.1', '1': '<47.0' },
    },
    female: {
        '20-29': { '5': '>84.7', '4': '73.8 - 84.7', '3': '62.8 - 73.7', '2': '51.9 - 62.7', '1': '<51.9' },
        '30-39': { '5': '>76.6', '4': '66.5 - 76.6', '3': '56.3 - 66.4', '2': '46.1 - 56.2', '1': '<46.1' },
        '40-49': { '5': '>71.9', '4': '61.8 - 71.9', '3': '51.6 - 61.7', '2': '41.4 - 51.5', '1': '<41.4' },
        '50-59': { '5': '>70.0', '4': '59.9 - 70.0', '3': '49.7 - 59.8', '2': '39.5 - 49.6', '1': '<39.5' },
        '60-69': { '5': '>64.3', '4': '54.9 - 64.3', '3': '45.4 - 54.8', '2': '36.0 - 45.3', '1': '<36.0' },
        '70+':   { '5': '>54.1', '4': '47.0 - 54.1', '3': '39.7 - 46.9', '2': '32.4 - 39.6', '1': '<32.4' },
    }
};

const gripCalculationData = {
    male: {
        '20-29': [{ p: 5, t: 126.0 }, { p: 4, t: 111.4 }, { p: 3, t: 96.8 }, { p: 2, t: 82.2 }],
        '30-39': [{ p: 5, t: 123.0 }, { p: 4, t: 108.4 }, { p: 3, t: 93.8 }, { p: 2, t: 79.2 }],
        '40-49': [{ p: 5, t: 121.3 }, { p: 4, t: 106.7 }, { p: 3, t: 92.1 }, { p: 2, t: 77.5 }],
        '50-59': [{ p: 5, t: 109.6 }, { p: 4, t: 96.4 }, { p: 3, t: 83.2 }, { p: 2, t: 70.1 }],
        '60-69': [{ p: 5, t: 101.6 }, { p: 4, t: 89.2 }, { p: 3, t: 76.8 }, { p: 2, t: 64.4 }],
        '70+':   [{ p: 5, t: 77.6 }, { p: 4, t: 67.4 }, { p: 3, t: 57.2 }, { p: 2, t: 47.0 }],
    },
    female: {
        '20-29': [{ p: 5, t: 84.8 }, { p: 4, t: 73.8 }, { p: 3, t: 62.8 }, { p: 2, t: 51.9 }],
        '30-39': [{ p: 5, t: 76.7 }, { p: 4, t: 66.5 }, { p: 3, t: 56.3 }, { p: 2, t: 46.1 }],
        '40-49': [{ p: 5, t: 72.0 }, { p: 4, t: 61.8 }, { p: 3, t: 51.6 }, { p: 2, t: 41.4 }],
        '50-59': [{ p: 5, t: 70.1 }, { p: 4, t: 59.9 }, { p: 3, t: 49.7 }, { p: 2, t: 39.5 }],
        '60-69': [{ p: 5, t: 64.4 }, { p: 4, t: 54.9 }, { p: 3, t: 45.4 }, { p: 2, t: 36.0 }],
        '70+':   [{ p: 5, t: 54.2 }, { p: 4, t: 47.0 }, { p: 3, t: 39.7 }, { p: 2, t: 32.4 }],
    }
};

export const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29",
    "30-39 ปี": "30-39",
    "40-49 ปี": "40-49",
    "50-59 ปี": "50-59",
    "60-69 ปี": "60-69",
    "70+ ปี": "70+",
};
export const reverseAgeGroupMapping = Object.fromEntries(Object.entries(ageGroupMapping).map(([key, value]) => [value, key]));

export const displayAgeGroups = Object.keys(gripBenchmarkTextData.male);

interface GripResult {
    points: number;
    label: string;
}

export function calculateGripPoints(gender: 'male' | 'female', ageRange: string, score: number): GripResult {
    const ageKey = ageGroupMapping[ageRange] as keyof typeof gripCalculationData.male;
    if (!ageKey) return { points: 0, label: 'N/A' };

    const thresholds = gripCalculationData[gender][ageKey];
    if (!thresholds) return { points: 0, label: 'N/A' };

    for (const level of thresholds) {
        if (score >= level.t) {
            return { points: level.p, label: pointLevels[level.p] };
        }
    }
    
    return { points: 1, label: pointLevels[1] };
}
