import React from "react";
export const FieldAccessibility = React.memo(({
  fields,
  updateField,
  selectedFieldId,
}) => {
  return (
    <div>
      <h2 className="font-medium mb-2">Accessibility</h2>
      <input
        className="w-full border p-2 rounded"
        placeholder="ARIA label"
        onChange={(e) => updateField("ariaLabel", e.target.value)}
        value={fields.find((f) => f.id === selectedFieldId)?.ariaLabel || ""}
      />
    </div>
  );
});
