import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import './SPYPriceChart.css';

const SPYPriceChart = ({ data, ticker, company }) => {

  if (!data || data.length === 0) {
    return (
      <div className="spy-price-chart section-card">
        <h2>Synthetic price context</h2>
        <div className="no-data">No price data available</div>
      </div>
    );
  }

  const dailyAverage = data.reduce((sum, item) => sum + item.close, 0) / data.length;
  const chartData = data.map(item => ({
    time: format(new Date(item.timestamp), 'MMM d'),
    price: item.close,
    close: item.close,
  }));

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const change = currentPrice - previousPrice;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  const lastDataPoint = data[data.length - 1];
  const lastPrice = lastDataPoint?.close || currentPrice;
  const priceVsAverage = currentPrice - dailyAverage;
  const averagePercent = dailyAverage > 0 ? (priceVsAverage / dailyAverage) * 100 : 0;
  const priceStatus = lastPrice >= dailyAverage ? 'ABOVE' : 'BELOW';

  return (
    <div className="spy-price-chart section-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">Synthetic price path</p>
          <h2>{ticker} price context</h2>
          <p>{company} price action paired with the sentiment trend.</p>
        </div>
        <div className="price-info">
          <div className="current-price">${lastPrice.toFixed(2)}</div>
          <div className={`price-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
          <div className="average-info">
            Avg: ${dailyAverage.toFixed(2)} ({averagePercent >= 0 ? '+' : ''}{averagePercent.toFixed(1)}%)
          </div>
          <div className={`price-status ${lastPrice >= dailyAverage ? 'positive' : 'negative'}`}>
            {priceStatus} AVERAGE
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 18, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 180, 199, 0.14)" />
          <XAxis
            dataKey="time"
            stroke="#9cb4c7"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#9cb4c7' }}
          />
          <YAxis
            domain={['dataMin - 5', 'dataMax + 5']}
            stroke="#9cb4c7"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#9cb4c7' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(7, 17, 28, 0.96)',
              border: '1px solid rgba(143, 181, 209, 0.18)',
              borderRadius: '14px',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.28)',
              color: '#f5fbff',
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Synthetic close']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#f2b84b"
            strokeWidth={3}
            dot={false}
            name="Price"
          />
          <ReferenceLine
            y={dailyAverage}
            stroke="#5fd1ff"
            strokeDasharray="5 5"
            strokeOpacity={0.8}
            label={{ value: 'Avg', position: 'topRight', style: { fill: '#5fd1ff', fontSize: '10px' } }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SPYPriceChart;
