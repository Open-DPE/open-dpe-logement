import { describe, it, expect } from "vitest";
import { renderPerformanceEnveloppe } from "../src/performance-enveloppe/index.js";
import { renderPerformanceMur } from "../src/performance-mur/index.js";
import { renderPerformanceMenuiserie } from "../src/performance-menuiserie/index.js";
import { renderPerformancePlancherBas } from "../src/performance-plancher-bas/index.js";

const COLORS = {
  1: "#2CAF85",
  2: "#A5CC74",
  3: "#F49838",
  4: "#E52322",
};

// ─── renderPerformanceEnveloppe (ubat) ───────────────────────────────────────
// seuils : ≤0.45 → [1], ≤0.65 → [2], ≤0.85 → [3], >0.85 → [4]

describe("renderPerformanceEnveloppe", () => {
  it("ubat=0.2 → couleur [1]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.2 });
    expect(result).toContain(COLORS[1]);
  });

  it("ubat=0.55 → couleur [2]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.55 });
    expect(result).toContain(COLORS[2]);
  });

  it("ubat=0.75 → couleur [3]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.75 });
    expect(result).toContain(COLORS[3]);
  });

  it("ubat=1.0 → couleur [4]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 1.0 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("ubat=0.45 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.45 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("ubat=0.65 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.65 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("ubat=0.85 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformanceEnveloppe({ ubat: 0.85 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});

// ─── renderPerformanceMur (u) ─────────────────────────────────────────────────
// seuils : ≤0.3 → [1], ≤0.45 → [2], ≤0.65 → [3], >0.65 → [4]

describe("renderPerformanceMur", () => {
  it("u=0.1 → couleur [1]", () => {
    const result = renderPerformanceMur({ u: 0.1 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=0.4 → couleur [2]", () => {
    const result = renderPerformanceMur({ u: 0.4 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.55 → couleur [3]", () => {
    const result = renderPerformanceMur({ u: 0.55 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=0.8 → couleur [4]", () => {
    const result = renderPerformanceMur({ u: 0.8 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=0.3 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformanceMur({ u: 0.3 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.45 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformanceMur({ u: 0.45 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.65 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformanceMur({ u: 0.65 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});

// ─── renderPerformanceMenuiserie (u) ─────────────────────────────────────────
// seuils : ≤1.6 → [1], ≤2.2 → [2], ≤3 → [3], >3 → [4]

describe("renderPerformanceMenuiserie", () => {
  it("u=1.0 → couleur [1]", () => {
    const result = renderPerformanceMenuiserie({ u: 1.0 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=2.0 → couleur [2]", () => {
    const result = renderPerformanceMenuiserie({ u: 2.0 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=2.8 → couleur [3]", () => {
    const result = renderPerformanceMenuiserie({ u: 2.8 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=4.0 → couleur [4]", () => {
    const result = renderPerformanceMenuiserie({ u: 4.0 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=1.6 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformanceMenuiserie({ u: 1.6 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=2.2 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformanceMenuiserie({ u: 2.2 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=3 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformanceMenuiserie({ u: 3 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});

// ─── renderPerformancePlancherBas (u) ────────────────────────────────────────
// seuils : ≤0.25 → [1], ≤0.45 → [2], ≤0.65 → [3], >0.65 → [4]

describe("renderPerformancePlancherBas", () => {
  it("u=0.1 → couleur [1]", () => {
    const result = renderPerformancePlancherBas({ u: 0.1 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=0.35 → couleur [2]", () => {
    const result = renderPerformancePlancherBas({ u: 0.35 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.55 → couleur [3]", () => {
    const result = renderPerformancePlancherBas({ u: 0.55 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=0.9 → couleur [4]", () => {
    const result = renderPerformancePlancherBas({ u: 0.9 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=0.25 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformancePlancherBas({ u: 0.25 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.45 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformancePlancherBas({ u: 0.45 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.65 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformancePlancherBas({ u: 0.65 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});
