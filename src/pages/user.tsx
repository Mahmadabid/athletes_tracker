import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface UserData {
  Name: string;
  'Date:time': string;
  [key: string]: string | number;
}

const UserPage = () => {
  const [userName, setUserName] = useState<string>('');
  const [userList, setUserList] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorFetched, setErrorFetched] = useState<boolean>(false);
  const [users, setUsers] = useState<UserData[]>();
  const [errorReFetch, setErrorReFetch] = useState<string>('');

  const fetch = async () => {
    try {
      const response = await axios.get('/api/data');
      const userArray: UserData[] = response.data.data;
      setUsers(userArray);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorReFetch('Something went wrong with our data. Try again!');
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSearch = async () => {
    setSelectedUser(null);
    setUserList([]);
    setErrorFetched(false);
    setLoading(true);

    try {
      if (!Array.isArray(users)) {
        await fetch();
      }

      if (Array.isArray(users) && users.length > 0) {
        const filteredUsers: UserData[] = users.filter(
          (user) => user.Name.toLowerCase().includes(userName.toLowerCase())
        );

        if (filteredUsers.length > 0) {
          setUserList(filteredUsers);
        } else {
          setErrorFetched(true);
        }
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
          <div className="bg-indigo-900 flex justify-center py-2 px-4">
            <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex" role="alert">
              <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Note</span>
              <span className="font-semibold mr-2 text-left flex-auto">
                This page fetches all users on load. Useful for small data
              </span>
            </div>
          </div>
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
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
              <button type="submit" className="bg-blue-500 text-white px-4 mx-4 py-2 rounded">
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
            <>{errorFetched ? (errorReFetch.length > 0 ? (
              <p className="text-xl text-red-600 font-semibold mt-4">{errorReFetch}</p>
            ) : (
              <p className="text-xl text-red-600 font-semibold mt-4">User not Found</p>
            )) : (
              <p>Enter a user name to fetch data</p>
            )}</>
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
                  {Object.entries(selectedUser).map(([key, value]: [string, string | number], index: number) => (
                    key !== 'Name' && key !== 'Date:time' && (
                      <tr key={index}>
                        <td className="border px-4 font-medium py-2">{key as string}</td>
                        <td className="border px-4 py-2">{value}</td>
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
