export const commonOptions = {
  maintainAspectRatio: false,
  responsive: true,
<<<<<<< HEAD
  animation: false,
=======
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, boxWidth: 10 },
    },
    tooltip: { enabled: true },
  },
  scales: {
    x: { ticks: { color: '#334155' }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { ticks: { color: '#334155' }, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};

export const topicsOptions = {
  ...commonOptions,
  indexAxis: 'y' as const,
    scales: {
    x: { stacked: true, ticks: { color: '#334155' }, grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { stacked: true, ticks: { color: '#334155' }, grid: { display: false } },
  },
};

export const slaOptions = {
  ...commonOptions,
  scales: {
    x: { stacked: false, ticks: { color: '#334155' } },
    y: { ticks: { color: '#334155' } },
  },
};

export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 0 },
<<<<<<< HEAD
  animation: false,
=======
  animation: { duration: 450, easing: 'easeOutQuart' as const, animateRotate: false, animateScale: true },
>>>>>>> 91f2f6a418b7cae5c3604519a930a49c8f4f13c3
  plugins: {
    legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 10 } },
    tooltip: { enabled: true },
  },
  // no scales for pie/doughnut charts
  scales: {},
};
