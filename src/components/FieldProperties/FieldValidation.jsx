import React from "react";

export const FieldValidation = React.memo(
  ({ fields, updateField, selectedFieldId }) => {
    return (
      <div>
        <h2 className="font-medium mb-2">Validation</h2>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            onChange={(e) => updateField("required", e.target.checked)}
            checked={
              fields.find((f) => f.id === selectedFieldId)?.required || false
            }
          />{" "}
          Required
        </label>
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Regex"
          onChange={(e) => updateField("regex", e.target.value)}
          value={fields.find((f) => f.id === selectedFieldId)?.regex || ""}
        />
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Custom Error Message"
          onChange={(e) => updateField("errorMsg", e.target.value)}
          value={fields.find((f) => f.id === selectedFieldId)?.errorMsg || ""}
        />
        <div className="flex gap-2">
          <input
            className="w-1/2 border p-2 rounded"
            placeholder="Min"
            onChange={(e) => updateField("minChar", e.target.value)}
            value={fields.find((f) => f.id === selectedFieldId)?.minChar || ""}
          />
          <input
            className="w-1/2 border p-2 rounded"
            placeholder="Max"
            onChange={(e) => updateField("maxChar", e.target.value)}
            value={fields.find((f) => f.id === selectedFieldId)?.maxChar || ""}
          />
        </div>
      </div>
    );
  }
);
