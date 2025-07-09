
"use client";

export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table (text format, in kg).
export const gripBenchmarkTextData = {
    male: {
        '20-29': { '5': '>50', '4': '45 - 50', '3': '40 - 44', '2': '35 - 39', '1': '<35' },
        '30-39': { '5': '>48', '4': '43 - 47', '3': '38 - 42', '2': '33 - 37', '1': '<33' },
        '40-49': { '5': '>46', '4': '41 - 45', '3': '36 - 40', '2': '31 - 35', '1': '<31' },
        '50-59': { '5': '>44', '4': '39 - 43', '3': '34 - 38', '2': '29 - 33', '1': '<29' },
        '60-69': { '5': '>42', '4': '37 - 41', '3': '32 - 36', '2': '27 - 31', '1': '<27' },
        '70+':   { '5': '>40', '4': '35 - 39', '3': '30 - 34', '2': '25 - 29', '1': '<25' },
    },
    female: {
        '20-29': { '5': '>35', '4': '30 - 34', '3': '25 - 29', '2': '20 - 24', '1': '<20' },
        '30-39': { '5': '>33', '4': '28 - 32', '3': '23 - 27', '2': '18 - 22', '1': '<18' },
        '40-49': { '5': '>31', '4': '26 - 30', '3': '21 - 25', '2': '16 - 20', '1': '<16' },
        '50-59': { '5': '>29', '4': '24 - 28', '3': '19 - 23', '2': '14 - 18', '1': '<14' },
        '60-69': { '5': '>27', '4': '22 - 26', '3': '17 - 21', '2': '12 - 16', '1': '<12' },
        '70+':   { '5': '>25', '4': '20 - 24', '3': '15 - 19', '2': '10 - 14', '1': '<10' },
    }
};

// Data for calculation logic (in kg).
const gripCalculationData = {
    male: {
        '20-29': [{ p: 5, t: 50.1 }, { p: 4, t: 45 }, { p: 3, t: 40 }, { p: 2, t: 35 }],
        '30-39': [{ p: 5, t: 48.1 }, { p: 4, t: 43 }, { p: 3, t: 38 }, { p: 2, t: 33 }],
        '40-49': [{ p: 5, t: 46.1 }, { p: 4, t: 41 }, { p: 3, t: 36 }, { p: 2, t: 31 }],
        '50-59': [{ p: 5, t: 44.1 }, { p: 4, t: 39 }, { p: 3, t: 34 }, { p: 2, t: 29 }],
        '60-69': [{ p: 5, t: 42.1 }, { p: 4, t: 37 }, { p: 3, t: 32 }, { p: 2, t: 27 }],
        '70+':   [{ p: 5, t: 40.1 }, { p: 4, t: 35 }, { p: 3, t: 30 }, { p: 2, t: 25 }],
    },
    female: {
        '20-29': [{ p: 5, t: 35.1 }, { p: 4, t: 30 }, { p: 3, t: 25 }, { p: 2, t: 20 }],
        '30-39': [{ p: 5, t: 33.1 }, { p: 4, t: 28 }, { p: 3, t: 23 }, { p: 2, t: 18 }],
        '40-49': [{ p: 5, t: 31.1 }, { p: 4, t: 26 }, { p: 3, t: 21 }, { p: 2, t: 16 }],
        '50-59': [{ p: 5, t: 29.1 }, { p: 4, t: 24 }, { p: 3, t: 19 }, { p: 2, t: 14 }],
        '60-69': [{ p: 5, t: 27.1 }, { p: 4, t: 22 }, { p: 3, t: 17 }, { p: 2, t: 12 }],
        '70+':   [{ p: 5, t: 25.1 }, { p: 4, t: 20 }, { p: 3, t: 15 }, { p: 2, t: 10 }],
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
