
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

// Data for table axes, converted to cm
export const femaleWaistValues = [71, 74, 76, 79, 81, 84, 86, 89, 91, 94, 97, 99, 102, 104, 107, 109, 112];
export const femaleHeightValues = [142, 145, 147, 150, 152, 155, 157, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183];
export const maleWaistValues = [76, 79, 81, 84, 86, 89, 91, 94, 97, 99, 102, 104, 107, 109, 112, 114, 117];
export const maleHeightValues = [157, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183, 185, 188, 191, 193, 196, 198];

type PointThreshold = { toHeight: number; points: number };
type GenderPointData = { [waist: number]: PointThreshold[] };

/**
 * This data defines the point system based on the color chart.
 * For a given gender and waist, it provides an array of height thresholds.
 * If a person's height is less than or equal to the `toHeight` value, they get the corresponding `points`.
 * The array is ordered, so the first match determines the score.
 * All values converted from inches to cm (1 in = 2.54 cm), and rounded.
 */
export const whRatioPointData: { male: GenderPointData; female: GenderPointData } = {
    female: {
        71: [{ toHeight: 183, points: 5 }],
        74: [{ toHeight: 142, points: 4 }, { toHeight: 183, points: 5 }],
        76: [{ toHeight: 147, points: 4 }, { toHeight: 183, points: 5 }],
        79: [{ toHeight: 152, points: 4 }, { toHeight: 183, points: 5 }],
        81: [{ toHeight: 155, points: 3 }, { toHeight: 165, points: 4 }, { toHeight: 183, points: 5 }],
        84: [{ toHeight: 157, points: 3 }, { toHeight: 168, points: 4 }, { toHeight: 183, points: 5 }],
        86: [{ toHeight: 160, points: 3 }, { toHeight: 173, points: 4 }, { toHeight: 183, points: 5 }],
        89: [{ toHeight: 165, points: 3 }, { toHeight: 175, points: 4 }, { toHeight: 183, points: 5 }],
        91: [{ toHeight: 150, points: 2 }, { toHeight: 168, points: 3 }, { toHeight: 180, points: 4 }, { toHeight: 183, points: 5 }],
        94: [{ toHeight: 155, points: 2 }, { toHeight: 170, points: 3 }, { toHeight: 183, points: 4 }],
        97: [{ toHeight: 157, points: 2 }, { toHeight: 175, points: 3 }, { toHeight: 183, points: 4 }],
        99: [{ toHeight: 163, points: 2 }, { toHeight: 178, points: 3 }, { toHeight: 183, points: 4 }],
        102: [{ toHeight: 168, points: 2 }, { toHeight: 183, points: 3 }],
        104: [{ toHeight: 152, points: 1 }, { toHeight: 170, points: 2 }, { toHeight: 183, points: 3 }],
        107: [{ toHeight: 157, points: 1 }, { toHeight: 175, points: 2 }, { toHeight: 183, points: 3 }],
        109: [{ toHeight: 163, points: 1 }, { toHeight: 180, points: 2 }, { toHeight: 183, points: 3 }],
        112: [{ toHeight: 168, points: 1 }, { toHeight: 183, points: 2 }],
    },
    male: {
        76: [{ toHeight: 198, points: 5 }],
        79: [{ toHeight: 198, points: 5 }],
        81: [{ toHeight: 157, points: 4 }, { toHeight: 198, points: 5 }],
        84: [{ toHeight: 163, points: 4 }, { toHeight: 198, points: 5 }],
        86: [{ toHeight: 168, points: 4 }, { toHeight: 198, points: 5 }],
        89: [{ toHeight: 173, points: 4 }, { toHeight: 198, points: 5 }],
        91: [{ toHeight: 165, points: 3 }, { toHeight: 178, points: 4 }, { toHeight: 198, points: 5 }],
        94: [{ toHeight: 170, points: 3 }, { toHeight: 183, points: 4 }, { toHeight: 198, points: 5 }],
        97: [{ toHeight: 173, points: 3 }, { toHeight: 188, points: 4 }, { toHeight: 198, points: 5 }],
        99: [{ toHeight: 178, points: 3 }, { toHeight: 193, points: 4 }, { toHeight: 198, points: 5 }],
        102: [{ toHeight: 183, points: 3 }, { toHeight: 198, points: 4 }],
        104: [{ toHeight: 168, points: 2 }, { toHeight: 188, points: 3 }, { toHeight: 198, points: 4 }],
        107: [{ toHeight: 173, points: 2 }, { toHeight: 193, points: 3 }, { toHeight: 198, points: 4 }],
        109: [{ toHeight: 178, points: 2 }, { toHeight: 198, points: 3 }],
        112: [{ toHeight: 180, points: 2 }, { toHeight: 198, points: 3 }],
        114: [{ toHeight: 168, points: 1 }, { toHeight: 185, points: 2 }, { toHeight: 198, points: 3 }],
        117: [{ toHeight: 173, points: 1 }, { toHeight: 191, points: 2 }, { toHeight: 198, points: 3 }],
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
