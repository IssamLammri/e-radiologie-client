import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { legacyCalculators } from "../data/legacyClassifications";

// Existing algorithms are kept verbatim in legacyClassifications; no calculator is inferred for new content.
export function LegacyClassificationCalculator({
  calculatorKey,
}: {
  calculatorKey: string | null;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const calculator = calculatorKey
    ? legacyCalculators[calculatorKey]
    : undefined;
  if (!calculator) return null;
  const complete = calculator.steps.every((_, i) => answers[i] !== undefined);
  const result = complete ? calculator.calculateResult(answers) : null;
  return (
    <div className="v1-panel mt-5">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="flex items-center gap-2 font-bold">
          <Calculator size={18} className="text-sky-600" />
          {calculator.title}
        </h3>
        <button
          className="text-xs text-slate-500 flex gap-1"
          onClick={() => setAnswers({})}
        >
          <RotateCcw size={14} /> Réinitialiser
        </button>
      </div>
      {calculator.steps.map((step, index) => (
        <fieldset key={index} className="mb-5">
          <legend className="text-sm font-semibold mb-2">
            {step.question}
          </legend>
          {step.options.map((option, i) => (
            <label
              key={i}
              className="flex gap-3 items-center rounded-lg border border-slate-200 bg-slate-50 p-3 my-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name={`${calculatorKey}-${index}`}
                checked={answers[index] === option.points}
                onChange={() =>
                  setAnswers((a) => ({ ...a, [index]: option.points }))
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      ))}
      {result && (
        <div
          role="status"
          className={`p-4 rounded-xl ${result.variant === "destructive" ? "bg-rose-50" : result.variant === "warning" ? "bg-amber-50" : "bg-emerald-50"}`}
        >
          <p className="font-bold">
            {result.score} — {result.category}
          </p>
          <p className="text-sm mt-2">{result.comment}</p>
        </div>
      )}
    </div>
  );
}
