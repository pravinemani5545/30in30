import type { AllCheckResults, Grade } from "@/types/day17";

export function calculateScore(results: AllCheckResults): number {
  let score = 0;

  // SPF: 25 points if exists and valid
  if (results.spf.passed) score += 25;

  // DKIM: 25 points if found
  if (results.dkim.passed) score += 25;

  // DMARC: up to 20 points
  if (results.dmarc.passed) {
    score += 10;
    if (results.dmarc.rawRecord) {
      const policy = results.dmarc.rawRecord.match(/p=(\w+)/)?.[1]?.toLowerCase();
      if (policy === "quarantine") score += 5;
      else if (policy === "reject") score += 10;
    }
  }

  // MX: 15 points
  if (results.mx.passed) score += 15;

  // Domain age: up to 20 points
  if (results.domainAge.passed) {
    if (results.domainAge.warning) {
      score += 10; // 3-6 months
    } else {
      score += 20; // > 6 months
    }
  }

  return Math.min(score, 100);
}

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function allChecksPassed(results: AllCheckResults): boolean {
  return results.spf.passed && results.dkim.passed && results.dmarc.passed;
}
