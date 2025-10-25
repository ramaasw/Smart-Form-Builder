import React from "react";
import RadioOptions from "../../helper/RadioOptions";

export const FieldLabelPlaceholder = React.memo(
  ({ fields, updateField, selectedFieldId, updateFieldOptions }) => {
    return (
      <div>
        <h2 className="font-medium mb-2">Label & Placeholder</h2>
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Label"
          onChange={(e) => updateField("label", e.target.value)}
          value={fields.find((f) => f.id === selectedFieldId)?.label || ""}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Placeholder"
          onChange={(e) => updateField("placeholder", e.target.value)}
          value={
            fields.find((f) => f.id === selectedFieldId)?.placeholder || ""
          }
        />
        {(fields.find((f) => f.id === selectedFieldId)?.type === "radio" ||
          fields.find((f) => f.id === selectedFieldId)?.type === "select") && (
          <RadioOptions
            {...fields.find((f) => f.id === selectedFieldId)}
            updateFieldOptions={updateFieldOptions}
          />
        )}
      </div>
    );
  }
);
