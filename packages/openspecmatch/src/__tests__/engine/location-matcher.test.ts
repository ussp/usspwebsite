import { describe, it, expect } from "vitest";
import { matchLocation } from "../../engine/location-matcher.js";

describe("Location Matcher", () => {
  describe("Remote positions", () => {
    it("scores high regardless of candidate location", () => {
      const result = matchLocation(
        { workMode: "remote" },
        { city: "Tokyo", country: "Japan" },
      );
      expect(result.score).toBeGreaterThan(80);
    });

    it("scores high with no candidate location", () => {
      const result = matchLocation({ workMode: "remote" }, undefined);
      expect(result.score).toBeGreaterThan(80);
    });
  });

  describe("Onsite positions", () => {
    it("scores 100 for exact city match", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
      );
      expect(result.score).toBe(100);
      expect(result.geoMatch).toBe("exact_city");
    });

    it("scores high for metro area match", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "Evanston", state: "IL" },
      );
      expect(result.score).toBeGreaterThan(80);
      expect(result.geoMatch).toBe("same_metro");
    });

    it("scores moderate for same state different city", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "Springfield", state: "IL" },
      );
      expect(result.score).toBeLessThan(70);
      expect(result.geoMatch).toBe("same_state");
    });

    it("scores low for different state", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "New York", state: "NY" },
      );
      expect(result.score).toBeLessThan(30);
    });

    it("penalizes remote candidate for onsite role", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
        "remote",
      );
      expect(result.workModeMatch).toBe("mismatch");
      expect(result.score).toBeLessThan(100);
    });
  });

  describe("Hybrid positions", () => {
    it("scores high for same city", () => {
      const result = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
      );
      expect(result.score).toBe(100);
    });

    it("scores moderate for same state", () => {
      const result = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL" },
        { city: "Springfield", state: "IL" },
      );
      expect(result.score).toBeGreaterThan(50);
    });

    it("handles relocation OK", () => {
      const withRelo = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL", relocationOk: true },
        { city: "New York", state: "NY" },
      );
      const without = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL" },
        { city: "New York", state: "NY" },
      );
      expect(withRelo.score).toBeGreaterThan(without.score);
    });
  });

  describe("Work mode compatibility", () => {
    it("exact match for same preference", () => {
      const result = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
        "hybrid",
      );
      expect(result.workModeMatch).toBe("exact");
    });

    it("compatible for onsite candidate on hybrid role", () => {
      const result = matchLocation(
        { workMode: "hybrid", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
        "onsite",
      );
      expect(result.workModeMatch).toBe("compatible");
    });

    it("mismatch for remote candidate on onsite role", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Chicago", state: "IL" },
        { city: "Chicago", state: "IL" },
        "remote",
      );
      expect(result.workModeMatch).toBe("mismatch");
    });
  });

  describe("No location requirement", () => {
    it("scores 100 when position has no location requirement", () => {
      const result = matchLocation(undefined, { city: "Anywhere" });
      expect(result.score).toBe(100);
    });
  });

  describe("State abbreviation handling", () => {
    it("matches IL to IL", () => {
      const result = matchLocation(
        { workMode: "onsite", state: "IL" },
        { state: "IL" },
      );
      expect(result.geoMatch).toBe("same_state");
    });

    it("matches Illinois to IL", () => {
      const result = matchLocation(
        { workMode: "onsite", state: "Illinois" },
        { state: "IL" },
      );
      expect(result.geoMatch).toBe("same_state");
    });
  });

  describe("Metro areas", () => {
    it("DC metro: Arlington VA matches Washington DC", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "Washington", state: "DC" },
        { city: "Arlington", state: "VA" },
      );
      expect(result.geoMatch).toBe("same_metro");
    });

    it("SF Bay: Oakland matches San Francisco", () => {
      const result = matchLocation(
        { workMode: "onsite", city: "San Francisco", state: "CA" },
        { city: "Oakland", state: "CA" },
      );
      expect(result.geoMatch).toBe("same_metro");
    });
  });
});
