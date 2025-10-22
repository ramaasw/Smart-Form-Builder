export default function DynamicInputRenderer({ field, value, onChange }) {
  if (!field) return null;

  const commonProps = {
    id: field.id,
    name: field.name || field.id,
    placeholder: field.placeholder || "",
    value: value || "",
    onChange,
    className: "p-2 flex-1 border rounded-md text-sm  focus:outline-none", //focus:ring-2 focus:ring-blue-400 for preview
    minLength: field.minChar || undefined,
    maxLength: field.maxChar || undefined,
    "aria-label": field.label || field.name,
  };

  switch (field.type) {
    case "text":
      return <input type="text" {...commonProps} />;

    case "textarea":
      return <textarea {...commonProps} rows={field.rows || 3} />;

    case "number":
      return <input type="number" {...commonProps} />;

    case "email":
      return <input type="email" {...commonProps} />;

    case "password":
      return <input type="password" {...commonProps} />;

    case "checkbox":
      return (
        <input
          type="checkbox"
          id={field.id}
          name={field.name || field.id}
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4"
        />
      );

    case "radio":
      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option, idx) => (
            <label
              key={`${field.id}-${idx}`}
              htmlFor={`${field.id}-${idx}`}
              className="flex items-center gap-1 text-sm"
            >
              <input
                type="radio"
                id={`${field.id}-${idx}`}
                name={field.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      );

    case "select":
      return (
        <select {...commonProps}>
          <option value="">Select</option>
          {field.options?.map((opt, idx) => (
            <option key={`${field.id}-opt-${idx}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "date":
      return <input type="date" {...commonProps} />;

    case "file":
      return (
        <input
          type="file"
          id={field.id}
          name={field.name || field.id}
          className={commonProps.className}
          onChange={(e) => onChange(e.target.files[0])}
        />
      );

    default:
      return (
        <input
          type="text"
          {...commonProps}
          placeholder={field.placeholder || "Enter value"}
        />
      );
  }
}
