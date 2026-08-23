import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { isEmail, passwordMessage, required } from '../utils/validation.js';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!required(form.firstName)) nextErrors.firstName = 'First name is required';
    if (!required(form.lastName)) nextErrors.lastName = 'Last name is required';
    if (!isEmail(form.email)) nextErrors.email = 'Enter a valid email';
    const passwordError = passwordMessage(form.password);
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validate()) return;

    try {
      setLoading(true);
      await register(form);
      setMessage({ type: 'success', text: 'Registration successful. Please login now.' });
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft">
      <PublicNavbar />
      <main className="mx-auto flex max-w-6xl justify-center px-4 py-12">
        <form className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-ink">Create Student Account</h1>
            <p className="mt-1 text-sm text-slate-500">Register to start tracking your placement preparation.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" value={form.firstName} error={errors.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
            <Input label="Last Name" value={form.lastName} error={errors.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
            <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => updateField('email', e.target.value)} />
            <Input
              label="Password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </div>

          <div className="mt-4 space-y-4">
            <Message type={message.type}>{message.text}</Message>
            <Button className="w-full" disabled={loading}>
              <UserPlus size={16} />
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already registered?{' '}
            <Link className="font-semibold text-primary" to="/login">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
