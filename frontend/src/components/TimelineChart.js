import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import './TimelineChart.css';

const TimelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="timeline-chart section-card">
        <h2>Sentiment Timeline</h2>
        <div className="no-data">No timeline data available yet</div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    time: format(new Date(item.timestamp), 'MMM d HH:mm:ss'),
    overallScore: item.overallScore,
    confidence: item.confidence,
    totalPosts: item.totalPosts,
    sentiment: item.overallSentiment
  }));

  return (
    <div className="timeline-chart section-card">
      <div className="timeline-chart__header">
        <div>
          <p className="eyebrow">Sentiment trend</p>
          <h2>Seven-day score trajectory</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 180, 199, 0.14)" />
          <XAxis
            dataKey="time" 
            stroke="#9cb4c7"
            style={{ fontSize: '0.8rem' }}
            minTickGap={24}
          />
          <YAxis
            domain={[0, 1]}
            stroke="#9cb4c7"
            style={{ fontSize: '0.8rem' }}
            tickFormatter={(value) => `${Math.round(value * 100)}`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(7, 17, 28, 0.96)',
              border: '1px solid rgba(143, 181, 209, 0.18)',
              borderRadius: '14px',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.28)',
              color: '#f5fbff',
            }}
            formatter={(value, name) => [
              name === 'overallScore' || name === 'confidence' ? `${Math.round(value * 100)}%` : value,
              name === 'overallScore' ? 'Sentiment score' : 'Confidence',
            ]}
          />
          <Line
            type="monotone"
            dataKey="overallScore"
            stroke="#5fd1ff"
            strokeWidth={3}
            dot={{ fill: '#5fd1ff', r: 4 }}
            activeDot={{ r: 6 }}
            name="overallScore"
          />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#f2b84b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#f2b84b', r: 3 }}
            activeDot={{ r: 5 }}
            name="confidence"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
