import { DropFields } from "./DropFields";
import { FormPreview } from "./FormPreview";
import React from "react";

const CanvasArea = React.memo(
  ({
    fields,
    isPreviewMode,
    formData,
    setFormData,
    fieldReordering,
    setIsPreviewMode,
    handleDrop,
    onselect,
    updateField,
    onDelete,
  }) => {
    return isPreviewMode ? (
      <FormPreview
        fields={fields}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsPreviewMode(false)}
      />
    ) : (
      <DropFields
        ondrop={handleDrop}
        fields={fields}
        onselect={onselect}
        onchange={updateField}
        fieldReordering={fieldReordering}
        onDelete={onDelete}
      />
    );
  }
);
export default CanvasArea;
