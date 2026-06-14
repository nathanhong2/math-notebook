import { useState, useEffect } from 'react';
import type { Question } from './types';
import { getAllQuestions, saveQuestion, deleteQuestion } from './db';
import Sidebar from './components/Sidebar';
import QuestionPage from './components/QuestionPage';

function newQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    title: '',
    subject: '',
    questionImage: null,
    wrongAnswerImage: null,
    practices: [false, false, false, false, false],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getAllQuestions().then((qs) => {
      setQuestions(qs);
      if (qs.length > 0) setSelectedId(qs[0].id);
    });
  }, []);

  async function handleNew() {
    const q = newQuestion();
    await saveQuestion(q);
    setQuestions((prev) => [q, ...prev]);
    setSelectedId(q.id);
  }

  async function handleSave(updated: Question) {
    await saveQuestion(updated);
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return;
    await deleteQuestion(id);
    setQuestions((prev) => {
      const next = prev.filter((q) => q.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  const selected = questions.find((q) => q.id === selectedId) ?? null;

  return (
    <>
      <Sidebar
        questions={questions}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {selected ? (
          <QuestionPage key={selected.id} question={selected} onSave={handleSave} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-6xl mb-4">📐</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Math Notebook</h2>
            <p className="text-gray-500 max-w-xs">
              Upload photos of questions you got wrong and practice them 5 times to master them.
            </p>
            <button
              onClick={handleNew}
              className="mt-6 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors"
            >
              Add your first question
            </button>
          </div>
        )}
      </main>
    </>
  );
}
