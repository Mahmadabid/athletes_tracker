import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-blue-500 p-4 text-white shadow-md relative flex items-center">
      <h1 className="mx-auto text-4xl xse:text-3xl font-bold">
        <Link href='/'>Athlete Tracker</Link>
      </h1>
      <div>
        <button onClick={toggleMenu} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`absolute right-0 mr-4 mt-2 w-48 bg-white shadow-md rounded-md ${menuOpen ? 'block' : 'hidden'}`}>
          <Link href="/user">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">User</h1>
          </Link>
          <Link href="/leaderboard">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Leaderboard</h1>
          </Link>
          <Link href="/userimproved">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">User by Request</h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
