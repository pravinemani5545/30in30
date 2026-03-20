# Database Reviewer

## Verify
- RLS enabled on both tables: subscribers and digest_runs
- subscribers: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- digest_runs: 3 policies (SELECT, INSERT, UPDATE)
- Indexes: idx_subscribers_token, idx_subscribers_active, idx_digest_runs_scheduled

## SQL checks
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
SELECT policyname, tablename, cmd FROM pg_policies WHERE schemaname = 'public';
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
```
