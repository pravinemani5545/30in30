Verify RLS in Supabase SQL Editor:
```sql
SELECT t.tablename, t.rowsecurity, p.policyname, p.cmd, p.qual
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public'
ORDER BY t.tablename, p.cmd;
```
Expected:
- article_cache: rowsecurity=true, SELECT policy for authenticated
- generations: rowsecurity=true, SELECT/INSERT/UPDATE/DELETE for auth.uid()
- tweet_variations: rowsecurity=true, SELECT/INSERT/UPDATE/DELETE for auth.uid()
