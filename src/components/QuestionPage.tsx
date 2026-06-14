import { useState, useEffect } from 'react';
import type { Question } from '../types';
import ImageUpload from './ImageUpload';

interface Props {
  question: Question;
  onSave: (q: Question) => void;
}

export default function QuestionPage({ question, onSave }: Props) {
  const [local, setLocal] = useState<Question>(question);

  useEffect(() => {
    setLocal(question);
  }, [question.id]);

  function update(patch: Partial<Question>) {
    const updated = { ...local, ...patch, updatedAt: Date.now() };
    setLocal(updated);
    onSave(updated);
  }

  function togglePractice(index: number) {
    const practices = [...local.practices];
    practices[index] = !practices[index];
    update({ practices });
  }

  const doneCount = local.practices.filter(Boolean).length;
  const allDone = doneCount === 5;

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          value={local.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Question title..."
          className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 focus:ring-0"
        />
        <input
          type="text"
          value={local.subject}
          onChange={(e) => update({ subject: e.target.value })}
          placeholder="Subject / Chapter (e.g. Algebra, Ch. 3)..."
          className="w-full text-sm text-gray-500 bg-transparent border-none outline-none placeholder-gray-300"
        />
        <div className="h-px bg-gray-100" />
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ImageUpload
          label="Question"
          image={local.questionImage}
          onImage={(img) => update({ questionImage: img })}
          accent="violet"
        />
        <ImageUpload
          label="My Wrong Answer"
          image={local.wrongAnswerImage}
          onImage={(img) => update({ wrongAnswerImage: img })}
          accent="rose"
        />
      </div>

      {/* Practice tracker */}
      <div className={`rounded-2xl p-6 border-2 transition-colors ${
        allDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Practice Tracker</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Solve this question correctly 5 times to master it
            </p>
          </div>
          {allDone && (
            <span className="text-2xl" title="Mastered!">🌟</span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {local.practices.map((checked, i) => (
            <button
              key={i}
              onClick={() => togglePractice(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                checked
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200'
                  : 'bg-white border-gray-200 text-gray-400 hover:border-violet-300 hover:text-violet-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs shrink-0 transition-colors ${
                checked ? 'bg-white/30 border-white/60' : 'border-current'
              }`}>
                {checked && '✓'}
              </span>
              Attempt {i + 1}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{doneCount} / 5</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-violet-500'}`}
              style={{ width: `${(doneCount / 5) * 100}%` }}
            />
          </div>
          {allDone && (
            <p className="text-sm font-medium text-emerald-600 mt-2 text-center">
              You've mastered this question!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
