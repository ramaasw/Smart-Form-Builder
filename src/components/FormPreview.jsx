import { evaluateCondition, validator } from "../helper/helper";

export const FormPreview = ({ fields, formData, setFormData, onClose }) => {
  const handleChange = (key, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
  };

  return (
    // 🔹 Overlay background with blur
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* 🔹 Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Form Preview
        </h2>

        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            e.target.reportValidity();
          }}
        >
          {fields.map((field, index) =>
            evaluateCondition(field, formData) ? (
              <div
                key={field.id}
                className="w-full mb-4 p-2 flex items-center gap-2"
              >
                <span className="whitespace-nowrap w-25 font-medium inline-block">
                  {field.label}
                </span>

                {field.type === "checkbox" && (
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    required={field.required}
                    aria-label={field.ariaLabel}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    checked={
                    Object.keys(formData).length && field.id in formData
                      ? formData[field.id]
                      : false
                    }
                  />
                )}

                {field.type === "radio" &&
                  field.options.map((option) => (
                    <div
                      key={`${field.id}-${option}`}
                      className="flex items-center gap-2"
                    >
                      <label>{option}</label>
                      <input
                        id={`${field.id}-${option}`}
                        type="radio"
                        className="w-4 h-4"
                        required={field.required}
                        aria-label={field.ariaLabel}
                        name={field.id}
                        value={option}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        checked={
                          Object.keys(formData).length && field.id in formData
                            ? formData[field.id] === option
                            : false
                        }
                      />
                    </div>
                  ))}

                {(field.type === "text" || field.type === "textarea") && (
                  <div className="flex flex-1 flex-col">
                    <input
                    key={index}
                    id=""
                      type={field.type}
                      placeholder={field.placeholder}
                      className="p-2 flex flex-1 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      required={field.required}
                      minLength={field.minChar}
                      maxLength={field.maxChar}
                      onBlur={(e) => {
                        const error = validator(field, e.target.value);
                        if (error) alert(error);
                      }}
                      aria-label={field.ariaLabel}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                    {field.minChar && (
                      <p className="text-xs text-red-400">
                        Minimum characters allowed: {field.minChar}
                      </p>
                    )}
                    {field.maxChar && (
                      <p className="text-xs text-red-400">
                        Maximum characters allowed: {field.maxChar}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "select" && (
                  <select
                    id={field.id}
                    className="p-2 flex flex-1 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required={field.required}
                    aria-label={field.ariaLabel}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((option, idx) => (
                      <option key={`${field.id}-opt-${idx}`} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "date" && (
                  <input
                    id={field.id}
                    type="date"
                    className="p-2 flex flex-1 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required={field.required}
                    aria-label={field.ariaLabel}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}

                {field.type === "file" && (
                  <input
                    id={field.id}
                    type="file"
                    className="p-2 flex flex-1 border rounded"
                    required={field.required}
                    aria-label={field.ariaLabel}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleChange(field.id, file);
                    }}
                  />
                )}
              </div>
            ) : null
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 !bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
