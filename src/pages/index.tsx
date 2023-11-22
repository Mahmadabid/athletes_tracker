import Link from 'next/link';

const Home = () => {
  return (
    <div className="container mx-auto mt-10 text-center px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Athlete Tracker</h1>
      <p className="text-lg mb-8">
        Track and analyze athlete data to monitor performance and progress.
      </p>
      <div className="flex justify-center space-x-8">
        <Link href="/user">
          <p className="bg-blue-500 text-white px-4 py-2 rounded">User</p>
        </Link>
        <Link href="/leaderboards">
          <p className="bg-blue-500 text-white px-4 py-2 rounded">Leaderboards</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
