import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-soft px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="mt-5 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
