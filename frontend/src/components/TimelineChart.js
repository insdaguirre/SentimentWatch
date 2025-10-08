import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import './TimelineChart.css';

const TimelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="timeline-chart">
        <h2>Sentiment Timeline</h2>
        <div className="no-data">No timeline data available yet</div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    time: format(new Date(item.timestamp), 'MMM d HH:mm'),
    overallScore: item.overallScore,
    confidence: item.confidence,
    totalPosts: item.totalPosts,
    sentiment: item.overallSentiment
  }));

  return (
    <div className="timeline-chart">
      <h2>📊 Sentiment Timeline (Last 24 Hours)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '0.8rem' }}
          />
          <YAxis 
            domain={[0, 1]}
            stroke="#6b7280"
            style={{ fontSize: '0.8rem' }}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="overallScore" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', r: 4 }}
            activeDot={{ r: 6 }}
            name="Overall Score"
          />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981', r: 3 }}
            activeDot={{ r: 5 }}
            name="Confidence"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;

