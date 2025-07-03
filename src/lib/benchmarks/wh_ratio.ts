
"use client";

export const pointColors: { [key: number]: string } = {
    5: 'bg-green-300/60 dark:bg-green-800/60',      // Healthy
    4: 'bg-yellow-200/60 dark:bg-yellow-700/60',   // Healthy-Acceptable
    3: 'bg-orange-300/60 dark:bg-orange-600/60',     // Overweight
    2: 'bg-red-300/60 dark:bg-red-800/60',         // High Risk
    1: 'bg-red-500/60 dark:bg-red-950/60',         // Very High Risk
};

export const pointLevels: { [key: number]: string } = {
    5: 'Healthy',
    4: 'Acceptable',
    3: 'Overweight',
    2: 'High Risk',
    1: 'Very High Risk',
};

// Data for table axes
export const femaleWaistValues = Array.from({ length: 17 }, (_, i) => 28 + i); // 28 to 44
export const femaleHeightValues = Array.from({ length: 17 }, (_, i) => 56 + i); // 56 to 72
export const maleWaistValues = Array.from({ length: 17 }, (_, i) => 30 + i); // 30 to 46
export const maleHeightValues = Array.from({ length: 17 }, (_, i) => 62 + i); // 62 to 78


type PointThreshold = { toHeight: number; points: number };
type GenderPointData = { [waist: number]: PointThreshold[] };

/**
 * This data defines the point system based on the color chart.
 * For a given gender and waist, it provides an array of height thresholds.
 * If a person's height is less than or equal to the `toHeight` value, they get the corresponding `points`.
 * The array is ordered, so the first match determines the score.
 */
export const whRatioPointData: { male: GenderPointData; female: GenderPointData } = {
    female: {
        28: [{ toHeight: 72, points: 5 }],
        29: [{ toHeight: 56, points: 4 }, { toHeight: 72, points: 5 }],
        30: [{ toHeight: 58, points: 4 }, { toHeight: 72, points: 5 }],
        31: [{ toHeight: 60, points: 4 }, { toHeight: 72, points: 5 }],
        32: [{ toHeight: 61, points: 3 }, { toHeight: 65, points: 4 }, { toHeight: 72, points: 5 }],
        33: [{ toHeight: 62, points: 3 }, { toHeight: 66, points: 4 }, { toHeight: 72, points: 5 }],
        34: [{ toHeight: 63, points: 3 }, { toHeight: 68, points: 4 }, { toHeight: 72, points: 5 }],
        35: [{ toHeight: 65, points: 3 }, { toHeight: 69, points: 4 }, { toHeight: 72, points: 5 }],
        36: [{ toHeight: 59, points: 2 }, { toHeight: 66, points: 3 }, { toHeight: 71, points: 4 }, { toHeight: 72, points: 5 }],
        37: [{ toHeight: 61, points: 2 }, { toHeight: 67, points: 3 }, { toHeight: 72, points: 4 }],
        38: [{ toHeight: 62, points: 2 }, { toHeight: 69, points: 3 }, { toHeight: 72, points: 4 }],
        39: [{ toHeight: 64, points: 2 }, { toHeight: 70, points: 3 }, { toHeight: 72, points: 4 }],
        40: [{ toHeight: 66, points: 2 }, { toHeight: 72, points: 3 }],
        41: [{ toHeight: 60, points: 1 }, { toHeight: 67, points: 2 }, { toHeight: 72, points: 3 }],
        42: [{ toHeight: 62, points: 1 }, { toHeight: 69, points: 2 }, { toHeight: 72, points: 3 }],
        43: [{ toHeight: 64, points: 1 }, { toHeight: 71, points: 2 }, { toHeight: 72, points: 3 }],
        44: [{ toHeight: 66, points: 1 }, { toHeight: 72, points: 2 }],
    },
    male: {
        30: [{ toHeight: 78, points: 5 }],
        31: [{ toHeight: 78, points: 5 }],
        32: [{ toHeight: 62, points: 4 }, { toHeight: 78, points: 5 }],
        33: [{ toHeight: 64, points: 4 }, { toHeight: 78, points: 5 }],
        34: [{ toHeight: 66, points: 4 }, { toHeight: 78, points: 5 }],
        35: [{ toHeight: 68, points: 4 }, { toHeight: 78, points: 5 }],
        36: [{ toHeight: 65, points: 3 }, { toHeight: 70, points: 4 }, { toHeight: 78, points: 5 }],
        37: [{ toHeight: 67, points: 3 }, { toHeight: 72, points: 4 }, { toHeight: 78, points: 5 }],
        38: [{ toHeight: 68, points: 3 }, { toHeight: 74, points: 4 }, { toHeight: 78, points: 5 }],
        39: [{ toHeight: 70, points: 3 }, { toHeight: 76, points: 4 }, { toHeight: 78, points: 5 }],
        40: [{ toHeight: 72, points: 3 }, { toHeight: 78, points: 4 }],
        41: [{ toHeight: 66, points: 2 }, { toHeight: 74, points: 3 }, { toHeight: 78, points: 4 }],
        42: [{ toHeight: 68, points: 2 }, { toHeight: 76, points: 3 }, { toHeight: 78, points: 4 }],
        43: [{ toHeight: 70, points: 2 }, { toHeight: 78, points: 3 }],
        44: [{ toHeight: 71, points: 2 }, { toHeight: 78, points: 3 }],
        45: [{ toHeight: 66, points: 1 }, { toHeight: 73, points: 2 }, { toHeight: 78, points: 3 }],
        46: [{ toHeight: 68, points: 1 }, { toHeight: 75, points: 2 }, { toHeight: 78, points: 3 }],
    }
};

interface WhRatioResult {
    ratio: number;
    points: number;
    level: string;
    closestWaist: number;
    closestHeight: number;
}

/**
 * Calculates WHtR points. Finds the closest waist/height on the chart if the exact value isn't present.
 * @returns An object with ratio, points, level, and the coordinates used on the chart.
 */
export function calculateWhRatioPoints(gender: 'male' | 'female', waist: number, height: number): WhRatioResult | null {
    const waistValues = gender === 'male' ? maleWaistValues : femaleWaistValues;
    const heightValues = gender === 'male' ? maleHeightValues : femaleHeightValues;

    // Find the closest waist and height from the chart's axes
    const closestWaist = waistValues.reduce((prev, curr) => Math.abs(curr - waist) < Math.abs(prev - waist) ? curr : prev);
    const closestHeight = heightValues.reduce((prev, curr) => Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev);

    const pointData = whRatioPointData[gender][closestWaist];
    if (!pointData) return null;

    let points = 1; // Default to the lowest score
    for (const threshold of pointData) {
        if (closestHeight <= threshold.toHeight) {
            points = threshold.points;
            break;
        }
    }

    return {
        ratio: waist / height,
        points: points,
        level: pointLevels[points],
        closestWaist: closestWaist,
        closestHeight: closestHeight,
    };
}

/**
 * Estimates WHtR points from the ratio alone. This is an approximation for the scoreboard.
 * @returns A number representing the points (1-5).
 */
export function calculateWhRatioPointsFromRatio(gender: 'male' | 'female', ratio: number): number {
    if (gender === 'male') {
        if (ratio <= 0.50) return 5; // Healthy
        if (ratio <= 0.53) return 4; // Acceptable
        if (ratio <= 0.57) return 3; // Overweight
        if (ratio <= 0.63) return 2; // High Risk
        return 1; // Very High Risk
    } else { // female
        if (ratio <= 0.48) return 5; // Healthy
        if (ratio <= 0.53) return 4; // Acceptable
        if (ratio <= 0.58) return 3; // Overweight
        if (ratio <= 0.62) return 2; // High Risk
        return 1; // Very High Risk
    }
}
