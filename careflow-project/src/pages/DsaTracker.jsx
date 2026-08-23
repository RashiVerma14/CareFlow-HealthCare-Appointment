import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

const emptyTopic = { name: '', difficulty: 'Easy', total: '', solved: '' };

export default function DsaTracker() {
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(emptyTopic);
  const [filter, setFilter] = useState('All');

  const filteredTopics = filter === 'All' ? topics : topics.filter((topic) => topic.difficulty === filter);
  const totalSolved = useMemo(() => topics.reduce((sum, topic) => sum + topic.solved, 0), [topics]);
  const totalProblems = useMemo(() => topics.reduce((sum, topic) => sum + topic.total, 0), [topics]);

  const addTopic = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.total) return;
    setTopics((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        difficulty: form.difficulty,
        total: Number(form.total),
        solved: Math.min(Number(form.solved || 0), Number(form.total))
      }
    ]);
    setForm(emptyTopic);
  };

  const markSolved = (id) => {
    setTopics((current) =>
      current.map((topic) => (topic.id === id && topic.solved < topic.total ? { ...topic, solved: topic.solved + 1 } : topic))
    );
  };

  const removeTopic = (id) => {
    setTopics((current) => current.filter((topic) => topic.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">DSA Tracker</h2>
            <p className="text-sm text-slate-500">Track solved problems topic-wise.</p>
          </div>
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_160px_140px_140px_auto]" onSubmit={addTopic}>
          <Input label="Topic" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Difficulty</span>
            <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
          <Input label="Total" type="number" min="1" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
          <Input label="Solved" type="number" min="0" value={form.solved} onChange={(e) => setForm({ ...form, solved: e.target.value })} />
          <Button className="self-end">
            <Plus size={16} />
            Add
          </Button>
        </form>

        <div className="mt-5 rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-700">Overall Progress</p>
          <p className="text-2xl font-bold text-primary">{totalSolved}/{totalProblems} solved</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTopics.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No DSA topics added.</p>
        ) : (
          filteredTopics.map((topic) => {
            const percentage = Math.round((topic.solved * 100) / topic.total);
            return (
              <div key={topic.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-ink">{topic.name}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{topic.difficulty}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{topic.solved} of {topic.total} problems solved</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => markSolved(topic.id)}>Mark Solved</Button>
                  <button className="rounded-md p-2 text-red-600 hover:bg-red-50" onClick={() => removeTopic(topic.id)} aria-label="Delete topic">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
