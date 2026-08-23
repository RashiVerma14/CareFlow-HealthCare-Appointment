import { Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { asArray, getApiError, getId, placementApi } from '../api/services.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';

const statuses = ['APPLIED', 'OA', 'INTERVIEW', 'REJECTED', 'SELECTED'];
const emptyForm = {
  companyName: '',
  role: '',
  packageOffered: '',
  location: '',
  applicationDate: '',
  status: 'APPLIED',
  notes: '',
  nextInterviewDate: ''
};

const createPayload = (form) => ({
  companyName: form.companyName.trim(),
  role: form.role.trim(),
  packageOffered: form.packageOffered.trim(),
  location: form.location.trim(),
  applicationDate: form.applicationDate,
  notes: form.notes.trim(),
  nextInterviewDate: form.nextInterviewDate || null
});

const updatePayload = (form) => ({
  status: form.status,
  notes: form.notes.trim(),
  nextInterviewDate: form.nextInterviewDate || null
});

export default function PlacementTracker() {
  const [placements, setPlacements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPlacements = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const { data } = await placementApi.list();
      setPlacements(asArray(data));
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to load placements.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const submitPlacement = async (event) => {
    event.preventDefault();
    const missingCreateFields = !editingId && (!form.companyName.trim() || !form.role.trim());
    if (missingCreateFields || !form.status.trim()) {
      setMessage({ type: 'error', text: editingId ? 'Status is required.' : 'Company name and role are required.' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      if (editingId) {
        await placementApi.update(editingId, updatePayload(form));
      } else {
        await placementApi.create(createPayload(form));
      }
      setForm(emptyForm);
      setEditingId(null);
      setMessage({ type: 'success', text: editingId ? 'Placement updated successfully.' : 'Placement added successfully.' });
      await loadPlacements();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to save placement.') });
    } finally {
      setSaving(false);
    }
  };

  const editPlacement = (placement) => {
    setEditingId(getId(placement));
    setForm({
      companyName: placement.companyName || '',
      role: placement.role || '',
      packageOffered: placement.packageOffered || '',
      location: placement.location || '',
      applicationDate: placement.applicationDate || '',
      status: placement.status || 'APPLIED',
      notes: placement.notes || '',
      nextInterviewDate: placement.nextInterviewDate || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deletePlacement = async (id) => {
    try {
      setMessage({ type: '', text: '' });
      await placementApi.remove(id);
      setMessage({ type: 'success', text: 'Placement deleted successfully.' });
      await loadPlacements();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to delete placement.') });
    }
  };

  const filterByStatus = async () => {
    if (!statusFilter) {
      await loadPlacements();
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const { data } = await placementApi.byStatus(statusFilter);
      setPlacements(asArray(data));
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to filter placements.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">Placement Tracker</h2>
            <p className="mt-1 text-sm text-slate-500">Track application status through backend placement APIs.</p>
          </div>
          <Button variant="outline" onClick={loadPlacements} disabled={loading}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={submitPlacement}>
          <Input label="Company Name" value={form.companyName} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <Input label="Role" value={form.role} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input label="Package Offered" value={form.packageOffered} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, packageOffered: e.target.value })} />
          <Input label="Location" value={form.location} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Application Date" type="date" value={form.applicationDate} disabled={Boolean(editingId)} onChange={(e) => setForm({ ...form, applicationDate: e.target.value })} />
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
            <select className="w-full rounded-md border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <Input label="Next Interview Date" type="date" value={form.nextInterviewDate} onChange={(e) => setForm({ ...form, nextInterviewDate: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2 self-end md:col-span-2 xl:col-span-4">
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
            <Button disabled={saving}>
              <Plus size={16} />
              {editingId ? 'Update Status' : 'Add'}
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <Message type={message.type}>{message.text}</Message>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Filter by Status</span>
            <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <Button type="button" variant="outline" onClick={filterByStatus}>
            <Search size={16} />
            Apply
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading placements...</p>
        ) : placements.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">No placements found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Package</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Applied</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Next Interview</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((placement) => {
                  const id = getId(placement);
                  return (
                    <tr key={id} className="border-t border-slate-100">
                      <td className="px-3 py-3 font-medium text-ink">{placement.companyName || 'Untitled'}</td>
                      <td className="px-3 py-3 text-slate-600">{placement.role || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{placement.packageOffered || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{placement.location || 'Not available'}</td>
                      <td className="px-3 py-3 text-slate-600">{placement.applicationDate || 'Not available'}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-primary">{placement.status || 'Not available'}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{placement.nextInterviewDate || 'Not available'}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" onClick={() => editPlacement(placement)}>Edit</Button>
                          <button className="rounded-md p-2 text-red-600 hover:bg-red-50" onClick={() => deletePlacement(id)} aria-label="Delete placement">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
