import { Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { asArray, companyApi, getApiError, getId } from '../api/services.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';

const emptyForm = {
  companyName: '',
  role: '',
  packageOffered: '',
  location: '',
  minimumCgpa: '',
  applicationLink: '',
  applicationDeadline: '',
  description: ''
};

const toPayload = (form, includeCompanyName = true) => {
  const payload = {
    role: form.role.trim(),
    packageOffered: form.packageOffered.trim(),
    location: form.location.trim(),
    minimumCgpa: Number(form.minimumCgpa),
    applicationLink: form.applicationLink.trim(),
    applicationDeadline: form.applicationDeadline,
    description: form.description.trim()
  };

  if (includeCompanyName) payload.companyName = form.companyName.trim();
  return payload;
};

export default function CompanyTracker() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ location: '', role: '', cgpa: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const { data } = await companyApi.list();
      setCompanies(asArray(data));
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to load companies.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const visibleCompanies = useMemo(() => companies, [companies]);

  const submitCompany = async (event) => {
    event.preventDefault();
    const requiredFields = ['role', 'packageOffered', 'location', 'minimumCgpa', 'applicationLink', 'applicationDeadline'];
    const isMissing = requiredFields.some((field) => !String(form[field]).trim()) || (!editingId && !form.companyName.trim());

    if (isMissing) {
      setMessage({ type: 'error', text: 'Fill all required company fields before saving.' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      if (editingId) {
        await companyApi.update(editingId, toPayload(form, false));
      } else {
        await companyApi.create(toPayload(form));
      }
      setForm(emptyForm);
      setEditingId(null);
      setMessage({ type: 'success', text: editingId ? 'Company updated successfully.' : 'Company added successfully.' });
      await loadCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to save company.') });
    } finally {
      setSaving(false);
    }
  };

  const editCompany = (company) => {
    setEditingId(getId(company));
    setForm({
      companyName: company.companyName || '',
      role: company.role || '',
      packageOffered: company.packageOffered || '',
      location: company.location || '',
      minimumCgpa: company.minimumCgpa ?? '',
      applicationLink: company.applicationLink || '',
      applicationDeadline: company.applicationDeadline || '',
      description: company.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteCompany = async (id) => {
    try {
      setMessage({ type: '', text: '' });
      await companyApi.remove(id);
      setMessage({ type: 'success', text: 'Company deleted successfully.' });
      await loadCompanies();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to delete company.') });
    }
  };

  const runFilter = async (type) => {
    const value = filters[type].trim();
    if (!value) {
      setMessage({ type: 'error', text: `Enter ${type} to filter companies.` });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const request = type === 'location' ? companyApi.byLocation(value) : type === 'role' ? companyApi.byRole(value) : companyApi.byEligibleCgpa(value);
      const { data } = await request;
      setCompanies(asArray(data));
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to filter companies.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">Company Module</h2>
            <p className="mt-1 text-sm text-slate-500">Create, update, filter, and delete companies from backend APIs.</p>
          </div>
          <Button variant="outline" onClick={loadCompanies} disabled={loading}>
            <RefreshCw size={16} />
            All Companies
          </Button>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={submitCompany}>
          <Input label="Company Name" value={form.companyName} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input label="Package Offered" value={form.packageOffered} onChange={(e) => setForm({ ...form, packageOffered: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Minimum CGPA" type="number" step="0.01" value={form.minimumCgpa} onChange={(e) => setForm({ ...form, minimumCgpa: e.target.value })} />
          <Input label="Application Link" type="url" value={form.applicationLink} onChange={(e) => setForm({ ...form, applicationLink: e.target.value })} />
          <Input label="Application Deadline" type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 self-end md:col-span-2 xl:col-span-4">
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
            <Button disabled={saving}>
              <Plus size={16} />
              {editingId ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <Message type={message.type}>{message.text}</Message>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="font-bold text-ink">Backend Filters</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            ['location', 'Filter by location'],
            ['role', 'Filter by role'],
            ['cgpa', 'Eligible by CGPA']
          ].map(([key, label]) => (
            <div key={key} className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder={label}
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              />
              <Button type="button" variant="outline" onClick={() => runFilter(key)}>
                <Search size={16} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-slate-500">Loading companies...</p>
          ) : visibleCompanies.length === 0 ? (
            <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">No companies found.</p>
          ) : (
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Package</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">CGPA</th>
                  <th className="px-3 py-3">Deadline</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company) => {
                  const id = getId(company);
                  return (
                    <tr key={id} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-medium text-ink">{company.companyName || 'Untitled'}</td>
                      <td className="px-3 py-3 text-slate-600">{company.role || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{company.packageOffered || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{company.location || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{company.minimumCgpa ?? 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{company.applicationDeadline || 'Not available'}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={() => editCompany(company)}>Edit</Button>
                          <button className="rounded-md p-2 text-red-600 hover:bg-red-50" onClick={() => deleteCompany(id)} aria-label="Delete company">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
