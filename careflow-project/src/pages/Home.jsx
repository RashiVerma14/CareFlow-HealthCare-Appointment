import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';
import studentHero from '../assets/student-placement-hero.svg';

const features = ['Resume analysis', 'Mock interview practice', 'DSA progress tracking', 'Company application tracker'];

export default function Home() {
  return (
    <div className="min-h-screen bg-soft">
      <PublicNavbar />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <img
            src={studentHero}
            alt=""
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden h-full w-[58%] object-cover opacity-95 lg:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/25" />

          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:min-h-[560px] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase text-primary">Final Year Project</p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
                Placement Preparation Platform
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                A simple and practical dashboard for students to manage resumes, interviews, DSA practice and company
                applications from one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button>
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-card lg:hidden">
              <img
                src={studentHero}
                alt="Student preparing for placement interviews and coding practice"
                className="h-64 w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-green-50 text-green-600">
                  <CheckCircle2 size={20} />
                </span>
                <span className="text-sm font-semibold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
