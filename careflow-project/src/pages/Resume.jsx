import { ExternalLink, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { asArray, getApiError, getId, resumeApi } from '../api/services.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';

const emptyForm = { resumeTitle: '', resumeUrl: '', fileType: 'PDF', fileSize: '' };

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const normalizeResume = (resume) => ({
  resumeTitle: resume.resumeTitle || '',
  resumeUrl: resume.resumeUrl || '',
  fileType: resume.fileType || '',
  fileSize: resume.fileSize ?? ''
});

export default function Resume() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const { data } = await resumeApi.list();
      const items = asArray(data);
      setResumes(items);
      setSelectedResume((current) => current || items[0] || null);
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to load resumes.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const submitResume = async (event) => {
    event.preventDefault();

    if (!form.resumeTitle.trim() || !form.resumeUrl.trim() || !form.fileType.trim() || form.fileSize === '') {
      setMessage({ type: 'error', text: 'Resume title, URL, file type, and file size are required.' });
      return;
    }

    const payload = {
      resumeTitle: form.resumeTitle.trim(),
      resumeUrl: form.resumeUrl.trim(),
      fileType: form.fileType.trim(),
      fileSize: Number(form.fileSize)
    };

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      if (editingId) {
        await resumeApi.update(editingId, payload);
      } else {
        await resumeApi.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setMessage({ type: 'success', text: editingId ? 'Resume updated successfully.' : 'Resume added successfully.' });
      await loadResumes();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to save resume.') });
    } finally {
      setSaving(false);
    }
  };

  const openResume = async (id) => {
    try {
      setMessage({ type: '', text: '' });
      const { data } = await resumeApi.get(id);
      setSelectedResume(data);
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to open resume details.') });
    }
  };

  const editResume = (resume) => {
    setEditingId(getId(resume));
    setForm(normalizeResume(resume));
    setSelectedResume(resume);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteResume = async (id) => {
    try {
      setMessage({ type: '', text: '' });
      await resumeApi.remove(id);
      setSelectedResume(null);
      setMessage({ type: 'success', text: 'Resume deleted successfully.' });
      await loadResumes();
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to delete resume.') });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">Resume Module</h2>
            <p className="mt-1 text-sm text-slate-500">Create, view, update, and delete resume records through backend APIs.</p>
          </div>
          <Button variant="outline" onClick={loadResumes} disabled={loading}>
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr_140px_140px_auto]" onSubmit={submitResume}>
          <Input label="Resume Title" value={form.resumeTitle} onChange={(e) => setForm({ ...form, resumeTitle: e.target.value })} />
          <Input label="Resume URL" type="url" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
          <Input label="File Type" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} />
          <Input label="File Size" type="number" min="1" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} />
          <div className="flex gap-2 self-end">
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

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="font-bold text-ink">Saved Resumes</h3>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading resumes...</p>
          ) : resumes.length === 0 ? (
            <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-500">No resumes found.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {resumes.map((resume) => {
                const id = getId(resume);
                return (
                  <div key={id} className="rounded-md border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button className="text-left" onClick={() => openResume(id)}>
                        <p className="font-semibold text-ink">{resume.resumeTitle || 'Untitled resume'}</p>
                        <p className="text-xs text-slate-500">Uploaded: {formatDate(resume.uploadedAt)}</p>
                      </button>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => editResume(resume)}>
                          Edit
                        </Button>
                        <button className="rounded-md p-2 text-red-600 hover:bg-red-50" onClick={() => deleteResume(id)} aria-label="Delete resume">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="font-bold text-ink">Resume Details</h3>
          {!selectedResume ? (
            <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-500">Select a resume to view backend details.</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><strong className="text-slate-700">Title:</strong> {selectedResume.resumeTitle || 'Not available'}</p>
              <p><strong className="text-slate-700">File Type:</strong> {selectedResume.fileType || 'Not available'}</p>
              <p><strong className="text-slate-700">File Size:</strong> {selectedResume.fileSize ?? 'Not available'}</p>
              <p><strong className="text-slate-700">Updated:</strong> {formatDate(selectedResume.updatedAt)}</p>
              {selectedResume.resumeUrl ? (
                <a className="inline-flex items-center gap-2 font-semibold text-primary" href={selectedResume.resumeUrl} target="_blank" rel="noreferrer">
                  Open Resume
                  <ExternalLink size={16} />
                </a>
              ) : (
                <p>No resume URL returned.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
