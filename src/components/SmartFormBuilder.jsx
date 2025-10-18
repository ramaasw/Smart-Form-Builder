import { useEffect, useState } from "react";
import {
  advancedFormFields,
  basicFormFields,
  operators,
} from "../constants/formFields";
import { DragFields } from "./DragFields";
import { DropFields } from "./DropFields";
import { FormPreview } from "./FormPreview";

import { v4 as uuidv4 } from "uuid";
import RadioOptions from "../helper/RadioOptions";

export default function SmartFormBuilder() {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState([]);
  // const [errors, setErrors] = useState();


  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const handleDrop = (item) => {
        if (item.type === "radio" || item.type === "select") {
      setFields((prevFields) => [
        ...prevFields,
        {
          ...item,
          options: ["Option 1"],
          id: uuidv4(),
          conditionalLogic: {
            dependsOn: null, // field id it depends on
            operator: "equals", // equals, notEquals, contains, greaterThan, etc.
            value: "", // the value to check
            action: "show", // "show" or "hide"
          },
        },
      ]);
    } else {
      setFields((prevFields) => [
        ...prevFields,
        {
          ...item,
          id: uuidv4(),
          conditionalLogic: {
            dependsOn: null, // field id it depends on
            operator: "equals", // equals, notEquals, contains, greaterThan, etc.
            value: "", // the value to check
            action: "show", // "show" or "hide"
          },
        },
      ]);
    }
  };
  const handleSelect = (index) => {
    setSelectedFieldId(index);
  };

  const fieldReordering = (updatedFields) => {
    setFields([...updatedFields]);
  };

  const updateField = (key, val) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === selectedFieldId ? { ...field, [key]: val } : field
      )
    );
  };

  const updateFieldOptions = (action, index, value) => {
    setFields((prevFields) =>
      prevFields.map((field) => {
        if (field.id !== selectedFieldId) {
          return field;
        }

        let newOptions = [...(field.options || [])];

        if (action === "Update") {
          newOptions[index] = value;
        } else if (action === "Add") {
          newOptions.push("");
        } else if (action === "Remove") {
          newOptions = newOptions.filter((_, idx) => idx !== index);
        }

        return { ...field, options: newOptions };
      })
    );
  };

  const updateConditionalLogicVal = (val) => {
    const selected = fields.find((f) => f.id === selectedFieldId);
    if (!selected) return;

    const updatedLogic = {
      ...selected.conditionalLogic,
      value: val,
      dependsOn: selected.conditionalLogic.dependsOn || (fields[0]?.id ?? null),
    };

    updateField("conditionalLogic", updatedLogic);
  };

  // const handleSubmit = () => {
  //   return null;
  // };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <h1 className="font-semibold text-lg">SMART VISUAL FORM BUILDER</h1>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              isPreviewMode ? "bg-red text-blue-500" : ""
            } `}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            Preview
          </button>

          <button className="px-3 py-1 border rounded hover:bg-gray-100">
            ⚙
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar - Form Elements */}
        <aside className="w-1/5 border-r p-4 space-y-6 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-500">BASIC</p>
            <ul className="space-y-2 mt-2">
              {basicFormFields.map((field) => {
                return <DragFields key={field.type} {...field} />;
              })}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">ADVANCED</p>
            <ul className="space-y-2 mt-2">
              {advancedFormFields.map((field) => {
                return <DragFields key={field.type} {...field} />;
              })}
            </ul>
          </div>
        </aside>

        {/* Canvas */}
        {isPreviewMode ? (
          <FormPreview
            fields={fields}
            formData={formData}
            setFormData={setFormData}
            onClose={() => setIsPreviewMode(false)}
            // errors={errors}
          />
        ) : (
          <DropFields
            ondrop={handleDrop}
            fields={fields}
            onselect={handleSelect}
            onchange={updateField}
            fieldReordering={fieldReordering}
            onDelete={() => {
              if (!selectedFieldId) return;
              setFields((prevFields) =>
                prevFields.filter((f) => f.id !== selectedFieldId)
              );
              setSelectedFieldId(null);
            }}
          />
        )}

        {/* Right Sidebar - Properties */}
        <aside className="w-1/4 p-4 bg-white space-y-6">
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
              fields.find((f) => f.id === selectedFieldId)?.type ===
                "select") && (
              <RadioOptions
                {...fields.find((f) => f.id === selectedFieldId)}
                updateFieldOptions={updateFieldOptions}
              />
            )}
          </div>

          <div>
            <h2 className="font-medium mb-2">Validation</h2>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                onChange={(e) => updateField("required", e.target.checked)}
                checked={
                  fields.find((f) => f.id === selectedFieldId)?.required ||
                  false
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
              value={
                fields.find((f) => f.id === selectedFieldId)?.errorMsg || ""
              }
            />
            <div className="flex gap-2">
              <input
                className="w-1/2 border p-2 rounded"
                placeholder="Min"
                onChange={(e) => updateField("minChar", e.target.value)}
                value={
                  fields.find((f) => f.id === selectedFieldId)?.minChar || ""
                }
              />
              <input
                className="w-1/2 border p-2 rounded"
                placeholder="Max"
                onChange={(e) => updateField("maxChar", e.target.value)}
                value={
                  fields.find((f) => f.id === selectedFieldId)?.maxChar || ""
                }
              />
            </div>
          </div>

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

          <div>
            <h2 className="font-medium mb-2">Accessibility</h2>
            <input
              className="w-full border p-2 rounded"
              placeholder="ARIA label"
              onChange={(e) => updateField("ariaLabel", e.target.value)}
              value={
                fields.find((f) => f.id === selectedFieldId)?.ariaLabel || ""
              }
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
