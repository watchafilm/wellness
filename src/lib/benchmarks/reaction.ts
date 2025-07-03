
export const pointLevels: { [key: number]: string } = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Avg',
    1: 'Poor',
};

// Data for display in the UI table (text format, in seconds).
// Lower is better.
export const reactionBenchmarkTextData = {
    male: {
        '20-29': { '5': '< 0.320', '4': '0.320-0.340', '3': '0.341-0.370', '2': '0.371-0.400', '1': '> 0.400' },
        '30-39': { '5': '< 0.325', '4': '0.325-0.345', '3': '0.346-0.375', '2': '0.376-0.405', '1': '> 0.405' },
        '40-49': { '5': '< 0.340', '4': '0.340-0.360', '3': '0.361-0.390', '2': '0.391-0.420', '1': '> 0.420' },
        '50-59': { '5': '< 0.360', '4': '0.360-0.380', '3': '0.381-0.410', '2': '0.411-0.440', '1': '> 0.440' },
        '60-69': { '5': '< 0.380', '4': '0.380-0.400', '3': '0.401-0.430', '2': '0.431-0.460', '1': '> 0.460' },
        '70+':   { '5': '< 0.400', '4': '0.400-0.420', '3': '0.421-0.450', '2': '0.451-0.480', '1': '> 0.480' },
    },
    female: {
        '20-29': { '5': '< 0.340', '4': '0.340-0.360', '3': '0.361-0.390', '2': '0.391-0.420', '1': '> 0.420' },
        '30-39': { '5': '< 0.350', '4': '0.350-0.370', '3': '0.371-0.400', '2': '0.401-0.430', '1': '> 0.430' },
        '40-49': { '5': '< 0.365', '4': '0.365-0.385', '3': '0.386-0.415', '2': '0.416-0.445', '1': '> 0.445' },
        '50-59': { '5': '< 0.385', '4': '0.385-0.405', '3': '0.406-0.435', '2': '0.436-0.465', '1': '> 0.465' },
        '60-69': { '5': '< 0.405', '4': '0.405-0.425', '3': '0.426-0.455', '2': '0.456-0.485', '1': '> 0.485' },
        '70+':   { '5': '< 0.425', '4': '0.425-0.445', '3': '0.446-0.475', '2': '0.476-0.505', '1': '> 0.505' },
    }
};

// Data for calculation logic, structured as an array of thresholds from best (lowest time) to worst.
const reactionCalculationData = {
    male: {
        '20-29': [{ p: 5, t: 0.319 }, { p: 4, t: 0.340 }, { p: 3, t: 0.370 }, { p: 2, t: 0.400 }],
        '30-39': [{ p: 5, t: 0.324 }, { p: 4, t: 0.345 }, { p: 3, t: 0.375 }, { p: 2, t: 0.405 }],
        '40-49': [{ p: 5, t: 0.339 }, { p: 4, t: 0.360 }, { p: 3, t: 0.390 }, { p: 2, t: 0.420 }],
        '50-59': [{ p: 5, t: 0.359 }, { p: 4, t: 0.380 }, { p: 3, t: 0.410 }, { p: 2, t: 0.440 }],
        '60-69': [{ p: 5, t: 0.379 }, { p: 4, t: 0.400 }, { p: 3, t: 0.430 }, { p: 2, t: 0.460 }],
        '70+':   [{ p: 5, t: 0.399 }, { p: 4, t: 0.420 }, { p: 3, t: 0.450 }, { p: 2, t: 0.480 }],
    },
    female: {
        '20-29': [{ p: 5, t: 0.339 }, { p: 4, t: 0.360 }, { p: 3, t: 0.390 }, { p: 2, t: 0.420 }],
        '30-39': [{ p: 5, t: 0.349 }, { p: 4, t: 0.370 }, { p: 3, t: 0.400 }, { p: 2, t: 0.430 }],
        '40-49': [{ p: 5, t: 0.364 }, { p: 4, t: 0.385 }, { p: 3, t: 0.415 }, { p: 2, t: 0.445 }],
        '50-59': [{ p: 5, t: 0.384 }, { p: 4, t: 0.405 }, { p: 3, t: 0.435 }, { p: 2, t: 0.465 }],
        '60-69': [{ p: 5, t: 0.404 }, { p: 4, t: 0.425 }, { p: 3, t: 0.455 }, { p: 2, t: 0.485 }],
        '70+':   [{ p: 5, t: 0.424 }, { p: 4, t: 0.445 }, { p: 3, t: 0.475 }, { p: 2, t: 0.505 }],
    }
};

export const ageGroupMapping: { [key: string]: string } = {
    "20-29 ปี": "20-29", "30-39 ปี": "30-39", "40-49 ปี": "40-49",
    "50-59 ปี": "50-59", "60-69 ปี": "60-69", "70+ ปี": "70+",
};

export const reverseAgeGroupMapping = Object.fromEntries(Object.entries(ageGroupMapping).map(([key, value]) => [value, key]));

interface ReactionResult {
    points: number;
    label: string;
}

/**
 * Calculates the Reaction Time points based on gender, age, and score (in seconds).
 * A lower score is better.
 * @returns An object containing the points and label.
 */
export function calculateReactionResult(gender: 'male' | 'female', ageRange: string, score: number): ReactionResult {
    const ageKey = ageGroupMapping[ageRange] as keyof typeof reactionCalculationData.male;
    if (!ageKey) return { points: 0, label: 'N/A' };

    const thresholds = reactionCalculationData[gender][ageKey];
    if (!thresholds) return { points: 0, label: 'N/A' };

    for (const level of thresholds) {
        if (score <= level.t) {
            return { points: level.p, label: pointLevels[level.p] };
        }
    }
    
    // If score is higher than all thresholds, it's the lowest category.
    return { points: 1, label: pointLevels[1] };
}
