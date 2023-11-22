import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface UserData {
  Name: string;
  'Date:time': string;
  'Concentric Load (kg)': number;
  'Eccentric Load (kg)': number;
  'Concentric Speed Limit (m/s)': number;
  'Eccentric Speed Limit (m/s)': number;
  'Total Time (s)': number;
  'Total Distance (m)': number;
  'Average Speed (m/s)': number;
  'Peak Speed (m/s)': number;
  'Split Time 0-10 m (s)': number;
  'Average Speed 0-10 m (m/s)': number;
  'Peak Speed 0-10 m (m/s)': number;
  'Split Time 10-20 m (s)': number;
  'Split Distance 10-20 m (m)': number;
  'Average Speed 10-20 m (m/s)': number;
  'Peak Speed 10-20 m (m/s)': number;
  'Split Time 20-30 m (s)': number;
  'Split Distance 20-30 m (m)': number;
  'Average Speed 20-30 m (m/s)': number;
  'Peak Speed 20-30 m (m/s)': number;
  'Split Time 30-40 m (s)': number;
  'Split Distance 30-40 m (m)': number;
  'Average Speed 30-40 m (m/s)': number;
  'Peak Speed 30-40 m (m/s)': number;
}

interface ApiUserData {
  data: UserData[];
}

const UserPage = () => {
  const [userName, setUserName] = useState<string>('');
  const [userList, setUserList] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ErrorFetched, setErrorFetched] = useState<boolean>(false);
  const [users, setUsers] = useState<ApiUserData>();

  const fetch = async () => {
    const response = await axios.get('/api/data');
    const user: ApiUserData = response.data;
    setUsers(user)
  }

  useEffect(() => {
    fetch();
  }, []);

  const handleSearch = async () => {
    setSelectedUser(null);
    setUserList([]);
    setErrorFetched(false);
    setLoading(true);
    if (Array.isArray(users?.data)) {fetch()}
    try {
      if (Array.isArray(users?.data) && users && users.data.length > 0) {
        const filteredUsers: UserData[] = users.data.filter(
          (user) => user.Name.toLowerCase().includes(userName.toLowerCase())
        );
        filteredUsers.length > 0 ? setUserList(filteredUsers) : setErrorFetched(true);

      } else {
        console.error('Invalid or empty response from the API:', users);
        setErrorFetched(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
  };

  return (
    <>
      {loading ? (
        <div className="mt-20 flex justify-center">
          <svg className="animate-spin w-7 h-7 mr-3 fill-slate-800" viewBox="3 3 18 18">
            <path className="opacity-20" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
            </path>
            <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
            </path>
          </svg>
        </div>
      ) : (
        <div className="text-center">
          <form className="mt-8" onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <label className="block text-2xl font-bold mb-2" htmlFor="userName">
              Enter User Name:
            </label>
            <div className="flex justify-center items-center">
              <input
                type="text"
                id="userName"
                className="border my-2 border-gray-300 p-2 rounded-md"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <button
                type='submit'
                className="bg-blue-500 text-white px-4 mx-4 py-2 rounded"
              >
                Search
              </button>
            </div>
          </form>
          {userList.length > 0 ? (
            <>
              <h2 className="text-xl font-bold mt-4 mb-2">Matching Users</h2>
              <div className="flex flex-wrap justify-center text-xl space-x-4 mb-4">
                {userList.map((user: UserData, index: number) => (
                  <button
                    key={index}
                    className={`${selectedUser === user ? 'bg-purple-600' : ''} bg-blue-500 font-medium text-white px-4 py-2 rounded mb-2`}
                    onClick={() => handleUserClick(user)}
                  >
                    {user.Name.split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>{ErrorFetched ? <p className='text-xl text-red-600 font-semibold mt-4'>User not Found</p> : <p>Enter a user name to fetch data</p>}</>
          )}
          {selectedUser && (
            <div>
              <h2 className="text-xl font-bold mt-4 mb-2">
                {selectedUser.Name
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                {' '} Stats
              </h2>
              <table className="table-auto w-full max-w-md mx-auto mb-4">
                <thead>
                  <tr>
                    <th className="border text-lg px-4 py-2">Stats</th>
                    <th className="border text-lg px-4 py-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedUser).map(([key, value]: [string, string], index: number) => (
                    key !== 'Name' && key !== 'Date:time' && (
                      <tr key={index}>
                        <td className="border px-4 font-medium py-2">{key as string}</td>
                        <td className="border px-4 py-2">{value as string | number}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserPage;
