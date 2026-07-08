# GitHub Copilot Architecture & Layout Instructions

You must strictly read and adhere to these technical and structural rules before modifying any code in this repository. This dashboard is a precision-engineered frontend application built with React, TypeScript, and Recharts.

---

## 🛑 THE GOLDEN RULE: STRICT LAYOUT ISOLATION
Whenever you are asked to style, move, or adjust a container or `ChartCard`, you must ONLY change the external CSS/Style layout wrappers. **Do NOT touch, refactor, or rewrite the internal graph canvas logic, responsive dimensions, or Recharts data properties unless explicitly requested.** ---

## 📐 VIEWPORT & VERTICAL COMPRESSION SPECIFICATIONS
The entire dashboard must fit onto a single desktop screen at **100% browser zoom without forcing any vertical page scrolling**.

- **Global Row Constraints:** Both Row 1 and Row 2 main flex containers inside `src/components/Charts/DashboardCharts.tsx` must be locked at a maximum height of exactly `220px` to `230px`.
- **Card Boundaries (`src/components/Charts/ChartCard.tsx`):** All chart card components must have a strict `height: '100%'`, `maxHeight: '220px'`, and `overflow: 'hidden'` to prevent any element from bleeding out vertically.
- **Internal Chart Canvas Height:** To fit within the card headers, titles, and paddings, all Recharts `<ResponsiveContainer>` elements inside the 6 individual chart files must be capped at an explicit height wrapper of `140px` to `160px`.
- **Zebra & Padding Tightness:** Keep inner card padding at exactly `12px`. Keep margins between rows and KPI metrics locked at `12px` max.

---

## 📊 CHART DATA & DISPLAY SPECS (RTL Flow)

### 1. Dashboard Main Grid Layout
- The layout runs strictly in **RTL (Right-to-Left)** flow.
- **Row 1 Arrangement (Right to Left):** Districts Chart (התפלגות לפי מחוז) ➔ Status Chart (התפלגות לפי סטטוס) ➔ Handlers Chart (חלוקה לפי גורם מטפל).
- **Row 2 Arrangement (Right to Left):** Top Units Pie Chart (פניות לפי יחידה) ➔ SLA Chart (SLA לפי יחידה) ➔ Stacked Topics Chart (נושא לפי יחידה).
- All 3 cards in a row must share equal width using `flex: 1` and `minWidth: 0` (to prevent Recharts from breaking standard flex cells).

### 2. "פניות לפי יחידה" (Top 5 Pie Chart)
- **Dashboard View:** Must strictly show **ONLY the TOP 5 units** with the highest request counts. Do NOT render any "Others / אחרים" gray slice or group remaining elements in the main view. The pie must represent 100% distribution of only these Top 5.
- **Legend Order:** The text tokens underneath must align correctly with their matching slice colors.

### 3. Scrollable Horizontal Bar Charts ("SLA לפי יחידה" & "נושא לפי יחידה")
- **Fixed Footers:** The horizontal numerical X-Axis tick line and the custom HTML legend tags must be anchored permanently to the bottom of the card (`flexShrink: 0`). They must stay 100% visible and must NOT move or hide when the internal vertical list of units is scrolled.
- **Reversed Legend Order:** For the horizontal stacked chart ("נושא לפי יחידה"), the legend items array must render in a **reversed horizontal order from left to right**.
- **Bar Sizing:** Set explicit thin widths (`barSize={12}`) on horizontal bar components so they render cleanly inside compressed scroll heights.

---

## 🗖 FULL-LIST POPUP MODAL REQUIREMENTS
When clicking the detailed table button on the charts, the popup modal must display data using a professional, high-performance layout:

- **Data Presentation:** Completely avoid colorful horizontal bar queues. Render a clean **Data Table (Zebra striped `#f8fafc`)** with 3 distinct columns: `יחידה` (Unit Name), `כמות פניות` (Total Requests), and `נתח מסך הכל` (containing a clean, inline visual blue progress bar displaying percentage).
- **Smart Search/Filter Dropdown (Select with Search):**
  - Place a text-search selection input right below the modal header summary text.
  - **Auto-Open Protection:** The selection option dropdown overlay list must **NOT** trigger automatically on text input focus (`onFocus`).
  - **Triggers:** The list must open **ONLY** when the user explicitly clicks the tiny arrow indicator icon (`▼`), or once the user types at least one character (`query.length > 0`) inside the field to search.
  - Selecting or filtering must update the data table rows below immediately without breaking the modal skeleton bounds.