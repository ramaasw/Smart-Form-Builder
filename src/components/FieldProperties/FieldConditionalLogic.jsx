import React from "react";
import { operators } from "../../constants/formFields";

export const FieldConditionalLogic = React.memo(
  ({ fields, updateField, selectedFieldId, updateConditionalLogicVal }) => {
    return (
      <div>
        <h2 className="font-medium mb-2">Conditional Logic</h2>
        <select
          className="w-full border p-2 rounded mb-2"
          value={
            fields.find((f) => f.id === selectedFieldId)?.conditionalLogic
              ?.dependsOn || ""
          }
          onChange={(e) => {
            updateField("conditionalLogic", {
              ...(fields.find((f) => f.id === selectedFieldId)
                ?.conditionalLogic || {}),
              dependsOn: e.target.value,
            });
          }}
        >
          {fields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label || f.type}
            </option>
          ))}
        </select>
        <select
          className="w-full border p-2 rounded mb-2"
          value={
            fields.find((f) => f.id === selectedFieldId)?.conditionalLogic
              ?.operator || ""
          }
          onChange={(e) => {
            updateField("conditionalLogic", {
              ...(fields.find((f) => f.id === selectedFieldId)
                ?.conditionalLogic || {}),
              operator: e.target.value,
            });
          }}
        >
          {operators.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Help text"
          value={
            fields.find((f) => f.id === selectedFieldId)?.conditionalLogic
              ?.value || ""
          }
          onChange={(e) => {
            updateConditionalLogicVal(e.target.value);
          }}
        />

        <select
          className="w-full border p-2 rounded"
          value={
            fields.find((f) => f.id === selectedFieldId)?.conditionalLogic
              ?.action || "show"
          }
          onChange={(e) =>
            updateField("conditionalLogic", {
              ...(fields.find((f) => f.id === selectedFieldId)
                ?.conditionalLogic || {}),
              action: e.target.value,
            })
          }
        >
          <option value="show">Show</option>
          <option value="hide">Hide</option>
        </select>
      </div>
    );
  }
);
