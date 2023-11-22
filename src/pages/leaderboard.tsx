import { useState, useEffect } from 'react';
import axios from 'axios';

interface Athlete {
  [key: string]: string;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<string>('Average Speed (m/s)');
  const [leaderboardData, setLeaderboardData] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/data');
        const data = response.data.data;

        if (data.length > 0) {
          const sortedData = data.sort((a: Athlete, b: Athlete) => parseFloat(b[activeTab]) - parseFloat(a[activeTab])).slice(0, 10);
          setLeaderboardData(sortedData);
        } else {
          setError('No data found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderLeaderboard = (data: Athlete[], title: string) => (
    <div className={`mb-4 tab-content ${activeTab === title ? 'block' : 'hidden'}`} key={title}>
      <h2 className="text-xl font-bold mb-2">{title} Leaderboard</h2>
      {loading && <div className="mt-8 flex justify-center">
        <svg className="animate-spin w-7 h-7 mr-3 fill-slate-800" viewBox="3 3 18 18">
          <path className="opacity-20" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
          </path>
          <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
          </path>
        </svg>
      </div>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="table-auto w-full max-w-md mx-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">{activeTab}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((athlete: Athlete, index: number) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{athlete.Name}</td>
                <td className="border px-4 py-2">{athlete[activeTab]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="text-center">
      <div className="bg-indigo-900 flex justify-center py-2 px-4">
        <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex" role="alert">
          <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Note</span>
          <span className="font-semibold mr-2 text-left flex-auto">This page fetches all user and makes the Leaderboard for top 10</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-8 mb-4">Leaderboard</h1>

      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded tab-btn ${activeTab === 'Average Speed (m/s)' ? 'active' : ''}`}
          onClick={() => setActiveTab('Average Speed (m/s)')}
        >
          Average Speed
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded tab-btn ${activeTab === 'Peak Speed (m/s)' ? 'active' : ''}`}
          onClick={() => setActiveTab('Peak Speed (m/s)')}
        >
          Peak Speed
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded tab-btn ${activeTab === 'Split Time 0-10 m (s)' ? 'active' : ''}`}
          onClick={() => setActiveTab('Split Time 0-10 m (s)')}
        >
          Split Time 0-10 m
        </button>
      </div>

      {renderLeaderboard(leaderboardData, activeTab)}
    </div>
  );
};

export default LeaderboardPage;
