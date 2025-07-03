"use client";

export const pointLevels: { [key: number]: string } = {
    5: 'Strong',
    3: 'Normal',
    1: 'Weak',
};

// Data for display in the UI table (text format).
export const gripBenchmarkTextData = {
    male: {
        '18-19': { '5': '>122.4', '3': '78.7-122.4', '1': '<78.7' },
        '20-24': { '5': '>124.8', '3': '81.1-124.8', '1': '<81.1' },
        '25-29': { '5': '>126.8', '3': '83.1-126.8', '1': '<83.1' },
        '30-34': { '5': '>123.0', '3': '79.4-123.0', '1': '<79.4' },
        '35-39': { '5': '>122.6', '3': '78.9-122.6', '1': '<78.9' },
        '40-44': { '5': '>121.9', '3': '78.3-121.9', '1': '<78.3' },
        '45-49': { '5': '>120.2', '3': '76.5-120.2', '1': '<76.5' },
        '50-54': { '5': '>111.8', '3': '72.5-111.8', '1': '<72.5' },
        '55-59': { '5': '>106.9', '3': '67.7-106.9', '1': '<67.7' },
        '60-64': { '5': '>105.8', '3': '66.6-105.8', '1': '<66.6' },
        '64-69': { '5': '>97.0',  '3': '62.2-97.0',  '1': '<62.2' },
        '70-99': { '5': '>77.4',  '3': '47.0-77.4',  '1': '<47.0' },
    },
    female: {
        '18-19': { '5': '>68.3', '3': '42.3-68.3', '1': '<42.3' },
        '20-24': { '5': '>77.8', '3': '47.4-77.8', '1': '<47.4' },
        '25-29': { '5': '>91.3', '3': '56.4-91.3', '1': '<56.4' },
        '30-34': { '5': '>77.8', '3': '47.4-77.8', '1': '<47.4' },
        '35-39': { '5': '>75.2', '3': '44.8-75.2', '1': '<44.8' },
        '40-44': { '5': '>72.1', '3': '41.7-72.1', '1': '<41.7' },
        '45-49': { '5': '>71.4', '3': '41.0-71.4', '1': '<41.0' },
        '50-54': { '5': '>70.3', '3': '39.9-70.3', '1': '<39.9' },
        '55-59': { '5': '>69.4', '3': '39.0-69.4', '1': '<39.0' },
        '60-64': { '5': '>68.3', '3': '37.9-68.3', '1': '<37.9' },
        '64-69': { '5': '>60.0', '3': '34.0-60.0', '1': '<34.0' },
        '70-99': { '5': '>54.0', '3': '32.4-54.0', '1': '<32.4' },
    }
};

const gripCalculationData = {
    male: {
        '18-19': { normalMin: 78.7, strongMin: 122.5 },
        '20-24': { normalMin: 81.1, strongMin: 124.9 },
        '25-29': { normalMin: 83.1, strongMin: 126.9 },
        '30-34': { normalMin: 79.4, strongMin: 123.1 },
        '35-39': { normalMin: 78.9, strongMin: 122.7 },
        '40-44': { normalMin: 78.3, strongMin: 122.0 },
        '45-49': { normalMin: 76.5, strongMin: 120.3 },
        '50-54': { normalMin: 72.5, strongMin: 111.9 },
        '55-59': { normalMin: 67.7, strongMin: 107.0 },
        '60-64': { normalMin: 66.6, strongMin: 105.9 },
        '64-69': { normalMin: 62.2, strongMin: 97.1 },
        '70-99': { normalMin: 47.0, strongMin: 77.5 },
    },
    female: {
        '18-19': { normalMin: 42.3, strongMin: 68.4 },
        '20-24': { normalMin: 47.4, strongMin: 77.9 },
        '25-29': { normalMin: 56.4, strongMin: 91.4 },
        '30-34': { normalMin: 47.4, strongMin: 77.9 },
        '35-39': { normalMin: 44.8, strongMin: 75.3 },
        '40-44': { normalMin: 41.7, strongMin: 72.2 },
        '45-49': { normalMin: 41.0, strongMin: 71.5 },
        '50-54': { normalMin: 39.9, strongMin: 70.4 },
        '55-59': { normalMin: 39.0, strongMin: 69.5 },
        '60-64': { normalMin: 37.9, strongMin: 68.4 },
        '64-69': { normalMin: 34.0, strongMin: 60.1 },
        '70-99': { normalMin: 32.4, strongMin: 54.1 },
    }
};

export const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "25-29",
    "30-39 ปี": "35-39",
    "40-49 ปี": "45-49",
    "50-59 ปี": "55-59",
    "60-69 ปี": "60-64", 
    "70+ ปี": "70-99",
};

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

    if (score >= thresholds.strongMin) {
        return { points: 5, label: pointLevels[5] };
    }
    if (score >= thresholds.normalMin) {
        return { points: 3, label: pointLevels[3] };
    }
    
    return { points: 1, label: pointLevels[1] };
}
