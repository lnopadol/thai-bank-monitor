# Thai Bank Monitor

Minimalist dashboard for monitoring deposit safety and financial health of 9 major Thai commercial banks.

## Banks Tracked

| Bank | Ticker | Type |
|------|--------|------|
| Bangkok Bank | BBL | SET-listed |
| Kasikornbank | KBANK | SET-listed |
| SCB X | SCB | SET-listed |
| Krung Thai Bank | KTB | SET-listed |
| TMBThanachart | TTB | SET-listed |
| Bank of Ayudhya | BAY | SET-listed |
| Kiatnakin Phatra | KKP | SET-listed |
| TISCO Financial | TISCO | SET-listed |
| UOB (Thai) | UOB | Unlisted (SGX parent) |

## Metrics

- **Capital Adequacy**: CET1, CAR (from Pillar 3 disclosures)
- **Asset Quality**: NPL ratio, NPL coverage
- **Credit Ratings**: Fitch, Moody's, S&P
- **Deposit Rates**: Savings, 3M/6M/12M fixed deposits
- **Market Data**: Price, market cap, P/E, dividend yield (SET-listed banks)
- **Deposit Insurance**: DPA coverage calculator (฿1M per depositor per bank)

## Signal Logic

- ✅ **Strong**: CET1 > 16%, NPL < 3%, NPL Coverage > 200%
- ⚠️ **Watch**: Above minimum thresholds but doesn't meet all Strong criteria
- 🔴 **Alert**: CET1 < 14% or NPL > 5%

## Tech Stack

- Vanilla HTML/CSS/JS — no build step
- Chart.js for data visualization
- Inter + Barlow Condensed typography
- Dark/light mode with system preference detection
- Mobile-optimized for iPhone Safari

## Data Sources

- Bank of Thailand (BOT)
- SET filings & Pillar 3 Reports
- Fitch Ratings, Moody's, S&P Global
- Individual bank investor relations pages

## License

MIT
