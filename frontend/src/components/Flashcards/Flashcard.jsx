import { useEffect } from "react";

export default function Flashcard({ flashcard, flipped, setFlipped }) {
  const { title, content } = flashcard || {};

  useEffect(() => {
    setFlipped(false);
  }, [flashcard, setFlipped]);

  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className="relative w-full h-80 cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-3xl p-6 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-cyan-300 text-center">
            {title}
          </h3>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 overflow-y-auto">
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="prose prose-invert max-w-none text-gray-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
