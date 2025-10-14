export default function RadioOptions({ options=[], updateFieldOptions }) {
  return (
    <div>
      <p className="font-semibold">Options</p>
      {options &&
        options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mt-2">
            <input
              className="w-full border p-2 rounded"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateFieldOptions("Update", i, e.target.value)}
            />
            {options.length > 1 && (
              <button
                type="button"
                onClick={() => updateFieldOptions("Remove", i)}
                className="px-2 py-1 bg-red-500 text-black rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      <button
        type="button"
        onClick={() => updateFieldOptions("Add")}
        className="mt-2 px-3 py-1 bg-blue-500 text-black rounded"
      >
        + Add Option
      </button>
    </div>
  );
}
