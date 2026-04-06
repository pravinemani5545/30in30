import { promises as dns } from "dns";
import { DKIM_SELECTORS } from "./selectors";
import type { CheckResult, DKIMCheckResult } from "@/types/day17";

export async function checkSPF(domain: string): Promise<CheckResult> {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records.flat().find((r) => r.startsWith("v=spf1"));

    if (!spfRecord) {
      return {
        passed: false,
        warning: false,
        rawRecord: null,
        details: "No SPF record found for this domain.",
      };
    }

    // Check for dangerous policies
    if (spfRecord.endsWith("+all") || spfRecord.endsWith("?all")) {
      return {
        passed: false,
        warning: false,
        rawRecord: spfRecord,
        details: `SPF record found but uses dangerous policy: ${spfRecord.endsWith("+all") ? "+all (allows anyone)" : "?all (neutral, no protection)"}.`,
      };
    }

    const hasHardFail = spfRecord.endsWith("-all");
    return {
      passed: true,
      warning: !hasHardFail,
      rawRecord: spfRecord,
      details: hasHardFail
        ? "SPF record is properly configured with -all (hard fail)."
        : "SPF record exists with ~all (soft fail). Consider upgrading to -all.",
    };
  } catch {
    return {
      passed: false,
      warning: false,
      rawRecord: null,
      details: "DNS lookup failed — no SPF record found.",
    };
  }
}

export async function checkDKIM(domain: string): Promise<DKIMCheckResult> {
  const results = await Promise.allSettled(
    DKIM_SELECTORS.map(async (selector) => {
      const records = await dns.resolveTxt(
        `${selector}._domainkey.${domain}`,
      );
      const record = records.flat().join("");
      return { selector, record };
    }),
  );

  const found = results.find(
    (r): r is PromiseFulfilledResult<{ selector: string; record: string }> =>
      r.status === "fulfilled",
  );

  if (!found) {
    return {
      passed: false,
      warning: false,
      rawRecord: null,
      selectorFound: null,
      details: `No DKIM record found. Tried ${DKIM_SELECTORS.length} common selectors.`,
    };
  }

  return {
    passed: true,
    warning: false,
    rawRecord: found.value.record,
    selectorFound: found.value.selector,
    details: `DKIM record found at selector "${found.value.selector}".`,
  };
}

export async function checkDMARC(domain: string): Promise<CheckResult> {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.flat().find((r) => r.startsWith("v=DMARC1"));

    if (!dmarcRecord) {
      return {
        passed: false,
        warning: false,
        rawRecord: null,
        details: "No DMARC record found at _dmarc subdomain.",
      };
    }

    const policyMatch = dmarcRecord.match(/p=(\w+)/);
    const policy = policyMatch?.[1]?.toLowerCase();

    if (policy === "none") {
      return {
        passed: true,
        warning: true,
        rawRecord: dmarcRecord,
        details:
          "DMARC record exists but policy is p=none (monitoring only, no enforcement).",
      };
    }

    if (policy === "quarantine") {
      return {
        passed: true,
        warning: false,
        rawRecord: dmarcRecord,
        details:
          "DMARC record configured with p=quarantine. Suspicious mail goes to spam.",
      };
    }

    if (policy === "reject") {
      return {
        passed: true,
        warning: false,
        rawRecord: dmarcRecord,
        details:
          "DMARC record configured with p=reject. Unauthenticated mail is fully rejected.",
      };
    }

    return {
      passed: true,
      warning: true,
      rawRecord: dmarcRecord,
      details: `DMARC record found with policy: ${policy ?? "unknown"}.`,
    };
  } catch {
    return {
      passed: false,
      warning: false,
      rawRecord: null,
      details: "DNS lookup failed — no DMARC record found.",
    };
  }
}

export async function checkMX(domain: string): Promise<CheckResult> {
  try {
    const mxRecords = await dns.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        passed: false,
        warning: true,
        rawRecord: null,
        details: "No MX records found. Domain cannot receive email replies.",
      };
    }

    const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
    const recordStr = sorted
      .map((r) => `${r.priority} ${r.exchange}`)
      .join(", ");

    return {
      passed: true,
      warning: false,
      rawRecord: recordStr,
      details: `${mxRecords.length} MX record(s) found. Domain can receive email.`,
    };
  } catch {
    return {
      passed: false,
      warning: true,
      rawRecord: null,
      details: "No MX records found. Domain cannot receive replies.",
    };
  }
}

export async function checkDomainAge(domain: string): Promise<CheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        passed: false,
        warning: true,
        rawRecord: null,
        details: "Could not determine domain age (RDAP lookup failed).",
      };
    }

    const data = await response.json();
    const events = data?.events as
      | Array<{ eventAction: string; eventDate: string }>
      | undefined;
    const registration = events?.find(
      (e) => e.eventAction === "registration",
    );

    if (!registration?.eventDate) {
      return {
        passed: false,
        warning: true,
        rawRecord: null,
        details: "Domain age could not be determined from RDAP data.",
      };
    }

    const regDate = new Date(registration.eventDate);
    const now = new Date();
    const monthsOld =
      (now.getFullYear() - regDate.getFullYear()) * 12 +
      (now.getMonth() - regDate.getMonth());

    const dateStr = regDate.toISOString().split("T")[0];

    if (monthsOld < 3) {
      return {
        passed: false,
        warning: false,
        rawRecord: `Registered: ${dateStr} (${monthsOld} months)`,
        details: `Domain is ${monthsOld} months old. HIGH RISK — domains under 3 months are heavily flagged by spam filters.`,
      };
    }

    if (monthsOld < 6) {
      return {
        passed: true,
        warning: true,
        rawRecord: `Registered: ${dateStr} (${monthsOld} months)`,
        details: `Domain is ${monthsOld} months old. MEDIUM RISK — consider warming up before high-volume outreach.`,
      };
    }

    return {
      passed: true,
      warning: false,
      rawRecord: `Registered: ${dateStr} (${monthsOld} months)`,
      details: `Domain is ${monthsOld} months old. Established domain — no age concerns.`,
    };
  } catch {
    return {
      passed: false,
      warning: true,
      rawRecord: null,
      details: "Domain age check timed out or failed. Could not verify.",
    };
  }
}
