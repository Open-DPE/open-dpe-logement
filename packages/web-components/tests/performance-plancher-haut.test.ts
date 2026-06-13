import { describe, it, expect } from "vitest";
import { renderPerformancePlancherHaut } from "../src/performance-plancher-haut/index.js";

const COLORS = {
  1: "#2CAF85",
  2: "#A5CC74",
  3: "#F49838",
  4: "#E52322",
};

// ─── configuration: plancher ──────────────────────────────────────────────────
// seuils : ≤0.15 → [1], ≤0.20 → [2], ≤0.30 → [3], >0.30 → [4]

describe("renderPerformancePlancherHaut — configuration: plancher", () => {
  it("u=0.10 → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.10 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=0.18 → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.18 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.25 → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.25 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=0.50 → couleur [4]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.50 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=0.15 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.15 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.16 (juste après frontière [1]/[2]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.16 });
    expect(result).not.toContain(COLORS[1]);
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.20 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.20 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.30 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "plancher", u: 0.30 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});

// ─── configuration: rampants ──────────────────────────────────────────────────
// seuils : ≤0.18 → [1], ≤0.25 → [2], ≤0.35 → [3], >0.35 → [4]

describe("renderPerformancePlancherHaut — configuration: rampants", () => {
  it("u=0.10 → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.10 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=0.22 → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.22 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.30 → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.30 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=0.50 → couleur [4]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.50 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=0.18 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.18 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.19 (juste après frontière [1]/[2]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.19 });
    expect(result).not.toContain(COLORS[1]);
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.25 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.25 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.35 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "rampants", u: 0.35 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});

// ─── configuration: terrasse ──────────────────────────────────────────────────
// seuils : ≤0.25 → [1], ≤0.45 → [2], ≤0.65 → [3], >0.65 → [4]

describe("renderPerformancePlancherHaut — configuration: terrasse", () => {
  it("u=0.10 → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.10 });
    expect(result).toContain(COLORS[1]);
  });

  it("u=0.35 → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.35 });
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.55 → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.55 });
    expect(result).toContain(COLORS[3]);
  });

  it("u=0.90 → couleur [4]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.90 });
    expect(result).toContain(COLORS[4]);
  });

  // Frontières
  it("u=0.25 (frontière [1]/[2]) → couleur [1]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.25 });
    expect(result).toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.26 (juste après frontière [1]/[2]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.26 });
    expect(result).not.toContain(COLORS[1]);
    expect(result).toContain(COLORS[2]);
  });

  it("u=0.45 (frontière [2]/[3]) → couleur [2]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.45 });
    expect(result).toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[4]);
  });

  it("u=0.65 (frontière [3]/[4]) → couleur [3]", () => {
    const result = renderPerformancePlancherHaut({ configuration: "terrasse", u: 0.65 });
    expect(result).toContain(COLORS[3]);
    expect(result).not.toContain(COLORS[1]);
    expect(result).not.toContain(COLORS[2]);
    expect(result).not.toContain(COLORS[4]);
  });
});
