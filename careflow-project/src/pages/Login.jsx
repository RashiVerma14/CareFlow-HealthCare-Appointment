import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { isEmail, passwordMessage } from '../utils/validation.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isEmail(form.email)) nextErrors.email = 'Enter a valid email';
    const passwordError = passwordMessage(form.password);
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validate()) return;

    try {
      setLoading(true);
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft">
      <PublicNavbar />
      <main className="mx-auto flex max-w-6xl justify-center px-4 py-12">
        <form className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-ink">Login</h1>
            <p className="mt-1 text-sm text-slate-500">Continue your placement preparation.</p>
          </div>

          <div className="space-y-4">
            <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => updateField('email', e.target.value)} />
            <Input
              label="Password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
            <Message type="error">{message}</Message>
            <Button className="w-full" disabled={loading}>
              <LogIn size={16} />
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-600">
            New student?{' '}
            <Link className="font-semibold text-primary" to="/register">
              Create account
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
