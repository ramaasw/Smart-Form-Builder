function generateReactForm() {
  const imports = `import React, { useState } from "react";
import { formConfig } from "./formConfig";
import "bootstrap/dist/css/bootstrap.min.css";`;

  const fieldElements = `{
  formConfig.fields.map((field) =>
    shouldShowField(field) ? (
      <div key={field.id} className="d-flex align-items-start mb-3">
        <label htmlFor={field.id} className="me-3 fw-medium text-nowrap" style={{ width: "25%" }}>
          {field.label}
          {field.required && <span className="text-danger ms-1">*</span>}
        </label>
        <div className="flex-grow-1">
          {field.type === "radio" ? (
            <div className="d-flex flex-wrap gap-3">
              {field.options.map((opt) => (
                <div key={opt} className="form-check form-check-inline">
                  <input
                    type="radio"
                    id={\`\${field.id}-\${opt}\`}
                    name={field.name}
                    value={opt}
                    checked={data[field.id] === opt}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={(e) => handleBlur(field, e.target.value)}
                    className="form-check-input"
                  />
                  <label htmlFor={\`\${field.id}-\${opt}\`} className="form-check-label">
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === "checkbox" ? (
            <div className="form-check">
              <input
                id={field.id}
                type="checkbox"
                checked={!!data[field.id]}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                onBlur={(e) => handleBlur(field, e.target.checked)}
                className="form-check-input"
              />
              <label htmlFor={field.id} className="form-check-label">
                {field.placeholder || field.label}
              </label>
            </div>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.id}
              className="form-control"
              placeholder={field.placeholder}
              value={data[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
            />
          ) : field.type === "date" ? (
            <input
              id={field.id}
              type="date"
              className="form-control"
              value={data[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
            />
          ) : field.type === "file" ? (
            <div>
              <input
                id={field.id}
                type="file"
                className="form-control"
                onChange={(e) => handleChange(field.id, e.target.files?.[0] || null)}
                onBlur={(e) => handleBlur(field, e.target.files?.[0] || null)}
              />
              {data[field.id] && (
                <small className="text-muted d-block mt-1">
                  Selected: {data[field.id].name}
                </small>
              )}
            </div>
          ) : field.type === "select" ? (
            <select
              id={field.id}
              className="form-select"
              value={data[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.id}
              type={field.type}
              className="form-control"
              placeholder={field.placeholder}
              value={data[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
            />
          )}

          {errors[field.id] && (
            <div className="text-danger small mt-1">{errors[field.id]}</div>
          )}
        </div>
      </div>
    ) : null
  )
}`;

  return `${imports}

export default function GeneratedForm() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field.id]: error }));
  };

  const operatorToJS = (op) => ({
    equals: "===",
    notEquals: "!==",
    greaterThan: ">",
    lessThan: "<",
    contains: "includes",
  }[op] || "===");

  const normalizePattern = (patternStr) => {
    if (patternStr instanceof RegExp) return patternStr;
    const cleaned = patternStr.toString().replace(/^['"/]+|['"/]+$/g, "");
    return new RegExp(cleaned);
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return \`\${field.label} is required\`;
    }
    if (field?.regex) {
      const regex = normalizePattern(field.regex);
      if (!regex.test(value)) {
        return field.errorMsg ;
      }
    }
    if (field?.minChar  && value.length < field.minChar ) {
      return field?.errorMsg || \`Minimum \${field.minChar} characters required\`
    }
    if (field?.maxChar  && value.length < field.maxChar ) {
      return field?.errorMsg || \`Minimum \${field.maxChar} characters required\`;
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formConfig.fields.forEach((field) => {
      const value = data[field.id];
      const error = validateField(field, value);
      if (error) newErrors[field.id] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("✅ Submitted:\\n" + JSON.stringify(data, null, 2));
    }
  };

  const shouldShowField = (field) => {
    if (!field.conditionalLogic?.dependsOn) return true;
    const dependsOn = field.conditionalLogic.dependsOn;
    const expectedValue = field.conditionalLogic.value;
    const operator = operatorToJS(field.conditionalLogic.operator);
    switch (operator) {
      case "===":
        return data[dependsOn] === expectedValue;
      case "!==":
        return data[dependsOn] !== expectedValue;
      case ">":
        return data[dependsOn] > expectedValue;
      case "<":
        return data[dependsOn] < expectedValue;
      case "includes":
        return (data[dependsOn] || "").includes(expectedValue);
      default:
        return data[dependsOn] === expectedValue;
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ backdropFilter: "blur(5px)", zIndex: 1050 }}
    >
      <div
        className="bg-white shadow p-4 rounded-4 border w-100"
        style={{ maxWidth: "700px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary fw-bold mb-0">{formConfig.title}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          ${fieldElements}
          <div className="text-end">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
}

export { generateReactForm };
