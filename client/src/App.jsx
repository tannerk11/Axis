import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatGroupTabs from './components/StatGroupTabs';
import TeamsTable from './components/TeamsTable';
import TeamModal from './components/TeamModal';
import Bracketcast from './components/Bracketcast';
import Insights from './components/Insights';
import './App.css';

// In production, API is served from same origin (empty string)
// In development, use localhost:3001
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:3001');

function App() {
  const [teams, setTeams] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [months, setMonths] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [league, setLeague] = useState('mens');
  const [season, setSeason] = useState('2025-26');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState('teams');
  const [statGroup, setStatGroup] = useState('Overview');

  const [filters, setFilters] = useState({
    conference: 'All Conferences',
    opponent: 'all',
    seasonSegment: 'all',
  });

  const isInitialMount = useRef(true);

  const fetchTeams = async (currentLeague = league, currentSeason = season) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        league: currentLeague,
        season: currentSeason,
        ...(filters.conference !== 'All Conferences' && { conference: filters.conference }),
        ...(filters.opponent === 'conference' && { gameType: 'conference' }),
        ...(filters.seasonSegment !== 'all' && { seasonSegment: filters.seasonSegment }),
      });

      const response = await fetch(`${API_URL}/api/teams?${params}`);
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastUpdated = async (currentSeason = season) => {
    try {
      const response = await fetch(`${API_URL}/api/last-updated?season=${currentSeason}`);
      const data = await response.json();
      if (data.lastUpdated) {
        setLastUpdated(new Date(data.lastUpdated));
      }
    } catch (error) {
      console.error('Failed to fetch last updated:', error);
    }
  };

  const fetchConferences = async (currentLeague = league, currentSeason = season) => {
    try {
      const response = await fetch(`${API_URL}/api/conferences?league=${currentLeague}&season=${currentSeason}`);
      const data = await response.json();
      setConferences(data);
    } catch (error) {
      console.error('Failed to fetch conferences:', error);
    }
  };

  const fetchMonths = async (currentLeague = league, currentSeason = season) => {
    try {
      const response = await fetch(`${API_URL}/api/months?league=${currentLeague}&season=${currentSeason}`);
      const data = await response.json();
      setMonths(data);
    } catch (error) {
      console.error('Failed to fetch months:', error);
    }
  };

  const fetchSeasons = async () => {
    try {
      const response = await fetch(`${API_URL}/api/seasons`);
      const data = await response.json();
      setSeasons(data);
    } catch (error) {
      console.error('Failed to fetch seasons:', error);
    }
  };

  useEffect(() => {
    fetchSeasons();
    fetchConferences();
    fetchMonths();
    fetchTeams();
    fetchLastUpdated();
  }, []);

  // Auto-apply when filters change (skip initial mount — handled above)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchTeams();
  }, [filters.conference, filters.opponent, filters.seasonSegment]);

  const handleLeagueChange = (newLeague) => {
    if (newLeague !== league) {
      setLeague(newLeague);
      // Reset conference filter when switching leagues
      setFilters(prev => ({ ...prev, conference: 'All Conferences' }));
      // Fetch new data for the selected league
      fetchConferences(newLeague, season);
      fetchMonths(newLeague, season);
      // Fetch teams explicitly since league isn't in the filters useEffect deps
      fetchTeams(newLeague, season);
    }
  };

  const handleSeasonChange = (newSeason) => {
    if (newSeason !== season) {
      setSeason(newSeason);
      // Reset filters when switching seasons
      setFilters({
        conference: 'All Conferences',
        opponent: 'all',
        seasonSegment: 'all',
      });
      setStatGroup('Overview');
      // Fetch all data for the new season
      fetchConferences(league, newSeason);
      fetchMonths(league, newSeason);
      fetchTeams(league, newSeason);
      fetchLastUpdated(newSeason);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setStatGroup('Overview');
    setFilters({
      conference: 'All Conferences',
      opponent: 'all',
      seasonSegment: 'all',
    });
    // The useEffect on filters will auto-fetch
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <Header
        league={league}
        onLeagueChange={handleLeagueChange}
        activePage={currentPage}
        onPageChange={handlePageChange}
        season={season}
        seasons={seasons}
        onSeasonChange={handleSeasonChange}
      />

      {currentPage === 'teams' ? (
        <main className="main-content">
          <div className="page-header">
            <h1>NAIA {league === 'mens' ? "Men's" : "Women's"} Basketball Team Stats</h1>
            {lastUpdated && (
              <p className="last-updated">Last Updated {formatLastUpdated()}</p>
            )}
          </div>

          <FilterBar
            conferences={conferences}
            months={months}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <StatGroupTabs active={statGroup} onChange={setStatGroup} />

          <TeamsTable
            teams={teams}
            loading={loading}
            statGroup={statGroup}
            onTeamClick={setSelectedTeam}
          />
        </main>
      ) : currentPage === 'bracketcast' ? (
        <Bracketcast league={league} season={season} onTeamClick={setSelectedTeam} />
      ) : currentPage === 'insights' ? (
        <Insights
          teams={teams}
          league={league}
          season={season}
          loading={loading}
          onTeamClick={setSelectedTeam}
        />
      ) : null}

      {selectedTeam && (
        <TeamModal team={selectedTeam} season={season} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
}

export default App;
