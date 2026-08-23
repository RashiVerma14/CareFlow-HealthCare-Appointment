import { RefreshCw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApiError, userApi } from '../api/services.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  phone: '',
  bio: '',
  profileImage: '',
  college: '',
  branch: '',
  cgpa: '',
  graduationYear: '',
  skills: '',
  github: '',
  linkedin: '',
  leetcode: '',
  resumeUrl: ''
};

const profileToForm = (profile = {}) => ({
  phone: profile.phone || '',
  bio: profile.bio || '',
  profileImage: profile.profileImage || '',
  college: profile.college || '',
  branch: profile.branch || '',
  cgpa: profile.cgpa ?? '',
  graduationYear: profile.graduationYear ?? '',
  skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
  github: profile.github || '',
  linkedin: profile.linkedin || '',
  leetcode: profile.leetcode || '',
  resumeUrl: profile.resumeUrl || ''
});

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const { data } = await userApi.profile();
      setForm(profileToForm(data));
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to load profile.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage({ type: '', text: '' });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const payload = {
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      profileImage: form.profileImage.trim(),
      college: form.college.trim(),
      branch: form.branch.trim(),
      cgpa: form.cgpa === '' ? null : Number(form.cgpa),
      graduationYear: form.graduationYear === '' ? null : Number(form.graduationYear),
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
      leetcode: form.leetcode.trim(),
      resumeUrl: form.resumeUrl.trim()
    };

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await userApi.updateProfile(payload);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      await loadProfile();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to update profile.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            {user?.firstName || user?.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user?.email || 'Student profile'}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={loadProfile} disabled={loading}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate-500">Loading profile...</p>
      ) : (
        <form className="mt-5 grid max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-3" onSubmit={saveProfile}>
          <Input label="Phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          <Input label="College" value={form.college} onChange={(e) => updateField('college', e.target.value)} />
          <Input label="Branch" value={form.branch} onChange={(e) => updateField('branch', e.target.value)} />
          <Input label="CGPA" type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={(e) => updateField('cgpa', e.target.value)} />
          <Input label="Graduation Year" type="number" value={form.graduationYear} onChange={(e) => updateField('graduationYear', e.target.value)} />
          <Input label="Profile Image URL" type="url" value={form.profileImage} onChange={(e) => updateField('profileImage', e.target.value)} />
          <Input label="GitHub" type="url" value={form.github} onChange={(e) => updateField('github', e.target.value)} />
          <Input label="LinkedIn" type="url" value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} />
          <Input label="LeetCode" type="url" value={form.leetcode} onChange={(e) => updateField('leetcode', e.target.value)} />
          <Input label="Resume URL" type="url" value={form.resumeUrl} onChange={(e) => updateField('resumeUrl', e.target.value)} />
          <Input label="Skills" value={form.skills} onChange={(e) => updateField('skills', e.target.value)} />
          <label className="block sm:col-span-2 xl:col-span-3">
            <span className="mb-1 block text-sm font-medium text-slate-700">Bio</span>
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
            />
          </label>

          <div className="space-y-3 sm:col-span-2 xl:col-span-3">
            <Message type={message.type}>{message.text}</Message>
            <Button disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
