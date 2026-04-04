import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="text-9xl mb-4">404</div>
        <h1 className="text-3xl mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF8C42] rounded-2xl hover:bg-[#FF7A30] transition-colors"
          >
            <Home size={20} />
            Go Home
          </button>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-6 py-3 bg-[#242424] rounded-2xl hover:bg-[#2A2A2A] transition-colors"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
