/* ============================================
   APP.JS — Thai Bank Monitor
   All interactivity: table, sorting, chart,
   expand rows, deposit insurance calculator,
   and dark/light mode toggle.
   In-memory state only — no browser storage APIs.
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     DATA
     ============================================ */
  const BANKS = [
    {
      id: 'bbl',
      name: 'Bangkok Bank',
      ticker: 'BBL',
      price: 177.50,
      mktcap: 339,
      pe: 6.96,
      div: 4.8,
      cet1: 17.21,
      car: 21.78,
      npl: 3.0,
      nplcov: 324,
      ratings: {
        fitch: 'BBB',
        moodys: 'Baa1',
        sp: 'BBB+'
      },
      signal: 'strong',
      signalLabel: 'Strong',
      deposits: { savings: 0.25, fd3: 1.00, fd6: 1.15, fd12: 1.35 }
    },
    {
      id: 'kbank',
      name: 'Kasikornbank',
      ticker: 'KBANK',
      price: 201.00,
      mktcap: 476,
      pe: 9.85,
      div: 6.2,
      cet1: 18.0,
      car: 19.91,
      npl: 3.2,
      nplcov: 147,
      ratings: {
        fitch: 'BBB',
        moodys: 'Baa1 (Neg)',
        sp: 'BBB'
      },
      signal: 'watch',
      signalLabel: 'Watch',
      deposits: { savings: 0.25, fd3: 0.90, fd6: 1.10, fd12: 1.30 }
    },
    {
      id: 'scb',
      name: 'SCB X',
      ticker: 'SCB',
      price: 148.50,
      mktcap: 500,
      pe: 10.19,
      div: 7.0,
      cet1: 15.7,
      car: 19.1,
      npl: 3.5,
      nplcov: 180,
      ratings: {
        fitch: 'BBB',
        moodys: 'Baa1 (Neg)',
        sp: 'BBB'
      },
      signal: 'watch',
      signalLabel: 'Watch',
      deposits: { savings: 0.25, fd3: 0.85, fd6: 1.05, fd12: 1.25 }
    },
    {
      id: 'ktb',
      name: 'Krung Thai Bank',
      ticker: 'KTB',
      price: 34.25,
      mktcap: 479,
      pe: 10.38,
      div: 5.8,
      cet1: 17.4,
      car: 21.4,
      npl: 2.9,
      nplcov: 204,
      ratings: {
        fitch: 'BBB+',
        moodys: 'Baa1 (Neg)',
        sp: 'BBB'
      },
      signal: 'strong',
      signalLabel: 'Strong',
      deposits: { savings: 0.25, fd3: 1.00, fd6: 1.15, fd12: 1.35 }
    },
    {
      id: 'ttb',
      name: 'TMBThanachart',
      ticker: 'TTB',
      price: 2.32,
      mktcap: 220,
      pe: 10.55,
      div: 5.6,
      cet1: 17.5,
      car: 20.4,
      npl: 2.87,
      nplcov: 152,
      ratings: {
        fitch: 'BBB',
        moodys: 'Baa2 (Neg)',
        sp: '—'
      },
      signal: 'watch',
      signalLabel: 'Watch',
      deposits: { savings: 0.30, fd3: 1.00, fd6: 1.20, fd12: 1.40 }
    },
    {
      id: 'bay',
      name: 'Bank of Ayudhya',
      ticker: 'BAY',
      price: 26.75,
      mktcap: 197,
      pe: 6.35,
      div: 3.2,
      cet1: 16.41,
      car: 20.69,
      npl: 2.5,
      nplcov: 250,
      ratings: {
        fitch: 'BBB+',
        moodys: 'Baa1 (Neg)',
        sp: '—'
      },
      signal: 'strong',
      signalLabel: 'Strong',
      deposits: { savings: 0.25, fd3: 0.90, fd6: 1.10, fd12: 1.30 }
    },
    {
      id: 'kkp',
      name: 'Kiatnakin Phatra',
      ticker: 'KKP',
      price: 75.75,
      mktcap: 61,
      pe: 10.56,
      div: 5.5,
      cet1: 16.8,
      car: 19.5,
      npl: 3.8,
      nplcov: 140,
      ratings: {
        fitch: 'BB+ (Intl) / AA-(tha)',
        moodys: '—',
        sp: '—'
      },
      signal: 'watch',
      signalLabel: 'Watch',
      deposits: { savings: 0.50, fd3: 1.50, fd6: 1.70, fd12: 1.90 }
    },
    {
      id: 'tisco',
      name: 'TISCO Financial',
      ticker: 'TISCO',
      price: 114.50,
      mktcap: 92,
      pe: 13.63,
      div: 6.8,
      cet1: 22.5,
      car: 24.5,
      npl: 2.3,
      nplcov: 220,
      ratings: {
        fitch: 'AA(tha)',
        moodys: '—',
        sp: '—'
      },
      signal: 'strong',
      signalLabel: 'Strong',
      deposits: { savings: 0.30, fd3: 1.10, fd6: 1.30, fd12: 1.50 }
    },
    {
      id: 'uob',
      name: 'UOB (Thai)',
      ticker: 'UOB',
      price: null,
      mktcap: null,
      pe: null,
      div: null,
      cet1: 11.30,
      car: 17.18,
      npl: 1.5,
      nplcov: 99,
      ratings: {
        fitch: 'A- (Intl) / AAA(tha)',
        moodys: 'A3 (Neg)',
        sp: '—'
      },
      signal: 'watch',
      signalLabel: 'Watch',
      unlisted: true,
      parentNote: 'Subsidiary of UOB Group (SGX: U11). Not listed on SET.',
      deposits: { savings: 0.25, fd3: 0.70, fd6: 1.30, fd12: 0.90 }
    }
  ];

  const DEPOSIT_RATES = BANKS.map(b => ({
    ticker: b.ticker,
    ...b.deposits
  }));

  /* ============================================
     STATE
     ============================================ */
  let state = {
    theme: 'light',
    sortCol: null,
    sortDir: 'asc',
    filter: 'all',
    expandedId: null,
    chart: null
  };

  /* ============================================
     THEME
     ============================================ */
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeToggleIcon();
  }

  function updateThemeToggleIcon() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    if (state.theme === 'dark') {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  document.querySelector('[data-theme-toggle]').addEventListener('click', function () {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeToggleIcon();
    // Redraw chart with new colors
    if (state.chart) {
      updateChartColors();
      state.chart.update();
    }
  });

  /* ============================================
     FORMAT HELPERS
     ============================================ */
  function fmt(val, decimals = 2) {
    if (val === null || val === undefined || val === '—') return '—';
    return Number(val).toFixed(decimals);
  }

  function fmtPrice(val) {
    if (val === null || val === undefined) return '—';
    if (val >= 100) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 10) return val.toFixed(2);
    return val.toFixed(2);
  }

  /* ============================================
     BANK TABLE
     ============================================ */
  function getSignalClass(signal) {
    return `signal-${signal}`;
  }

  function getFilteredAndSortedBanks() {
    let data = [...BANKS];

    // Filter
    if (state.filter !== 'all') {
      data = data.filter(b => b.signal === state.filter);
    }

    // Sort
    if (state.sortCol) {
      data.sort((a, b) => {
        let va = a[state.sortCol];
        let vb = b[state.sortCol];
        // Nulls always sort to end
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
        if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }

  function renderBankTable() {
    const tbody = document.getElementById('bankTableBody');
    const data = getFilteredAndSortedBanks();
    tbody.innerHTML = '';

    data.forEach(bank => {
      const isExpanded = state.expandedId === bank.id;

      // Main row
      const tr = document.createElement('tr');
      tr.dataset.bankId = bank.id;
      if (isExpanded) tr.classList.add('expanded');
      tr.setAttribute('role', 'row');
      tr.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('title', `Click to ${isExpanded ? 'collapse' : 'expand'} ${bank.name} details`);

      const exchangeLabel = bank.unlisted ? 'Unlisted · SGX parent' : `${bank.ticker} · SET`;
      tr.innerHTML = `
        <td>
          <div class="bank-name-cell">
            <span class="bank-name">${bank.name}</span>
            <span class="bank-ticker">${exchangeLabel}</span>
          </div>
        </td>
        <td class="num">${bank.price !== null ? fmtPrice(bank.price) : '—'}</td>
        <td class="num">${bank.mktcap !== null ? bank.mktcap : '—'}</td>
        <td class="num">${bank.pe !== null ? fmt(bank.pe, 2) + '×' : '—'}</td>
        <td class="num">${bank.div !== null ? fmt(bank.div, 1) + '%' : '—'}</td>
        <td class="num">${fmt(bank.cet1, 2)}</td>
        <td class="num">${fmt(bank.car, 2)}</td>
        <td class="num">${fmt(bank.npl, 2)}</td>
        <td class="num">${bank.nplcov}</td>
        <td>
          <span class="signal-badge ${getSignalClass(bank.signal)}">${bank.signalLabel}</span>
        </td>
      `;

      tr.addEventListener('click', () => toggleExpand(bank.id));
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpand(bank.id);
        }
      });

      tbody.appendChild(tr);

      // Expand row
      const expandTr = document.createElement('tr');
      expandTr.classList.add('expand-row');
      if (isExpanded) expandTr.classList.add('visible');
      expandTr.dataset.expandFor = bank.id;

      const parentNoteHtml = bank.parentNote
        ? `<p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2);">${bank.parentNote}</p>`
        : '';

      expandTr.innerHTML = `
        <td class="expand-cell" colspan="10">
          <div class="expand-inner">
            <div>
              <p class="expand-block-title">Credit Ratings</p>
              <ul class="rating-list">
                <li>
                  <span class="rating-agency">Fitch</span>
                  <span>${bank.ratings.fitch}</span>
                </li>
                <li>
                  <span class="rating-agency">Moody's</span>
                  <span>${bank.ratings.moodys}</span>
                </li>
                <li>
                  <span class="rating-agency">S&amp;P</span>
                  <span>${bank.ratings.sp}</span>
                </li>
              </ul>
              ${parentNoteHtml}
            </div>
            <div>
              <p class="expand-block-title">Deposit Rates — ${bank.ticker}</p>
              <table class="mini-deposit-table">
                <thead>
                  <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Savings</td><td class="num">${fmt(bank.deposits.savings, 2)}%</td></tr>
                  <tr><td>3M Fixed</td><td class="num">${fmt(bank.deposits.fd3, 2)}%</td></tr>
                  <tr><td>6M Fixed</td><td class="num">${fmt(bank.deposits.fd6, 2)}%</td></tr>
                  <tr><td>12M Fixed</td><td class="num">${fmt(bank.deposits.fd12, 2)}%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </td>
      `;

      tbody.appendChild(expandTr);
    });
  }

  function toggleExpand(bankId) {
    state.expandedId = state.expandedId === bankId ? null : bankId;
    renderBankTable();
  }

  /* ============================================
     TABLE SORT
     ============================================ */
  const COL_MAP = {
    name: 'name',
    price: 'price',
    mktcap: 'mktcap',
    pe: 'pe',
    div: 'div',
    cet1: 'cet1',
    car: 'car',
    npl: 'npl',
    nplcov: 'nplcov',
    signal: 'signal'
  };

  document.querySelectorAll('.bank-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = COL_MAP[th.dataset.col];
      if (!col) return;

      if (state.sortCol === col) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortCol = col;
        state.sortDir = 'asc';
      }

      // Update header classes
      document.querySelectorAll('.bank-table th').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');

      renderBankTable();
    });
  });

  /* ============================================
     FILTER BUTTONS
     ============================================ */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      state.expandedId = null;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBankTable();
    });
  });

  /* ============================================
     DEPOSIT RATE TABLE
     ============================================ */
  function getMaxFd12() {
    return Math.max(...BANKS.map(b => b.deposits.fd12));
  }

  function renderDepositTable() {
    const tbody = document.getElementById('depositTableBody');
    const maxFd12 = getMaxFd12();
    tbody.innerHTML = '';

    BANKS.forEach(bank => {
      const tr = document.createElement('tr');
      const isMaxFd12 = bank.deposits.fd12 === maxFd12;
      tr.innerHTML = `
        <td style="font-weight:600">${bank.ticker}</td>
        <td class="num">${fmt(bank.deposits.savings, 2)}%</td>
        <td class="num">${fmt(bank.deposits.fd3, 2)}%</td>
        <td class="num">${fmt(bank.deposits.fd6, 2)}%</td>
        <td class="num ${isMaxFd12 ? 'rate-high' : ''}">${fmt(bank.deposits.fd12, 2)}%</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ============================================
     DEPOSIT INSURANCE CALCULATOR
     ============================================ */
  const DPA_LIMIT = 1000000;

  function formatBaht(num) {
    return '฿' + Math.round(num).toLocaleString('en-US');
  }

  function calcInsurance(rawVal) {
    const result = document.getElementById('calcResult');
    // Strip commas, spaces, ฿ signs
    const clean = rawVal.replace(/[฿,\s]/g, '');
    const amount = parseFloat(clean);

    if (!clean || isNaN(amount) || amount <= 0) {
      result.innerHTML = 'Enter an amount above to see how many banks you need.';
      return;
    }

    if (amount <= DPA_LIMIT) {
      result.innerHTML = `<span class="banks-needed">1</span> bank needed — your full ${formatBaht(amount)} is covered at a single institution.`;
      return;
    }

    const banksNeeded = Math.ceil(amount / DPA_LIMIT);
    const coveredPer = formatBaht(DPA_LIMIT);
    const remainder = amount % DPA_LIMIT;
    const lastBank = remainder > 0 ? formatBaht(remainder) : coveredPer;

    result.innerHTML = `
      <span class="banks-needed">${banksNeeded}</span> banks needed to fully insure ${formatBaht(amount)}.<br>
      <span style="font-size:var(--text-xs);color:var(--color-text-muted);">
        ${banksNeeded - (remainder > 0 ? 1 : 0)} bank${banksNeeded > 2 || remainder === 0 ? 's' : ''} × ${coveredPer}${remainder > 0 ? ` + 1 bank × ${lastBank}` : ''}.
        DPA limit: ${coveredPer} per depositor per bank.
      </span>
    `;
  }

  const calcInput = document.getElementById('calcInput');
  calcInput.addEventListener('input', function () {
    calcInsurance(this.value);
  });

  // Friendly number formatting on blur
  calcInput.addEventListener('blur', function () {
    const clean = this.value.replace(/[฿,\s]/g, '');
    const amount = parseFloat(clean);
    if (!isNaN(amount) && amount > 0) {
      this.value = Math.round(amount).toLocaleString('en-US');
    }
  });

  calcInput.addEventListener('focus', function () {
    const clean = this.value.replace(/[,\s]/g, '');
    this.value = clean;
  });

  /* ============================================
     CET1 CHART (Chart.js)
     ============================================ */
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function getChartColors() {
    const isDark = state.theme === 'dark';
    return {
      bar: isDark ? 'rgba(180, 178, 172, 0.85)' : 'rgba(30, 28, 26, 0.78)',
      barBorder: isDark ? 'rgba(200, 198, 192, 0.9)' : 'rgba(10, 10, 8, 0.9)',
      lineMin: isDark ? 'rgba(130, 128, 122, 0.7)' : 'rgba(130, 128, 122, 0.7)',
      lineBuf: isDark ? 'rgba(100, 98, 92, 0.7)' : 'rgba(100, 98, 92, 0.7)',
      gridLine: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      tick: isDark ? 'rgba(170,168,162,0.8)' : 'rgba(90,88,82,0.8)',
      label: isDark ? 'rgba(150,148,142,1)' : 'rgba(80,78,72,1)',
    };
  }

  function updateChartColors() {
    if (!state.chart) return;
    const c = getChartColors();
    state.chart.data.datasets[0].backgroundColor = c.bar;
    state.chart.data.datasets[0].borderColor = c.barBorder;
    state.chart.options.scales.x.grid.color = c.gridLine;
    state.chart.options.scales.x.ticks.color = c.tick;
    state.chart.options.scales.y.ticks.color = c.label;
    state.chart.options.plugins.annotation.annotations.minLine.borderColor = c.lineMin;
    state.chart.options.plugins.annotation.annotations.bufLine.borderColor = c.lineBuf;
  }

  function initChart() {
    const ctx = document.getElementById('cet1Chart').getContext('2d');
    const c = getChartColors();

    const labels = BANKS.map(b => b.ticker);
    const values = BANKS.map(b => b.cet1);

    state.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'CET1 (%)',
          data: values,
          backgroundColor: c.bar,
          borderColor: c.barBorder,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
          barThickness: 32,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: state.theme === 'dark' ? '#1e1d1c' : '#ffffff',
            borderColor: state.theme === 'dark' ? '#353330' : '#d2d0c8',
            borderWidth: 1,
            titleColor: state.theme === 'dark' ? '#cccac7' : '#1a1916',
            bodyColor: state.theme === 'dark' ? '#787570' : '#76756f',
            titleFont: { family: "'Inter', sans-serif", size: 12, weight: '600' },
            bodyFont: { family: "'Inter', sans-serif", size: 11 },
            padding: 10,
            callbacks: {
              label: function(ctx) {
                return ` CET1: ${ctx.parsed.x.toFixed(2)}%`;
              }
            }
          },
          annotation: {
            annotations: {
              minLine: {
                type: 'line',
                xMin: 8,
                xMax: 8,
                borderColor: c.lineMin,
                borderWidth: 1.5,
                borderDash: [],
                label: {
                  display: true,
                  content: 'Min 8%',
                  position: 'start',
                  backgroundColor: 'transparent',
                  color: c.lineMin,
                  font: { size: 10, family: "'Inter', sans-serif" },
                  yAdjust: -10
                }
              },
              bufLine: {
                type: 'line',
                xMin: 10.5,
                xMax: 10.5,
                borderColor: c.lineBuf,
                borderWidth: 1.5,
                borderDash: [4, 3],
                label: {
                  display: true,
                  content: '+Buffer 10.5%',
                  position: 'start',
                  backgroundColor: 'transparent',
                  color: c.lineBuf,
                  font: { size: 10, family: "'Inter', sans-serif" },
                  yAdjust: -10
                }
              }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 28,
            grid: {
              color: c.gridLine,
              drawBorder: false
            },
            ticks: {
              color: c.tick,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: v => v + '%',
              stepSize: 4
            },
            border: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: c.label,
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
              padding: 8
            },
            border: { display: false }
          }
        }
      }
    });
  }

  /* Chart.js annotation plugin — load from CDN */
  function loadAnnotationPlugin(cb) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js';
    s.onload = cb;
    s.onerror = () => {
      // Fallback: init without annotations
      console.warn('Annotation plugin failed to load, proceeding without it');
      cb();
    };
    document.head.appendChild(s);
  }

  /* ============================================
     INIT
     ============================================ */
  function init() {
    initTheme();
    renderBankTable();
    renderDepositTable();
    loadAnnotationPlugin(initChart);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
