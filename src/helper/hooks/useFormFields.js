import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export function useFormFields() {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState([]);

  // useEffect(() => {
  //   console.log("formData", formData);
  //   console.log("fields", fields);
  // }, [formData, fields]);

  const handleDrop = useCallback((item) => {
    const baseField = {
      ...item,
      id: uuidv4(),
      conditionalLogic: {
        dependsOn: null,
        operator: "equals",
        value: "",
        action: "show",
      },
    };

    if (["radio", "select"].includes(item.type)) {
      baseField.options = ["Option 1"];
    }

    setFields((prev) => [...prev, baseField]);
  }, []);

  const handleSelect = useCallback((id) => setSelectedFieldId(id), []);

  const updateField = useCallback(
    (key, val) => {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === selectedFieldId ? { ...field, [key]: val } : field
        )
      );
    },
    [selectedFieldId]
  );

  const updateFieldOptions = useCallback(
    (action, index, value) => {
      setFields((prevFields) =>
        prevFields.map((field) => {
          if (field.id !== selectedFieldId) return field;
          let options = [...(field.options || [])];
          if (action === "Add") options.push("");
          else if (action === "Update") options[index] = value;
          else if (action === "Remove") options.splice(index, 1);
          return { ...field, options };
        })
      );
    },
    [selectedFieldId]
  );

  const updateConditionalLogicVal = useCallback(
    (val) => {
      const selected = fields.find((f) => f.id === selectedFieldId);
      if (!selected) return;
      const updatedLogic = {
        ...selected.conditionalLogic,
        value: val,
        dependsOn:
          selected.conditionalLogic.dependsOn || (fields[0]?.id ?? null),
      };
      updateField("conditionalLogic", updatedLogic);
    },
    [selectedFieldId, fields, updateField]
  );

  const deleteField = useCallback(() => {
    if (!selectedFieldId) return;
    setFields((prev) => prev.filter((f) => f.id !== selectedFieldId));
    setSelectedFieldId(null);
  }, [selectedFieldId]);

  const fieldReordering = useCallback(
    (updatedFields) => setFields([...updatedFields]),
    []
  );

  return {
    fields,
    selectedFieldId,
    formData,
    isPreviewMode,
    setIsPreviewMode,
    handleDrop,
    handleSelect,
    updateField,
    updateFieldOptions,
    fieldReordering,
    updateConditionalLogicVal,
    deleteField,
    setFormData,
  };
}
