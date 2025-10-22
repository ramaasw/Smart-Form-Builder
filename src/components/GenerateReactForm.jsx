function generateReactForm(fields) {
  const imports = `import React, { useState } from "react";`;

  const initialState = fields.map(f => `"${f.label}": ""`).join(",\n  ");

  // Validation logic
  const validationLogic = fields.map(f => {
    if (f.regex) {
      return `
    if (${f.required ? `!data["${f.label}"] ||` : ""} 
        !new RegExp(${JSON.stringify(f.regex)}).test(data["${f.label}"])) {
      newErrors["${f.label}"] = "${f.errorMsg || "Invalid input"}";
    }`;
    }
    if (f.required) {
      return `
    if (!data["${f.label}"]) {
      newErrors["${f.label}"] = "${f.label} is required";
    }`;
    }
    return "";
  }).join("");

  // Field elements
  const fieldElements = fields.map(f => {
    const dependsOnExists = f.conditionalLogic?.dependsOn;
    const dependentFieldLabel =
      dependsOnExists &&
      fields.find(fld => fld.id === f.conditionalLogic.dependsOn)?.label;

    const condition = dependsOnExists
      ? `data["${dependentFieldLabel}"] ${operatorToJS(f.conditionalLogic.operator)} "${f.conditionalLogic.value}"`
      : "";

    const id = f.label.replace(/\s+/g, "_").toLowerCase();

    let element = "";
    switch (f.type) {
      case "text":
      case "date":
      case "file":
      case "textarea":
        element = `<input
          id="${id}"
          type="${f.type}"
          placeholder="${f.placeholder || ""}"
          value={data["${f.label}"]}
          onChange={(e) => setData({ ...data, ["${f.label}"]: e.target.value })}
        />`;
        break;

      case "select":
        element = `<select
          id="${id}"
          value={data["${f.label}"]}
          onChange={(e) => setData({ ...data, ["${f.label}"]: e.target.value })}
        >
          <option value="">Select</option>
          ${f.options?.map(opt => `<option value="${opt}">${opt}</option>`).join("\n")}
        </select>`;
        break;

      case "radio":
        element = `${f.options
          ?.map(
            opt => `
          <label>
            <input
              type="radio"
              name="${f.label}"
              value="${opt}"
              checked={data["${f.label}"] === "${opt}"}
              onChange={(e) => setData({ ...data, ["${f.label}"]: e.target.value })}
            />
            ${opt}
          </label>`
          )
          .join("\n")}`;
        break;

      default:
        element = `<input id="${id}" type="text" />`;
    }

    return `
      ${condition ? `{${condition} && (` : ""}
      <div className="form-group">
        <label htmlFor="${id}">${f.label}</label>
        ${element}
        {errors["${f.label}"] && (
          <small style={{ color: "red" }}>{errors["${f.label}"]}</small>
        )}
      </div>
      ${condition ? ") }" : ""}`;
  }).join("\n");

  return `${imports}

export default function GeneratedForm() {
  const [data, setData] = useState({ ${initialState} });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    ${validationLogic}
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert(JSON.stringify(data, null, 2));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      ${fieldElements}
      <button type="submit">Submit</button>
    </form>
  );
}
`;
}

function operatorToJS(op) {
  switch (op) {
    case "equals":
      return "===";
    case "notEquals":
      return "!==";
    case "greaterThan":
      return ">";
    case "lessThan":
      return "<";
    case "contains":
      return "?.includes";
    default:
      return "===";
  }
}

export { generateReactForm };
