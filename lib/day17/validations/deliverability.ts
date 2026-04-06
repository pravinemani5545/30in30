import { z } from "zod";

// Strip protocol, www, trailing slash, path — extract clean domain
function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.replace(/\/.*$/, "");
  return domain;
}

export const DomainCheckSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .transform(cleanDomain)
    .pipe(
      z
        .string()
        .regex(
          /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/,
          "Enter a valid domain (e.g. example.com)",
        ),
    ),
});

export type DomainCheckInput = z.infer<typeof DomainCheckSchema>;
