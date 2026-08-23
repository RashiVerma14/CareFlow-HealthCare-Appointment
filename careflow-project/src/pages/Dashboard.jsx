import {
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Target,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { asArray, getApiError, placementApi, resumeApi } from '../api/services.js';
import dashboardStudent from '../assets/dashboard-student-work.svg';
import { useAuth } from '../context/AuthContext.jsx';

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100'
};

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.email || 'Student';
  const [placements, setPlacements] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [placementResponse, resumeResponse] = await Promise.all([placementApi.list(), resumeApi.list()]);
        setPlacements(asArray(placementResponse.data));
        setResumes(asArray(resumeResponse.data));
      } catch (error) {
        setMessage(getApiError(error, 'Unable to load dashboard data.'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeApplications = useMemo(
    () => placements.filter((item) => !['REJECTED', 'SELECTED'].includes(String(item.status || '').toUpperCase())).length,
    [placements]
  );
  const pipelineCounts = useMemo(() => {
    return ['Applied', 'OA', 'Interview'].map((status) => [
      status,
      placements.filter((item) => String(item.status || '').toLowerCase() === status.toLowerCase()).length
    ]);
  }, [placements]);
  const readiness = placements.length || resumes.length ? Math.min(100, Math.round((resumes.length > 0 ? 45 : 0) + Math.min(activeApplications, 5) * 11)) : 0;
  const cards = [
    {
      title: 'Resumes',
      value: loading ? '...' : String(resumes.length),
      text: resumes.length ? 'Resume records loaded from backend' : 'No resume records found',
      icon: FileText,
      to: '/resume',
      trend: 'Backend',
      color: 'blue'
    },
    {
      title: 'DSA Progress',
      value: 'Open',
      text: 'Track practice in the DSA module',
      icon: BarChart3,
      to: '/dsa-tracker',
      trend: 'Manual',
      color: 'emerald'
    },
    {
      title: 'AI Interview',
      value: 'Start',
      text: 'Questions and reports come from backend',
      icon: Brain,
      to: '/interview',
      trend: 'API',
      color: 'violet'
    },
    {
      title: 'Applications',
      value: loading ? '...' : String(placements.length),
      text: `${activeApplications} active placement records`,
      icon: Building2,
      to: '/placement-tracker',
      trend: `${activeApplications} active`,
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-5">
      {message && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</div>}
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
                <CalendarDays size={14} />
              Placement Dashboard
              </span>
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{loading ? 'Loading' : 'Live API data'}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">Welcome back, {displayName}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Your dashboard is connected to backend placement and resume APIs. Use each module to manage current data.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Manage Resume
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/interview"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Start Interview
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <img
              src={dashboardStudent}
              alt="Student developer preparation illustration"
              className="mb-4 h-36 w-full rounded-md border border-slate-200 bg-white object-cover"
            />
            <p className="text-sm font-semibold text-slate-700">Overall Readiness</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold text-ink">{loading ? '--' : readiness}</span>
              <span className="mb-2 text-sm font-semibold text-slate-500">/ 100</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${readiness}%` }} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <TrendingUp size={16} />
              Calculated from resume and placement records
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className="group rounded-md border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-blue-200"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-md ring-1 ${colorStyles[card.color]}`}>
                  <Icon size={20} />
                </span>
                <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">{card.trend}</span>
              </div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <h3 className="mt-1 text-3xl font-bold text-ink">{card.value}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open
                <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-ink">Today Plan</h3>
              <p className="mt-1 text-sm text-slate-500">Small tasks that keep placement prep consistent.</p>
            </div>
            <Target className="text-primary" size={22} />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Upload or update resume', tag: 'Resume', time: resumes.length ? `${resumes.length} saved` : 'Pending' },
              { label: 'Review active placement records', tag: 'Placement', time: `${activeApplications} active` },
              { label: 'Complete one AI interview', tag: 'Interview', time: 'Backend report' }
            ].map((task) => (
              <label key={task.label} className="flex items-center gap-3 rounded-md border border-slate-100 p-3 text-sm text-slate-700 hover:bg-slate-50">
                <input type="checkbox" className="h-4 w-4 accent-primary" />
                <span className="flex-1">
                  <span className="block font-medium text-ink">{task.label}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={13} />
                    {task.time}
                  </span>
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{task.tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-ink">Preparation Status</h3>
              <p className="mt-1 text-sm text-slate-500">Module-wise readiness summary.</p>
            </div>
            <CheckCircle2 className="text-emerald-600" size={22} />
          </div>
          <div className="mt-5 space-y-4">
            {[
              ['Resume Records', resumes.length ? 100 : 0, resumes.length ? 'Available' : 'Upload needed'],
              ['Active Placements', placements.length ? Math.min(100, activeApplications * 20) : 0, activeApplications ? 'In progress' : 'No active records'],
              ['Interview Report', 0, 'Start an interview to generate report']
            ].map(([label, value, status]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink">Application Pipeline</h3>
            <Briefcase className="text-primary" size={21} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {pipelineCounts.map(([label, value]) => (
              <div key={label} className="rounded-md bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold text-ink">{value}</p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <Link to="/placement-tracker" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View all placements
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink">Recent Applications</h3>
            <Link to="/placement-tracker" className="text-sm font-semibold text-primary">Manage</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {placements.slice(0, 5).map((application) => (
                  <tr key={application.id ?? application.placementId ?? `${application.companyName}-${application.role}`} className="border-t border-slate-100">
                    <td className="px-3 py-3 font-medium text-ink">{application.companyName || application.company || application.name || 'Untitled'}</td>
                    <td className="px-3 py-3 text-slate-600">{application.role || 'Not available'}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-primary">
                        {application.status || 'Not available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && placements.length === 0 && (
              <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">No placement records found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
