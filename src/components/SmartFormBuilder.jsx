import { advancedFormFields, basicFormFields } from "../constants/formFields";
import BuilderHeader from "./BuilderHeader";
import CanvasArea from "./CanvasArea";
import { FieldAccessibility } from "./FieldProperties/FieldAccessibility";
import { FieldConditionalLogic } from "./FieldProperties/FieldConditionalLogic";
import { FieldLabelPlaceholder } from "./FieldProperties/FieldLabelPlaceholder";
import { FieldValidation } from "./FieldProperties/FieldValidation";
import LeftSideBarFields from "./LeftSideBarFields";

import { useFormFields } from "../helper/hooks/useFormFields";

export default function SmartFormBuilder() {
  const {
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
  } = useFormFields();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}

      <BuilderHeader
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
      />
      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar - Form Elements */}
        <LeftSideBarFields
          basicFormFields={basicFormFields}
          advancedFormFields={advancedFormFields}
        />

        {/* Canvas */}

        <CanvasArea
          fields={fields}
          selectedFieldId={selectedFieldId}
          isPreviewMode={isPreviewMode}
          formData={formData}
          setFormData={setFormData}
          onselect={handleSelect}
          onChange={updateField}
          fieldReordering={fieldReordering}
          onDelete={deleteField}
          setIsPreviewMode={setIsPreviewMode}
          handleDrop={handleDrop}
        />

        {/* Right Sidebar - Properties */}
        <aside className="w-1/4 p-4 bg-white space-y-6">
          <FieldLabelPlaceholder
            fields={fields}
            selectedFieldId={selectedFieldId}
            updateField={updateField}
            updateFieldOptions={updateFieldOptions}
          />
          <FieldValidation
            fields={fields}
            selectedFieldId={selectedFieldId}
            updateField={updateField}
          />
          <FieldConditionalLogic
            fields={fields}
            selectedFieldId={selectedFieldId}
            updateField={updateField}
            updateConditionalLogicVal={updateConditionalLogicVal}
          />
          <FieldAccessibility
            fields={fields}
            selectedFieldId={selectedFieldId}
            updateField={updateField}
          />
        </aside>
      </div>
    </div>
  );
}
