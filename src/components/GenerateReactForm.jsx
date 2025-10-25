function generateReactForm() {
  const imports = `import React, { useState } from "react";
import { formConfig } from "./formConfig";`;

  // Generate form field rendering logic
  const fieldElements = `{
  formConfig.fields.map((field) =>
    shouldShowField(field) ? (
      <div key={field.id} className="form-group">
        <label htmlFor={field.id}>{field.label}</label>

        {field.type === "radio" ? (
          field.options.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={field.name}
                value={opt}
                checked={data[field.id] === opt}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
              {opt}
            </label>
          ))
        ) : field.type === "checkbox" ? (
          <input
            id={field.id}
            type="checkbox"
            checked={!!data[field.id]}
            onChange={(e) => handleChange(field.id, e.target.checked)}
          />
        ) : field.type === "textarea" ? (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            value={data[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        ) : field.type === "date" ? (
          <input
            id={field.id}
            type="date"
            value={data[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        ) : field.type === "file" ? (
         <>
          <input
            id={field.id}
            type="file"
            onChange={(e) =>
              handleChange(field.id, e.target.files?.[0] || null)
            }
          />
          {data[field.id] && 
        <small>{data[field.id].name}</small>}
        </>
        ) : field.type === "select" ? (
          <select
            id={field.id}
            value={data[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
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
            placeholder={field.placeholder}
            value={data[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        )}

        {errors[field.id] && (
          <small className="error">{errors[field.id]}</small>
        )}
      </div>
    ) : null
  )
}`;

  // Combine everything
  return `${imports}

export default function GeneratedForm() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

const operatorToJS = (op) => ({
  equals: "===",
  notEquals: "!==",
  greaterThan: ">",
  lessThan: "<",
  contains: "includes",
}[op] || "===");

const normalizePattern = (patternStr)=>{
 if (patternStr instanceof RegExp) return patternStr;
  // Remove surrounding quotes or slashes if present
 const cleaned = patternStr
      .toString()
      .replace(/^['"/]+|['"/]+$/g, ""); 
  return new RegExp(cleaned);
  }

  const validateField = (field, value) => {
    if (field.required && !value) {
      return \`\${field.label} is required\`;
    }
    if (field.validation?.pattern) {
    const regex = normalizePattern(field.validation.pattern);
    if(!regex.test(value)){
      return field.validation.message;
    }
    }
    if (
      field.validation?.minLength &&
      value.length < field.validation.minLength
    ) {
      return field.validation.message;
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
    if (!field.conditionalLogic) return true;
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
    <form onSubmit={handleSubmit} className="smart-form">
      <h2>{formConfig.title}</h2>
      ${fieldElements}
      <button type="submit">Submit</button>
    </form>
  );
}
`;
}

export { generateReactForm };
