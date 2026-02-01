import { useMemo, useEffect, useState, useId } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext.jsx';
import './PlayerScatterChart.css';

function getThemeColor(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName).trim();
}

function PlayerTooltip({ active, payload, config }) {
  if (!active || !payload || payload.length === 0) return null;
  const player = payload[0].payload;
  
  return (
    <div className="player-scatter-tooltip">
      <div className="tooltip-header">
        {player.team_logo_url && (
          <img 
            src={player.team_logo_url} 
            alt={player.team_name}
            className="tooltip-logo"
          />
        )}
        <div className="tooltip-player-info">
          <div className="tooltip-player-name">{player.playerName}</div>
          <div className="tooltip-team-name">{player.team_name}</div>
        </div>
      </div>
      <div className="tooltip-stats">
        <div className="tooltip-stat">
          <span className="stat-label">{config.xLabel}:</span>
          <span className="stat-value">{config.xFormat ? config.xFormat(player.x) : player.x.toFixed(1)}</span>
        </div>
        <div className="tooltip-stat">
          <span className="stat-label">{config.yLabel}:</span>
          <span className="stat-value">{config.yFormat ? config.yFormat(player.y) : player.y.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function LogoPoint(props) {
  const { cx, cy, payload, chartId } = props;
  const size = 24;
  const clipId = `player-clip-${chartId}-${payload.player_id}`;

  if (!cx || !cy || isNaN(cx) || isNaN(cy)) return null;

  return (
    <g style={{ cursor: 'pointer' }}>
      {payload.team_logo_url ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle cx={cx} cy={cy} r={size / 2} />
            </clipPath>
          </defs>
          {/* Background circle for better visibility */}
          <circle 
            cx={cx} 
            cy={cy} 
            r={size / 2 + 1} 
            fill={payload.team_primary_color || '#ffffff'}
            stroke={getThemeColor('--color-border-primary')}
            strokeWidth={1}
          />
          <image
            href={payload.team_logo_url}
            x={cx - size / 2}
            y={cy - size / 2}
            width={size}
            height={size}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </>
      ) : (
        <circle 
          cx={cx} 
          cy={cy} 
          r={size / 2} 
          fill={payload.team_primary_color || getThemeColor('--color-accent-primary')}
          stroke={getThemeColor('--color-border-primary')}
          strokeWidth={1}
        />
      )}
    </g>
  );
}

/**
 * Scatter chart optimized for player data with team logos
 */
function PlayerScatterChart({ 
  players, 
  xKey, 
  yKey, 
  xLabel, 
  yLabel, 
  xFormat,
  yFormat,
  showMeanLines = true,
}) {
  const { theme } = useTheme();
  const [colorVersion, setColorVersion] = useState(0);
  const chartId = useId();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setColorVersion(v => v + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, [theme]);

  const chartData = useMemo(() => {
    return players
      .filter(p => p[xKey] != null && p[yKey] != null)
      .map(p => ({
        ...p,
        x: parseFloat(p[xKey]),
        y: parseFloat(p[yKey]),
        playerName: `${p.first_name} ${p.last_name}`,
      }));
  }, [players, xKey, yKey]);

  const { meanX, meanY } = useMemo(() => {
    if (chartData.length === 0) return { meanX: 0, meanY: 0 };
    const sumX = chartData.reduce((a, d) => a + d.x, 0);
    const sumY = chartData.reduce((a, d) => a + d.y, 0);
    return {
      meanX: sumX / chartData.length,
      meanY: sumY / chartData.length,
    };
  }, [chartData]);

  const { xDomain, yDomain } = useMemo(() => {
    if (chartData.length === 0) return { xDomain: [0, 100], yDomain: [0, 100] };
    const xs = chartData.map(d => d.x);
    const ys = chartData.map(d => d.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const xPadding = (xMax - xMin) * 0.08 || 1;
    const yPadding = (yMax - yMin) * 0.08 || 1;
    
    return {
      xDomain: [xMin - xPadding, xMax + xPadding],
      yDomain: [yMin - yPadding, yMax + yPadding],
    };
  }, [chartData]);

  const gridColor = getThemeColor('--color-border-secondary');
  const axisColor = getThemeColor('--color-text-tertiary');
  const refLineColor = getThemeColor('--color-text-tertiary');

  if (chartData.length === 0) {
    return (
      <div className="player-scatter-empty">
        No data available for this visualization
      </div>
    );
  }

  return (
    <div className="player-scatter-chart" key={colorVersion}>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            name={xLabel}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={{ stroke: axisColor }}
            axisLine={{ stroke: axisColor }}
            tickFormatter={xFormat}
            label={{
              value: xLabel,
              position: 'bottom',
              offset: 35,
              style: { fill: axisColor, fontSize: 12, fontWeight: 500 }
            }}
          />
          
          <YAxis
            type="number"
            dataKey="y"
            domain={yDomain}
            name={yLabel}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={{ stroke: axisColor }}
            axisLine={{ stroke: axisColor }}
            tickFormatter={yFormat}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -45,
              style: { fill: axisColor, fontSize: 12, fontWeight: 500, textAnchor: 'middle' }
            }}
          />
          
          {showMeanLines && (
            <>
              <ReferenceLine
                x={meanX}
                stroke={refLineColor}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <ReferenceLine
                y={meanY}
                stroke={refLineColor}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            </>
          )}
          
          <Tooltip 
            content={<PlayerTooltip config={{ xLabel, yLabel, xFormat, yFormat }} />}
            cursor={{ strokeDasharray: '3 3' }}
          />
          
          <Scatter
            data={chartData}
            shape={<LogoPoint chartId={chartId} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlayerScatterChart;
