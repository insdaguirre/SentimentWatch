import React, { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts';
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
  
  // Calculate daily average for color coding
  const dailyAverage = data.reduce((sum, item) => sum + item.close, 0) / data.length;
  const priceVsAverage = currentPrice - dailyAverage;
  const averagePercent = dailyAverage > 0 ? (priceVsAverage / dailyAverage) * 100 : 0;
  
  // Calculate gradient offset for daily average position
  const minPrice = Math.min(...data.map(item => item.close));
  const maxPrice = Math.max(...data.map(item => item.close));
  const priceRange = maxPrice - minPrice;
  const dailyAverageGradientOffset = priceRange > 0 ? ((dailyAverage - minPrice) / priceRange) * 100 : 50;
  
  // Create segmented data for multi-color line
  const createSegmentedData = () => {
    const segments = [];
    let currentSegment = null;
    
    chartData.forEach((point, index) => {
      const isAboveAverage = point.price >= dailyAverage;
      const color = isAboveAverage ? '#00ff00' : '#ff0000';
      
      if (!currentSegment || currentSegment.color !== color) {
        // Start new segment
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = {
          data: [point],
          color: color,
          isAboveAverage: isAboveAverage
        };
      } else {
        // Add to current segment
        currentSegment.data.push(point);
      }
    });
    
    // Add the last segment
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    return segments;
  };
  
  const lineSegments = createSegmentedData();
  
  // Add visual indicator in the price display
  const priceStatus = currentPrice >= dailyAverage ? 'ABOVE' : 'BELOW';
  const statusColor = currentPrice >= dailyAverage ? '#00ff00' : '#ff0000';

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
            ${currentPrice.toFixed(2)}
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
                      <stop offset="0%" stopColor="#00ff00" stopOpacity={0.3}/>
                      <stop offset={`${dailyAverageGradientOffset}%`} stopColor="#ffa500" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#ff0000" stopOpacity={0.3}/>
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
          {/* Render multiple line segments with different colors */}
          {lineSegments.map((segment, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey="price"
              data={segment.data}
              stroke={segment.color}
              strokeWidth={2}
              name={`SPY Price ${segment.isAboveAverage ? 'Above' : 'Below'} Avg`}
              connectNulls={false}
              dot={false}
            />
          ))}
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
