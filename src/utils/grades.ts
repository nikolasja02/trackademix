import { GradeCategory } from "../types";

export function weightedAverage(categories: GradeCategory[]): number {
    const totalWeight = categories.reduce((s, c) => s + c.weightPct, 0);
    if (totalWeight <= 0) return 0;
    let sum = 0;
    for (const c of categories) {
        const pct = c.possible > 0 ? c.earned / c.possible : 0;
        sum += pct * (c.weightPct / 100);
    }
    return sum * 100; // 0..100
}
