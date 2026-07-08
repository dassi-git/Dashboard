import React from 'react';

const cardStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: 'auto',
  maxHeight: 'none',
  minHeight: '30px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  padding: '1px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  fontSize: '0.55rem',
  fontWeight: 700,
  marginBottom: '0',
  color: '#0f172a',
  textAlign: 'right',
};

const chartWrapperStyle: React.CSSProperties = {
  flex: 1,
  height: '100%',
  minHeight: 0,
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
};

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function ChartCard({ title, children, style }: Props) {
  return (
    <div style={{ ...cardStyle, ...style }}>
      <div style={titleStyle}>{title}</div>
      <div style={chartWrapperStyle}>{children}</div>
    </div>
  );
}
