import React, { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { fetchSPYData } from '../services/api';
import './SPYPriceChart.css';

const SPYPriceChart = ({ timeWindow = '1d' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSPYData = useCallback(async () => {
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
  }, [timeWindow]);

  useEffect(() => {
    loadSPYData();
  }, [loadSPYData]);

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

  // Calculate daily average first
  const dailyAverage = data.reduce((sum, item) => sum + item.close, 0) / data.length;
  
  // Calculate price range for gradient positioning
  const minPrice = Math.min(...data.map(item => item.close));
  const maxPrice = Math.max(...data.map(item => item.close));
  
  const chartData = data.map(item => {
    const isAboveAverage = item.close >= dailyAverage;
    let color;

    if (isAboveAverage) {
      // Gradient for prices above daily average (green shades)
      const rangeAbove = maxPrice - dailyAverage;
      // Normalize position from 0 (at dailyAverage) to 1 (at maxPrice)
      const normalizedPosition = rangeAbove > 0 ? (item.close - dailyAverage) / rangeAbove : 0.5;
      // Vary lightness: darker green near average, brighter green higher up
      // Example: lightness from 40% to 70%
      const lightness = 40 + (normalizedPosition * 30);
      color = `hsl(120, 100%, ${lightness}%)`; // Hue 120 is green
    } else {
      // Gradient for prices below daily average (red shades)
      const rangeBelow = dailyAverage - minPrice;
      // Normalize position from 0 (at dailyAverage) to 1 (at minPrice)
      const normalizedPosition = rangeBelow > 0 ? (dailyAverage - item.close) / rangeBelow : 0.5;
      // Vary lightness: darker red near average, brighter red lower down
      // Example: lightness from 40% to 10%
      const lightness = 40 - (normalizedPosition * 30);
      color = `hsl(0, 100%, ${lightness}%)`; // Hue 0 is red
    }

    return {
      time: format(new Date(item.timestamp), 'MMM d HH:mm'),
      price: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      isAboveAverage: isAboveAverage,
      color: color,
    };
  });

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const change = currentPrice - previousPrice;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  
  // Use the last data point for consistency
  const lastDataPoint = data[data.length - 1];
  const lastPrice = lastDataPoint?.close || currentPrice;
  
  // Calculate price vs average
  const priceVsAverage = currentPrice - dailyAverage;
  const averagePercent = dailyAverage > 0 ? (priceVsAverage / dailyAverage) * 100 : 0;
  
  // Add visual indicator in the price display - use the last data point for consistency
  const priceStatus = lastPrice >= dailyAverage ? 'ABOVE' : 'BELOW';
  const statusColor = lastPrice >= dailyAverage ? '#00ff00' : '#ff0000';

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
          <div className="current-price">
            ${lastPrice.toFixed(2)}
          </div>
          <div className={`price-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
          <div className="average-info">
            Avg: ${dailyAverage.toFixed(2)} ({averagePercent >= 0 ? '+' : ''}{averagePercent.toFixed(1)}%)
          </div>
          <div className="price-status" style={{ color: statusColor }}>
            {priceStatus} AVERAGE
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff00" stopOpacity={0.8}/>
              <stop offset="50%" stopColor="#ffa500" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#ff0000" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 1" stroke="#333" strokeOpacity={0.8} />
          <XAxis 
            dataKey="time" 
            stroke="#ffa500"
            style={{ fontSize: '11px', fontFamily: 'Courier New, Monaco, monospace' }}
            tick={{ fill: '#ffa500' }}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            stroke="#ffa500"
            style={{ fontSize: '11px', fontFamily: 'Courier New, Monaco, monospace' }}
            tick={{ fill: '#ffa500' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid #ffa500',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(255, 165, 0, 0.3)',
              color: '#ffffff',
              fontFamily: 'Courier New, Monaco, monospace'
            }}
            formatter={(value, name) => [
              `$${value.toFixed(2)}`,
              name === 'price' ? 'SPY PRICE' : name.toUpperCase()
            ]}
            labelStyle={{
              color: '#ffa500',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'Courier New, Monaco, monospace'
            }}
          />
          {/* Line underneath the dots */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#ffa500"
            strokeWidth={2}
            strokeOpacity={0.6}
            dot={false}
            name="SPY Price Line"
          />
          {/* Scatter points with individual colors */}
          <Scatter
            dataKey="price"
            data={chartData}
            name="SPY Price Points"
            fill="#ffa500"
            r={4}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
          {/* Daily average reference line */}
          <ReferenceLine 
            y={dailyAverage} 
            stroke="#ffa500" 
            strokeDasharray="2 2" 
            strokeOpacity={0.7}
            label={{ value: "Daily Avg", position: "topRight", style: { fill: '#ffa500', fontSize: '10px', fontFamily: 'Courier New, Monaco, monospace' } }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SPYPriceChart;
