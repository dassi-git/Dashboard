import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type StatCardProps = {
  title: string;
  value: string;
  delay?: number;
};

function StatCard({ title, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.04)',
        border: '1px solid #e2e8f0',
      }}
    >
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{value}</div>
    </motion.div>
  );
}

export default function AnimatedDashboardExample() {
  const [data, setData] = useState([
    { name: 'A', value: 18 },
    { name: 'B', value: 34 },
    { name: 'C', value: 22 },
    { name: 'D', value: 40 },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const animateBars = useMemo(() => data.map((item, index) => ({
    ...item,
    delay: index * 0.08,
  })), [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        <StatCard title="Total Requests" value="1,248" delay={0.05} />
        <StatCard title="Open Issues" value="84" delay={0.1} />
        <StatCard title=" SLA Breach" value="12%" delay={0.15} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>Performance by Category</h4>
          <button
            onClick={() => {
              setData((prev) => prev.map((item, idx) => ({
                ...item,
                value: idx === activeIndex ? Math.max(10, item.value + 8) : item.value,
              })));
              setActiveIndex((prev) => (prev + 1) % data.length);
            }}
            style={{ border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: 999, padding: '6px 10px', cursor: 'pointer' }}
          >
            Update Data
          </button>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {animateBars.map((entry, index) => (
                  <Cell key={entry.name} fill={index % 2 === 0 ? '#60a5fa' : '#34d399'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        {animateBars.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
            style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 10 }}
          >
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{item.name}</div>
            <div style={{ height: 90, display: 'flex', alignItems: 'flex-end' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(8, item.value * 1.8)}px` }}
                transition={{ duration: 0.45, delay: index * 0.06 + 0.1, ease: 'easeOut' }}
                style={{ width: '100%', borderRadius: 8, background: index % 2 === 0 ? '#60a5fa' : '#34d399' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
