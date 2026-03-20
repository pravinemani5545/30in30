---
name: check-rls
description: Verify RLS policies are correctly configured in Supabase. Use when setting up or auditing database security.
---

# Check RLS Policies

Run this SQL in Supabase SQL Editor to verify Row Level Security:

```sql
SELECT t.tablename, t.rowsecurity, p.policyname, p.cmd, p.qual
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public'
ORDER BY t.tablename, p.cmd;
```

## Expected for HackerNewsDigest:
- **subscribers**: rowsecurity=true, 4 policies (SELECT/INSERT/UPDATE/DELETE)
- **digest_runs**: rowsecurity=true, 3 policies (SELECT/INSERT/UPDATE)
