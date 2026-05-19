import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-serif font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-serif font-bold text-black mb-6">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-black text-white px-8 py-4 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors">
        Back To Home
      </Link>
    </div>
  );
}
