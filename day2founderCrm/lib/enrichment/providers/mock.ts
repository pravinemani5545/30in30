import type { RawProfileData } from "@/types";

export function getMockProfileData(): RawProfileData {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Mock enrichment provider cannot run in production");
  }

  return {
    source: "mock",
    fullName: "Alex Rivera",
    headline: "Founder & CEO at BuildFast — ex-Stripe, ex-YC W21",
    location: "San Francisco, CA",
    photoUrl: null,
    currentTitle: "Founder & CEO",
    currentCompany: "BuildFast",
    companyDomain: "buildfast.io",
    companyIndustry: "Software Development",
    companySize: "11-50",
    employmentHistory: [
      {
        title: "Founder & CEO",
        organization_name: "BuildFast",
        start_date: "2022-03",
        end_date: null,
        current: true,
        description:
          "Building developer tools for rapid product iteration. Raised $2M seed. 8k active users.",
      },
      {
        title: "Senior Software Engineer",
        organization_name: "Stripe",
        start_date: "2019-06",
        end_date: "2022-02",
        current: false,
        description:
          "Led the Billing Alerts team. Shipped recurring billing features used by 500k+ businesses.",
      },
      {
        title: "Software Engineer",
        organization_name: "Palantir Technologies",
        start_date: "2016-08",
        end_date: "2019-05",
        current: false,
        description: "Full-stack engineer on the Foundry data platform.",
      },
    ],
    skills: [
      "TypeScript",
      "React",
      "Go",
      "Product Strategy",
      "Developer Relations",
      "Fundraising",
    ],
    education: [
      {
        school: "Stanford University",
        degree: "B.S.",
        field_of_study: "Computer Science",
        graduation_year: 2016,
      },
    ],
    rawText: null,
  };
}
