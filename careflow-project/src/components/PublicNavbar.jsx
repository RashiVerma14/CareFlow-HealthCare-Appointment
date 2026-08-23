import { BriefcaseBusiness, LogIn } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button.jsx';

export default function PublicNavbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
            <BriefcaseBusiness size={20} />
          </span>
          PlacePrep
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Login
          </NavLink>
          <Link to="/register">
            <Button>
              <LogIn size={16} />
              Register
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
