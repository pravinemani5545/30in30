Test the full generation pipeline:
1. Sign in, navigate to /dashboard
2. Paste: https://paulgraham.com/genius.html
3. Expected: URL preview card appears within 600ms
   Shows: "paulgraham.com" domain, title, description, estimated read time
4. Click "Generate →"
5. Expected status steps: Fetching → Reading → Crafting
6. Expected: 5 tweet cards stagger in after ~10-20s
7. Verify: all 5 tweets ≤ 280 characters (check character badge colors)
8. Verify: 5 different tweet types (hook/story/stat/contrarian/listicle)
9. Verify: hook scores shown with animated ring
10. Test copy button: green flash 1.5s, clipboard has tweet text
11. Test Gmail draft button: draft appears in Gmail (or fallback copy)
12. Test regenerate: one card refreshes with new content
13. Paste same URL again → should be instant (cache hit, no Fetching step)
14. Check history sidebar: generation appears with article title
