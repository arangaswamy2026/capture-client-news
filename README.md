# capture-client-news

Static recreation of the SonicWall Unified Management dashboard, with a header newspaper icon that opens a "Security News" panel (top 5 items from the security-news content API, plus a View all link to Capture Labs).

## Run locally

```bash
python3 -m http.server 8791
```

Open http://localhost:8791/index.html

## Notes

- `assets/news-data.js` is a snapshot of `https://www.sonicwall.com/api/content?contentKey=security-news&page=0&pageSize=20&locale=en-us`. The panel tries the live API first and falls back to the snapshot.
- The newspaper icon uses Font Awesome 6.5.2 from cdnjs.
