import { useState } from "react";
import { Sparkles, X, Loader2, ChevronRight, CheckCircle } from "lucide-react";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import { useToast } from "../../../contexts/ToastContext";

interface GeneratedLesson {
  title: string;
  content: string;
  codeExamples: { code: string; explanation: string }[];
  notes: string[];
  tips: string[];
}

interface GeneratedSection {
  sectionTitle: string;
  lessons: GeneratedLesson[];
}

interface Props {
  courseId: string;
  onClose: () => void;
  onApply: (section: GeneratedSection) => void;
}

export default function AISectionGenerateModal({ courseId, onClose, onApply }: Props) {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedSection | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await creatorCourseAPI.generateSectionWithAI(courseId, topic);
      setGenerated(res.data);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = code === "PRO_OR_KEY_REQUIRED"
        ? "Upgrade to Creator Pro or add your own Gemini API key in the Earnings page to use AI generation."
        : err?.response?.data?.message || err.message || "Generation failed";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Generate Section with AI</h2>
              <p className="text-xs text-slate-500">Creator Pro or your own API key · Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!generated ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                What should this section cover?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
                placeholder="e.g. Async/Await patterns, React hooks, REST APIs..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                disabled={loading}
              />
              <p className="text-xs text-slate-400">
                AI will generate a full section with 3 lessons, code examples, notes, and tips.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">{generated.sectionTitle}</p>
                  <p className="text-xs text-green-700">{generated.lessons.length} lessons generated</p>
                </div>
              </div>
              <div className="space-y-2">
                {generated.lessons.map((lesson, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
                      <p className="text-sm font-medium text-slate-800">{lesson.title}</p>
                    </div>
                    <p className="mt-1 ml-7 text-xs text-slate-500 line-clamp-2">{lesson.content.replace(/[#*]/g, "").slice(0, 120)}…</p>
                    <p className="mt-1 ml-7 text-xs text-slate-400">{lesson.codeExamples?.length || 0} code examples · {lesson.notes?.length || 0} notes · {lesson.tips?.length || 0} tips</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setGenerated(null); setTopic(""); }}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Generate different section
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          {!generated ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate</>
              )}
            </button>
          ) : (
            <button
              onClick={() => { onApply(generated); onClose(); }}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <ChevronRight className="h-4 w-4" /> Apply to Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
