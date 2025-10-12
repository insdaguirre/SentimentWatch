import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { fetchSPYData } from '../services/api';
import './SPYPriceChart.css';

const SPYPriceChart = ({ timeWindow = '1d' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSPYData();
  }, [timeWindow]);

  const loadSPYData = async () => {
    try {
      setLoading(true);
      setError(null);
      const spyData = await fetchSPYData(timeWindow);
      setData(spyData);
    } catch (err) {
      console.error('Error loading SPY data:', err);
      setError('Failed to load SPY price data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spy-price-chart">
        <h2>📈 SPY Price Chart</h2>
        <div className="loading">Loading price data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spy-price-chart">
        <h2>📈 SPY Price Chart</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="spy-price-chart">
        <h2>📈 SPY Price Chart</h2>
        <div className="no-data">No price data available</div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    time: format(new Date(item.timestamp), 'MMM d HH:mm'),
    price: item.close,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume
  }));

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const change = currentPrice - previousPrice;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

  const formatTimeWindow = (tw) => {
    const windows = {
      '1d': '1 Day',
      '5d': '5 Days',
      '1mo': '1 Month',
      '6mo': '6 Months',
      '1y': '1 Year',
      '5y': '5 Years'
    };
    return windows[tw] || tw;
  };

  return (
    <div className="spy-price-chart">
      <div className="chart-header">
        <h2>📈 SPY Price Chart ({formatTimeWindow(timeWindow)})</h2>
        <div className="price-info">
          <div className="current-price">${currentPrice.toFixed(2)}</div>
          <div className={`price-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '0.8rem' }}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            stroke="#6b7280"
            style={{ fontSize: '0.8rem' }}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.95)',
              border: '1px solid #374151',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              color: '#f9fafb'
            }}
            formatter={(value, name) => [
              `$${value.toFixed(2)}`, 
              name === 'price' ? 'Price' : name
            ]}
            labelStyle={{ color: '#f9fafb' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#priceGradient)"
            name="SPY Price"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SPYPriceChart;
