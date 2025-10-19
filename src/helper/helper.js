const validator = (field, value) => {
  // Required check
  if (field.required && !value) {
    return "This field is required";
  }

  // Regex check
  if (field.regex) {
    let pattern;
    try {
      if (field.regex instanceof RegExp) {
        // Already a regex literal
        pattern = field.regex;
      } else if (typeof field.regex === "string") {
        // Regex string from config/JSON
        const cleanedRegex = field.regex.replace(/^\/|\/$/g, ""); // remove / at start & end
        pattern = new RegExp(cleanedRegex);
      }
      if (!pattern.test(value || "")) {
        return field.errorMsg || "Invalid format";
      }
    } catch (e) {
      console.warn("Invalid regex in field:", field.regex, e.message);
    }
  }

  if (field.minChar) {
    if ((value?.length || 0) < field.minChar) {
      return `Minimum ${field.minChar} characters required`;
    }
  }
  if (field.maxChar) {
    if ((value?.length || 0) > field.maxChar) {
      return `Maximum ${field.maxChar} characters allowed`;
    }
  }

  return null; // No error
};

const evaluateCondition = (field, formData) => {
  const logic = field.conditionalLogic;
  if (!logic || !logic.dependsOn) return true;
  const targetValue = formData[logic.dependsOn];
  if (!targetValue) return true;

  const { operator, value, action } = logic;

  let comparison = false;

  switch (operator) {
    case "equals":
      comparison = targetValue === value;
      break;
    case "notEquals":
    case "not equals": // normalize both
      comparison = targetValue !== value;
      break;
    case "contains":
      comparison = targetValue.includes?.(value);
      break;
    case "notContains":
    case "not contains":
      comparison = !targetValue.includes?.(value);
      break;
    case "greaterThan":
      comparison = parseFloat(targetValue) > parseFloat(value);
      break;
    case "lessThan":
      comparison = parseFloat(targetValue) < parseFloat(value);
      break;
    default:
      return true; // fallback: show field
  }

  // Action handling
  if (action === "show") return comparison;
  if (action === "hide") return !comparison;

  return true; // default to showing
};

export { evaluateCondition, validator };
