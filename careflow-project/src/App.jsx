import {
  Activity,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  Mail,
  Menu,
  Pill,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCog,
  Users,
  Video,
  X,
  XCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';

const roles = ['Patient', 'Doctor', 'Admin'];
const slots = ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'];

const initialDoctors = [
  {
    id: 'dr-meera',
    name: 'Dr. Meera Kapoor',
    specialty: 'Cardiology',
    rating: 4.9,
    slotDuration: 30,
    next: 'Today 4:30 PM',
    hours: '09:00 - 17:00',
    leave: ['2026-08-27'],
    focus: 'Hypertension, chest pain, preventive cardiac care'
  },
  {
    id: 'dr-ayaan',
    name: 'Dr. Ayaan Khanna',
    specialty: 'Dermatology',
    rating: 4.8,
    slotDuration: 20,
    next: 'Tomorrow 11:20 AM',
    hours: '10:00 - 18:00',
    leave: [],
    focus: 'Rashes, acne, allergy and skin infections'
  },
  {
    id: 'dr-sen',
    name: 'Dr. Ritu Sen',
    specialty: 'General Medicine',
    rating: 4.9,
    slotDuration: 15,
    next: 'Today 6:00 PM',
    hours: '08:00 - 14:00',
    leave: ['2026-08-29'],
    focus: 'Fever, diabetes follow-up, respiratory symptoms'
  }
];

const initialAppointments = [
  {
    id: 'APT-1042',
    patient: 'Priyanshu Singh',
    doctorId: 'dr-meera',
    doctor: 'Dr. Meera Kapoor',
    time: '23 Aug, 4:30 PM',
    slot: '4:30 PM',
    status: 'Confirmed',
    urgency: 'Medium',
    complaint: 'Intermittent chest tightness with elevated pulse',
    calendar: 'Synced',
    email: 'Delivered',
    summaryReady: false
  },
  {
    id: 'APT-1043',
    patient: 'Ananya Rao',
    doctorId: 'dr-sen',
    doctor: 'Dr. Ritu Sen',
    time: '24 Aug, 10:15 AM',
    slot: '10:15 AM',
    status: 'Hold expires in 04:21',
    urgency: 'Low',
    complaint: 'Fever and sore throat for two days',
    calendar: 'Pending retry',
    email: 'Queued',
    summaryReady: false
  },
  {
    id: 'APT-1044',
    patient: 'Kabir Malhotra',
    doctorId: 'dr-ayaan',
    doctor: 'Dr. Ayaan Khanna',
    time: '23 Aug, 5:30 PM',
    slot: '5:30 PM',
    status: 'Confirmed',
    urgency: 'Low',
    complaint: 'Recurring skin rash with itching after medication change',
    calendar: 'Synced',
    email: 'Delivered',
    summaryReady: false
  },
  {
    id: 'APT-1045',
    patient: 'Sara Khan',
    doctorId: 'dr-meera',
    doctor: 'Dr. Meera Kapoor',
    time: '23 Aug, 6:00 PM',
    slot: '6:00 PM',
    status: 'Confirmed',
    urgency: 'High',
    complaint: 'Shortness of breath and chest discomfort since morning',
    calendar: 'Pending retry',
    email: 'Queued',
    summaryReady: false
  },
  {
    id: 'APT-1046',
    patient: 'Rohan Iyer',
    doctorId: 'dr-sen',
    doctor: 'Dr. Ritu Sen',
    time: '24 Aug, 12:00 PM',
    slot: '12:00 PM',
    status: 'Completed',
    urgency: 'Medium',
    complaint: 'Persistent fever with body ache and dehydration risk',
    calendar: 'Synced',
    email: 'Delivered',
    summaryReady: true
  }
];

const initialPatients = [
  { name: 'Priyanshu Singh', age: 24, lastVisit: 'Today', condition: 'Cardiology review', risk: 'Medium' },
  { name: 'Ananya Rao', age: 31, lastVisit: 'Tomorrow', condition: 'Fever and throat pain', risk: 'Low' },
  { name: 'Kabir Malhotra', age: 28, lastVisit: 'Today', condition: 'Dermatology allergy review', risk: 'Low' },
  { name: 'Sara Khan', age: 45, lastVisit: 'Today', condition: 'Breathing discomfort', risk: 'High' },
  { name: 'Rohan Iyer', age: 36, lastVisit: '24 Aug', condition: 'General medicine follow-up', risk: 'Medium' }
];

const initialReminders = [
  { medicine: 'Amoxicillin 500 mg', when: '08:00 AM, 08:00 PM', channel: 'Email + in-app', active: true },
  { medicine: 'Pantoprazole 40 mg', when: 'Before breakfast', channel: 'Email', active: true },
  { medicine: 'Follow-up vitals check', when: '26 Aug, 09:00 AM', channel: 'In-app', active: true }
];

const navByRole = {
  Patient: [
    ['overview', 'Overview', Home],
    ['book', 'Book Appointment', Search],
    ['appointments', 'My Appointments', CalendarClock],
    ['medication', 'Medication', Pill],
    ['settings', 'Settings', Settings]
  ],
  Doctor: [
    ['overview', 'Overview', Home],
    ['clinical', 'Clinical Queue', Stethoscope],
    ['patients', 'Patients', Users],
    ['timeline', 'Timeline', Activity],
    ['settings', 'Settings', Settings]
  ],
  Admin: [
    ['overview', 'Overview', Home],
    ['doctors', 'Doctors', UserCog],
    ['patients', 'Patients', Users],
    ['reliability', 'Reliability', ShieldCheck],
    ['timeline', 'Timeline', Activity],
    ['settings', 'Settings', Settings]
  ]
};

const portalTheme = {
  Patient: {
    loginImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=85',
    dashboardImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1800&q=85',
    title: 'Patient Care Portal',
    subtitle: 'Book visits, track reminders, and manage follow-ups with clear guidance.'
  },
  Doctor: {
    loginImage: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1800&q=85',
    dashboardImage: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=85',
    title: 'Doctor Clinical Portal',
    subtitle: 'Review patient context, AI summaries, prescriptions, and visit outcomes.'
  },
  Admin: {
    loginImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=85',
    dashboardImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=85',
    title: 'Admin Operations Portal',
    subtitle: 'Manage doctors, patients, leave conflicts, queues, and calendar reliability.'
  }
};

function Badge({ children, tone = 'blue' }) {
  const tones = {
    blue: 'bg-sky-50 text-sky-700 ring-sky-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    gray: 'bg-slate-100 text-slate-700 ring-slate-200'
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>;
}

function Panel({ title, icon: Icon, action, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="grid size-9 place-items-center rounded-md bg-slate-900 text-white">
              <Icon size={18} />
            </span>
          )}
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatCard({ metric, onClick }) {
  const Icon = metric.icon;
  return (
    <button onClick={onClick} className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-md bg-cyan-50 text-cyan-700">
          <Icon size={19} />
        </span>
        <Badge tone={metric.tone || 'green'}>{metric.trend}</Badge>
      </div>
      <p className="mt-5 text-3xl font-semibold text-slate-950">{metric.value}</p>
      <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
    </button>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRole, setLoginRole] = useState('Patient');
  const [loginForm, setLoginForm] = useState({ email: 'patient@careflow.app', password: 'careflow123' });
  const [role, setRole] = useState('Patient');
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [specialty, setSpecialty] = useState('Cardiology');
  const [doctors, setDoctors] = useState(initialDoctors);
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [reminders, setReminders] = useState(initialReminders);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctors[0].id);
  const [selectedSlot, setSelectedSlot] = useState(slots[1]);
  const [symptoms, setSymptoms] = useState('Chest tightness after climbing stairs, mild dizziness, pulse feels faster than usual since yesterday.');
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [notice, setNotice] = useState('CareFlow workspace is ready.');
  const [auditTrail, setAuditTrail] = useState(['Booking confirmation email delivered', 'Google Calendar event created', '24-hour reminder scheduled']);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) || doctors[0];
  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase())),
    [doctors, specialty]
  );

  const aiSummary = useMemo(() => {
    const urgentSignals = /chest|breath|severe|faint|bleeding/i.test(symptoms);
    return {
      urgency: urgentSignals ? 'Medium' : 'Low',
      complaint: urgentSignals ? 'Exertional chest tightness with dizziness' : 'Non-urgent symptom review',
      questions: [
        'When did the symptoms start and what triggers them?',
        'Are there warning signs such as breathlessness, fainting, or severe pain?',
        'What medications, allergies, or previous conditions should be considered?'
      ]
    };
  }, [symptoms]);

  const metrics = [
    { label: 'Appointments today', value: appointments.length + 40, trend: '+12%', icon: CalendarClock },
    { label: 'AI summaries stored', value: appointments.filter((item) => item.summaryReady).length + 128, trend: 'live', icon: Sparkles },
    { label: 'Email retry queue', value: appointments.filter((item) => item.email !== 'Delivered').length, trend: 'actionable', icon: Mail, tone: 'amber' },
    { label: 'Calendar sync health', value: '96%', trend: 'connected', icon: CheckCircle2 }
  ];
  const loginTheme = portalTheme[loginRole];
  const activeTheme = portalTheme[role];

  function pushNotice(message) {
    setNotice(message);
    setAuditTrail((items) => [message, ...items].slice(0, 5));
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      pushNotice('Email and password are required.');
      return;
    }
    setRole(loginRole);
    setActivePage('overview');
    setSidebarOpen(true);
    setIsAuthenticated(true);
    pushNotice(`${loginRole} login successful.`);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setActivePage('overview');
    setSidebarOpen(false);
    pushNotice('You have logged out.');
  }

  function switchRole(nextRole) {
    setRole(nextRole);
    setLoginRole(nextRole);
    setActivePage('overview');
    setSidebarOpen(true);
    pushNotice(`${nextRole} portal opened.`);
  }

  function handleDoctorSelect(doctor) {
    setSelectedDoctorId(doctor.id);
    setSpecialty(doctor.specialty);
    pushNotice(`${doctor.name} selected for ${doctor.specialty}.`);
  }

  function handleConfirmAppointment() {
    if (!symptoms.trim()) {
      pushNotice('Please enter symptoms before confirming the appointment.');
      return;
    }
    const activeForDoctor = appointments.filter((item) => item.doctorId === selectedDoctor.id && item.status !== 'Cancelled');
    const finalSlot = activeForDoctor.some((item) => item.slot === selectedSlot)
      ? slots.find((slot) => !activeForDoctor.some((item) => item.slot === slot)) || selectedSlot
      : selectedSlot;
    const appointment = {
      id: `APT-${1047 + appointments.length}`,
      patient: 'Walk-in Patient',
      doctorId: selectedDoctor.id,
      doctor: selectedDoctor.name,
      time: `23 Aug, ${finalSlot}`,
      slot: finalSlot,
      status: 'Confirmed',
      urgency: aiSummary.urgency,
      complaint: aiSummary.complaint,
      calendar: 'Synced',
      email: 'Delivered',
      summaryReady: false
    };
    setAppointments((items) => [appointment, ...items]);
    setPatients((items) => [{ name: 'Walk-in Patient', age: 29, lastVisit: 'Today', condition: aiSummary.complaint, risk: aiSummary.urgency }, ...items]);
    setSelectedSlot(finalSlot);
    setActivePage('appointments');
    pushNotice(`Appointment ${appointment.id} confirmed with ${selectedDoctor.name} at ${finalSlot}.`);
  }

  function handleGenerateSummary(id) {
    setAppointments((items) =>
      items.map((item) => (item.id === id ? { ...item, summaryReady: true, status: 'Completed', email: 'Delivered' } : item))
    );
    setReminders((items) => [{ medicine: 'Doctor follow-up plan', when: 'Tomorrow 09:00 AM', channel: 'Email + in-app', active: true }, ...items]);
    pushNotice(`Patient-friendly summary generated for ${id}.`);
  }

  function handleDoctorFieldChange(id, field, value) {
    setDoctors((items) => items.map((doctor) => (doctor.id === id ? { ...doctor, [field]: value } : doctor)));
  }

  function handleMarkLeave(id) {
    setDoctors((items) =>
      items.map((doctor) => {
        if (doctor.id !== id) return doctor;
        const nextLeave = doctor.leave.includes('2026-08-30') ? doctor.leave : [...doctor.leave, '2026-08-30'];
        return { ...doctor, leave: nextLeave };
      })
    );
    setAppointments((items) => items.map((item) => (item.doctorId === id ? { ...item, status: 'Reschedule required', email: 'Queued' } : item)));
    pushNotice('Leave applied. Affected patients were moved to the notification queue.');
  }

  function handleRetryIntegrations() {
    setAppointments((items) => items.map((item) => ({ ...item, calendar: 'Synced', email: 'Delivered' })));
    pushNotice('Email and calendar retry queue processed successfully.');
  }

  function cancelAppointment(id) {
    setAppointments((items) => items.map((item) => (item.id === id ? { ...item, status: 'Cancelled', email: 'Queued', calendar: 'Delete queued' } : item)));
    pushNotice(`${id} cancelled and notifications queued.`);
  }

  function rescheduleAppointment(id) {
    setAppointments((items) => items.map((item) => (item.id === id ? { ...item, slot: '7:00 PM', time: '23 Aug, 7:00 PM', status: 'Rescheduled', calendar: 'Update queued' } : item)));
    pushNotice(`${id} rescheduled to 7:00 PM.`);
  }

  function toggleReminder(medicine) {
    setReminders((items) => items.map((item) => (item.medicine === medicine ? { ...item, active: !item.active } : item)));
    pushNotice('Medication reminder status updated.');
  }

  function addPatient() {
    const next = { name: `Patient ${patients.length + 1}`, age: 34, lastVisit: 'New', condition: 'New registration pending triage', risk: 'Low' };
    setPatients((items) => [next, ...items]);
    pushNotice(`${next.name} added to patient registry.`);
  }

  function addDoctor() {
    const doctor = {
      id: `dr-${doctors.length + 1}`,
      name: `Dr. New Specialist ${doctors.length + 1}`,
      specialty: 'Neurology',
      rating: 4.7,
      slotDuration: 30,
      next: 'Tomorrow 2:00 PM',
      hours: '11:00 - 19:00',
      leave: [],
      focus: 'Headache, migraine, nerve pain'
    };
    setDoctors((items) => [doctor, ...items]);
    pushNotice(`${doctor.name} added.`);
  }

  if (!isAuthenticated) {
    return (
      <main
        className="min-h-screen bg-cover bg-center text-slate-950"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.64), rgba(15, 23, 42, 0.28)), url('${loginTheme.loginImage}')`
        }}
      >
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_420px]">
          <section className="text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg bg-white text-cyan-700">
                <HeartPulse size={26} />
              </span>
              <div>
                <p className="text-2xl font-bold">CareFlow</p>
                <p className="text-sm text-cyan-100">Healthcare appointment and follow-up manager</p>
              </div>
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-bold leading-tight">{loginTheme.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100">
              {loginTheme.subtitle}
            </p>
          </section>

          <form onSubmit={handleLogin} className="rounded-lg border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Sign in</h2>
                <p className="mt-1 text-sm text-slate-500">Choose your portal and continue.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {roles.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setLoginRole(item);
                    setLoginForm({ email: `${item.toLowerCase()}@careflow.app`, password: 'careflow123' });
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${loginRole === item ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                value={loginForm.email}
                onChange={(event) => setLoginForm((form) => ({ ...form, email: event.target.value }))}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((form) => ({ ...form, password: event.target.value }))}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800">
              <ShieldCheck size={18} />
              Login to {loginRole} portal
            </button>
            <div className="mt-4 rounded-md bg-cyan-50 p-3 text-sm text-cyan-900">{notice}</div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {sidebarOpen && <button aria-label="Close sidebar overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-200 bg-white text-slate-950 shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActivePage('overview');
                  pushNotice('Patient Care Portal home opened.');
                }}
                className="flex items-center gap-3 text-left"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-cyan-300 text-slate-950">
                  <HeartPulse size={24} />
                </span>
                <span>
                  <span className="block text-lg font-bold">CareFlow</span>
                  <span className="block text-xs text-slate-300">Patient Care Portal</span>
                </span>
              </button>
              <button
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="grid size-9 place-items-center rounded-md border border-white/15 text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/10 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100">{role} access</p>
              <p className="mt-1 text-sm text-slate-200">{activeTheme.subtitle}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navByRole[role].map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => {
                  setActivePage(id);
                  setSidebarOpen(false);
                  pushNotice(`${label} opened.`);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                  activePage === id
                    ? 'bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-md ${activePage === id ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon size={18} />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Signed in as</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{loginForm.email}</p>
            </div>
            <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-80' : 'lg:pl-0'}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xl font-bold tracking-tight">{role === 'Patient' ? 'Patient Care Portal' : `${role} Dashboard`}</p>
                <p className="text-sm text-slate-500">{notice}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {roles.map((item) => (
                <button
                  key={item}
                  onClick={() => switchRole(item)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition ${role === item ? 'bg-slate-950 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-5 py-2 lg:hidden">
            {navByRole[role].map(([id, label]) => (
              <button key={id} onClick={() => setActivePage(id)} className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${activePage === id ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </header>

        <section
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              `linear-gradient(90deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.54), rgba(15, 23, 42, 0.18)), url('${activeTheme.dashboardImage}')`
          }}
        >
          <div className="px-5 py-7 text-white">
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">Secure login</Badge>
              <Badge>AI summaries</Badge>
              <Badge tone="amber">Email retries</Badge>
              <Badge tone="gray">Calendar sync</Badge>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight">{activeTheme.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-100">{activeTheme.subtitle}</p>
          </div>
        </section>

        <div className="grid gap-5 px-5 py-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <StatCard key={metric.label} metric={metric} onClick={() => pushNotice(`${metric.label} dashboard opened.`)} />
          ))}
        </div>

        <div className="grid gap-5 px-5 pb-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            {(activePage === 'overview' || activePage === 'book') && role === 'Patient' && (
              <Panel title="Patient Booking" icon={Search} action={<Badge tone={aiSummary.urgency === 'Medium' ? 'amber' : 'green'}>{aiSummary.urgency} urgency</Badge>}>
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Search specialization</span>
                      <input value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
                    </label>
                    <div className="space-y-3">
                      {(filteredDoctors.length ? filteredDoctors : doctors).map((doctor) => (
                        <button key={doctor.id} onClick={() => handleDoctorSelect(doctor)} className={`w-full rounded-lg border p-4 text-left transition ${selectedDoctor.id === doctor.id ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-950">{doctor.name}</p>
                              <p className="text-sm text-slate-500">{doctor.specialty}</p>
                            </div>
                            <Badge>{doctor.rating}</Badge>
                          </div>
                          <p className="mt-3 text-sm text-slate-600">{doctor.focus}</p>
                          <p className="mt-3 text-xs font-semibold uppercase text-slate-500">Next slot: {doctor.next}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold">{selectedDoctor.name}</p>
                        <p className="text-sm text-slate-500">{selectedDoctor.hours}, {selectedDoctor.slotDuration} min slots</p>
                      </div>
                      <Badge tone="green">Slot protected</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button key={slot} onClick={() => { setSelectedSlot(slot); pushNotice(`${slot} selected for ${selectedDoctor.name}.`); }} className={`rounded-md border px-3 py-2 text-sm font-semibold ${selectedSlot === slot ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    <label className="mt-4 block">
                      <span className="text-sm font-semibold text-slate-700">Symptoms before confirmation</span>
                      <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
                    </label>
                    <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-4">
                      <div className="flex items-center gap-2 font-semibold text-cyan-950">
                        <Sparkles size={18} />
                        AI pre-visit summary
                      </div>
                      <p className="mt-2 text-sm text-cyan-900">Chief complaint: {aiSummary.complaint}</p>
                      <ul className="mt-3 space-y-2 text-sm text-cyan-900">
                        {aiSummary.questions.map((question) => (
                          <li key={question} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 shrink-0" size={15} />
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={handleConfirmAppointment} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800">
                      <CalendarClock size={18} />
                      Confirm appointment
                    </button>
                  </div>
                </div>
              </Panel>
            )}

            {(activePage === 'overview' || activePage === 'clinical') && role === 'Doctor' && (
              <Panel title="Clinical Queue" icon={Stethoscope}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {appointments.map((appointment) => (
                    <article key={appointment.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{appointment.patient}</p>
                          <p className="text-sm text-slate-500">{appointment.time} - {appointment.doctor}</p>
                        </div>
                        <Badge tone={appointment.urgency === 'High' ? 'red' : appointment.urgency === 'Medium' ? 'amber' : 'green'}>{appointment.urgency}</Badge>
                      </div>
                      <p className="mt-4 text-sm text-slate-700">{appointment.complaint}</p>
                      <div className="mt-4 grid gap-2 text-sm">
                        <textarea rows={3} defaultValue="Clinical notes: vitals stable, ECG advised, hydration and observation recommended." className="resize-none rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input defaultValue="Prescription: Pantoprazole 40 mg OD, follow-up in 3 days" className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button onClick={() => handleGenerateSummary(appointment.id)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-800">
                          <FileText size={16} />
                          {appointment.summaryReady ? 'Regenerate summary' : 'Generate patient summary'}
                        </button>
                        <button onClick={() => cancelAppointment(appointment.id)} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Cancel</button>
                        <Badge tone={appointment.summaryReady ? 'green' : 'gray'}>{appointment.summaryReady ? 'Summary ready' : appointment.status}</Badge>
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {(activePage === 'overview' || activePage === 'doctors') && role === 'Admin' && (
              <Panel title="Doctor Management" icon={UserCog} action={<button onClick={addDoctor} className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white">Add doctor</button>}>
                <div className="space-y-3">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{doctor.name}</p>
                          <p className="text-sm text-slate-500">{doctor.specialty} - {doctor.hours}</p>
                        </div>
                        <Badge tone={doctor.leave.length ? 'amber' : 'green'}>{doctor.leave.length ? 'Leave set' : 'Available'}</Badge>
                      </div>
                      {editingDoctorId === doctor.id && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <input value={doctor.specialty} onChange={(event) => handleDoctorFieldChange(doctor.id, 'specialty', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
                          <input value={doctor.hours} onChange={(event) => handleDoctorFieldChange(doctor.id, 'hours', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => { setEditingDoctorId(editingDoctorId === doctor.id ? null : doctor.id); pushNotice(editingDoctorId === doctor.id ? 'Doctor profile saved.' : `Editing ${doctor.name}.`); }} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-cyan-400">
                          {editingDoctorId === doctor.id ? 'Save profile' : 'Edit profile'}
                        </button>
                        <button onClick={() => handleMarkLeave(doctor.id)} className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100">Mark leave</button>
                        <button onClick={() => pushNotice(`Slots rebuilt for ${doctor.name}.`)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-cyan-400">Rebuild slots</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {(activePage === 'overview' || activePage === 'reliability') && role === 'Admin' && (
              <Panel title="Reliability Queue" icon={ShieldCheck} action={<button onClick={handleRetryIntegrations} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-cyan-400"><RefreshCw size={15} />Retry</button>}>
                <div className="space-y-3">
                  {[
                    ['Double-booking prevention', 'Unique doctor and slot index with transactional hold', CheckCircle2, 'green'],
                    ['Leave conflict handling', 'Affected bookings notify patient and doctor', Bell, 'amber'],
                    ['AI failure fallback', 'Stores raw symptoms and marks summary pending', Sparkles, 'blue'],
                    ['Calendar partial failure', 'Appointment remains confirmed, sync retries', Clock, 'amber']
                  ].map(([title, body, Icon, tone]) => (
                    <button key={title} onClick={() => pushNotice(`${title} check opened.`)} className="flex w-full gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:border-cyan-300 hover:bg-white">
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-slate-800"><Icon size={17} /></span>
                      <span>
                        <span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{title}</span><Badge tone={tone}>{tone === 'green' ? 'healthy' : 'monitored'}</Badge></span>
                        <span className="mt-1 block text-sm text-slate-600">{body}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          <div className="space-y-5">
            {(activePage === 'overview' || activePage === 'appointments') && role === 'Patient' && (
              <Panel title="My Appointments" icon={CalendarClock}>
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{appointment.doctor}</p>
                          <p className="text-sm text-slate-500">{appointment.time}</p>
                        </div>
                        <Badge tone={appointment.status === 'Confirmed' ? 'green' : appointment.status === 'Completed' ? 'blue' : 'amber'}>{appointment.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{appointment.complaint}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => rescheduleAppointment(appointment.id)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-cyan-400">Reschedule</button>
                        <button onClick={() => cancelAppointment(appointment.id)} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {(activePage === 'patients' || (activePage === 'overview' && role !== 'Patient')) && (
              <Panel title="Patient Records" icon={Users} action={role === 'Admin' ? <button onClick={addPatient} className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white">Add patient</button> : null}>
                <div className="space-y-3">
                  {patients.map((patient) => (
                    <button key={`${patient.name}-${patient.lastVisit}`} onClick={() => pushNotice(`${patient.name} record opened.`)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-cyan-300">
                      <span>
                        <span className="block font-semibold">{patient.name}</span>
                        <span className="text-sm text-slate-500">Age {patient.age} - {patient.condition}</span>
                      </span>
                      <Badge tone={patient.risk === 'High' ? 'red' : patient.risk === 'Medium' ? 'amber' : 'green'}>{patient.risk}</Badge>
                    </button>
                  ))}
                </div>
              </Panel>
            )}

            {(activePage === 'medication' || (activePage === 'overview' && role === 'Patient')) && (
              <Panel title="Medication & Notifications" icon={Pill}>
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <button key={reminder.medicine} onClick={() => toggleReminder(reminder.medicine)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-cyan-300">
                      <span>
                        <span className="block font-semibold">{reminder.medicine}</span>
                        <span className="text-sm text-slate-500">{reminder.when}</span>
                      </span>
                      <Badge tone={reminder.active ? 'blue' : 'gray'}>{reminder.active ? reminder.channel : 'Paused'}</Badge>
                    </button>
                  ))}
                </div>
              </Panel>
            )}

            {(activePage === 'timeline' || activePage === 'settings') && (
              <Panel title={activePage === 'settings' ? 'Portal Settings' : 'Integration Timeline'} icon={activePage === 'settings' ? Settings : Activity}>
                <div className="space-y-4">
                  {[
                    [CheckCircle2, 'Booking confirmation email delivered', 'SendGrid message id SG-8821'],
                    [Video, 'Google Calendar event created', 'Patient and doctor calendars linked'],
                    [XCircle, 'Cancellation workflow ready', 'Deletes calendar event and queues email'],
                    [Bell, '24-hour reminder scheduled', 'Spring Scheduler scans due jobs']
                  ].map(([Icon, title, detail]) => (
                    <button key={title} onClick={() => pushNotice(title)} className="flex w-full gap-3 text-left">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700"><Icon size={16} /></span>
                      <span>
                        <span className="block text-sm font-semibold">{title}</span>
                        <span className="text-sm text-slate-500">{detail}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
