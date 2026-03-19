import type { RawProfileData, EmploymentHistoryItem, EducationItem } from "@/types";

// Apollo API response types (subset we care about)
interface ApolloEmployment {
  title?: string | null;
  organization_name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  current?: boolean | null;
  description?: string | null;
}

interface ApolloEducation {
  school?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  graduation_year?: number | string | null;
}

interface ApolloOrganization {
  name?: string | null;
  primary_domain?: string | null;
  industry?: string | null;
  employee_count?: number | null;
  estimated_num_employees?: number | null;
}

interface ApolloPerson {
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  headline?: string | null;
  title?: string | null;
  photo_url?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  employment_history?: ApolloEmployment[] | null;
  skills?: string[] | null;
  education?: ApolloEducation[] | null;
  organization?: ApolloOrganization | null;
}

export function normalizeApolloResponse(person: ApolloPerson): RawProfileData {
  const location = [person.city, person.state, person.country]
    .filter(Boolean)
    .join(", ");

  const employmentHistory: EmploymentHistoryItem[] = (
    person.employment_history ?? []
  ).map((e) => ({
    title: e.title ?? null,
    organization_name: e.organization_name ?? null,
    start_date: e.start_date ?? null,
    end_date: e.end_date ?? null,
    current: e.current ?? false,
    description: e.description ?? null,
  }));

  const education: EducationItem[] = (person.education ?? []).map((e) => ({
    school: e.school ?? null,
    degree: e.degree ?? null,
    field_of_study: e.field_of_study ?? null,
    graduation_year:
      typeof e.graduation_year === "number"
        ? e.graduation_year
        : e.graduation_year
        ? parseInt(String(e.graduation_year), 10) || null
        : null,
  }));

  const org = person.organization;
  const employeeCount =
    org?.employee_count ?? org?.estimated_num_employees ?? null;

  return {
    source: "apollo",
    fullName:
      person.name ??
      [person.first_name, person.last_name].filter(Boolean).join(" ") ??
      null,
    headline: person.headline ?? null,
    location: location || null,
    photoUrl: person.photo_url ?? null,
    currentTitle: person.title ?? null,
    currentCompany: org?.name ?? null,
    companyDomain: org?.primary_domain ?? null,
    companyIndustry: org?.industry ?? null,
    companySize: employeeCount ? formatEmployeeCount(employeeCount) : null,
    employmentHistory,
    skills: person.skills ?? [],
    education,
    rawText: null,
  };
}

function formatEmployeeCount(count: number): string {
  if (count < 10) return "1-10";
  if (count < 50) return "11-50";
  if (count < 200) return "51-200";
  if (count < 500) return "201-500";
  if (count < 1000) return "501-1000";
  if (count < 5000) return "1001-5000";
  if (count < 10000) return "5001-10000";
  return "10000+";
}
