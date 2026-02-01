import './StatGroupTabs.css';

const STAT_GROUPS = [
  { key: 'Overview', label: 'Ratings' },
  { key: 'Shooting', label: 'Shooting' },
  { key: 'Rebounding', label: 'Rebounding' },
  { key: 'Playmaking', label: 'Playmaking' },
  { key: 'Defense', label: 'Defense' },
  { key: 'Schedule', label: 'Schedule' },
  { key: 'Experimental', label: 'Experimental' },
];

function StatGroupTabs({ active, onChange }) {
  return (
    <div className="stat-group-tabs">
      {STAT_GROUPS.map((group) => (
        <button
          key={group.key}
          className={`stat-group-tab ${active === group.key ? 'active' : ''}`}
          onClick={() => onChange(group.key)}
        >
          {group.label}
        </button>
      ))}
    </div>
  );
}

export default StatGroupTabs;
