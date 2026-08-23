import { ArrowRight, Brain, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { asArray, getApiError, interviewApi } from '../api/services.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Message from '../components/Message.jsx';

const isCompleted = (value) => String(value || '').toUpperCase() === 'COMPLETED';

const emptySettings = {
  role: '',
  difficulty: 'MEDIUM',
  experienceLevel: 'FRESHER',
  totalQuestions: 5
};

export default function Interview() {
  const [settings, setSettings] = useState(emptySettings);
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState('');
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startInterview = async () => {
    if (!settings.role.trim() || !settings.difficulty.trim() || !settings.experienceLevel.trim()) {
      setMessage({ type: 'error', text: 'Role, difficulty, and experience level are required.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      setReport(null);
      setFeedback('');
      setScore(null);
      setAnswer('');
      const payload = {
        role: settings.role.trim(),
        difficulty: settings.difficulty,
        experienceLevel: settings.experienceLevel,
        totalQuestions: Number(settings.totalQuestions)
      };
      const { data } = await interviewApi.start(payload);
      const id = data.interviewId || data.id;
      if (!id || !data.firstQuestion) {
        throw new Error('Interview start response must contain interviewId and firstQuestion.');
      }
      setInterviewId(id);
      setQuestion(data.firstQuestion);
      setQuestionNumber(data.currentQuestion ?? 1);
      setTotalQuestions(payload.totalQuestions);
      setStatus(data.status || 'IN_PROGRESS');
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to start interview.') });
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async (id) => {
    try {
      setLoading(true);
      const { data } = await interviewApi.report(id);
      setReport(data);
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to load interview report.') });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !interviewId) return;

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      const { data } = await interviewApi.answer(interviewId, { answer: answer.trim() });
      setAnswer('');
      setFeedback(data.feedback || '');
      setScore(data.score ?? null);
      setStatus(data.status || '');
      setQuestionNumber(data.currentQuestion ?? questionNumber);
      setTotalQuestions(data.totalQuestions ?? totalQuestions);

      if (isCompleted(data.status)) {
        setQuestion('');
        await loadReport(interviewId);
      } else if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
      } else {
        setMessage({ type: 'error', text: 'Backend did not return nextQuestion or COMPLETED status.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: getApiError(error, 'Unable to submit answer.') });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setInterviewId(null);
    setQuestion('');
    setQuestionNumber(null);
    setTotalQuestions(null);
    setAnswer('');
    setFeedback('');
    setScore(null);
    setStatus('');
    setReport(null);
    setMessage({ type: '', text: '' });
  };

  if (report) {
    const reportSections = [
      ['Strengths', asArray(report.strengths)],
      ['Weaknesses', asArray(report.weaknesses)],
      ['Suggestions', asArray(report.suggestions)]
    ];

    return (
      <div className="space-y-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">AI Report</h2>
              <p className="text-sm text-slate-500">Report loaded from backend for interview {report.interviewId || interviewId}.</p>
            </div>
            <Button variant="outline" onClick={reset}>
              <RotateCcw size={16} />
              Restart
            </Button>
          </div>
          <div className="mt-5">
            <Message type={message.type}>{message.text}</Message>
          </div>
          {loading ? (
            <p className="mt-5 text-sm text-slate-500">Loading report...</p>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  ['Overall Score', report.overallScore],
                  ['Technical Score', report.technicalScore],
                  ['Communication Score', report.communicationScore],
                  ['Confidence Score', report.confidenceScore],
                  ['Problem Solving Score', report.problemSolvingScore]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-blue-50 p-4 text-center">
                    <p className="text-sm text-blue-700">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{value ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {reportSections.map(([title, items]) => (
                  <div key={title} className="rounded-md border border-slate-200 p-4">
                    <h3 className="font-bold text-ink">{title}</h3>
                    {items.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">No {title.toLowerCase()} returned.</p>
                    ) : (
                      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                        {items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-slate-200 p-4">
                <h3 className="font-bold text-ink">Overall Feedback</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{report.overallFeedback || 'No overall feedback returned.'}</p>
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!interviewId ? (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <Brain className="text-primary" size={34} />
          <h2 className="mt-3 text-xl font-bold text-ink">AI Interview Practice</h2>
          <p className="mt-1 text-sm text-slate-500">Start an interview and answer questions returned by the backend.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Input label="Role" value={settings.role} onChange={(e) => setSettings({ ...settings, role: e.target.value })} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Difficulty</span>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2" value={settings.difficulty} onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}>
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Experience Level</span>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2" value={settings.experienceLevel} onChange={(e) => setSettings({ ...settings, experienceLevel: e.target.value })}>
                <option value="FRESHER">FRESHER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="EXPERIENCED">EXPERIENCED</option>
              </select>
            </label>
            <Input
              label="Total Questions"
              type="number"
              min="1"
              max="20"
              value={settings.totalQuestions}
              onChange={(e) => setSettings({ ...settings, totalQuestions: e.target.value })}
            />
          </div>
          <div className="mt-5 space-y-4">
            <Message type={message.type}>{message.text}</Message>
            <Button onClick={startInterview} disabled={loading}>
              {loading ? 'Starting...' : 'Start Interview'}
            </Button>
          </div>
        </section>
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Interview ID: {interviewId}</p>
              <p className="text-xs text-slate-500">Question {questionNumber ?? '-'} of {totalQuestions ?? '-'}</p>
            </div>
            <Button variant="outline" onClick={reset}>
              <RotateCcw size={16} />
              Restart
            </Button>
          </div>
          {feedback && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <p className="font-semibold">AI Feedback{score !== null ? ` | Current Score: ${score}` : ''}</p>
              <p className="mt-1">{feedback}</p>
            </div>
          )}
          <div className="mt-4">
            <Message type={message.type}>{message.text}</Message>
          </div>
          {isCompleted(status) ? (
            <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-500">Interview completed. Loading backend report...</p>
          ) : (
            <>
              <h2 className="mt-5 text-xl font-bold text-ink">{question || 'Waiting for backend question...'}</h2>
              <textarea
                className="mt-5 min-h-44 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Button className="mt-4" onClick={submitAnswer} disabled={!answer.trim() || submitting}>
                {submitting ? 'Submitting...' : 'Submit Answer'}
                <ArrowRight size={16} />
              </Button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
