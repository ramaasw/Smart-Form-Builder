import { useState } from "react";
import { useDrop } from "react-dnd";
import { DraggableField } from "./DraggableField";
import { generateReactForm } from "./GenerateReactForm";

export const DropFields = ({ fields, ondrop, onselect,fieldReordering }) => {
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);

  const [, dropRef] = useDrop(() => ({
    accept: "side-field",
    drop: (item) => {
      if (fields.find((f) => f.id === item.id)) return;
      ondrop(item);
    },
  }));

  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    fieldReordering(updatedFields);
  };

  const codeExport = () => {
    const generatedCode = generateReactForm(fields);
     // Download as file
  const blob = new Blob([generatedCode], { type: "text/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "GeneratedForm.jsx";
  link.click();
  
  }

  return (
    <main
      ref={dropRef}
      className="flex-1 flex flex-col items-center border-r bg-gray-50 pt-2"
      style={{ paddingTop: "32px" }}
    >
      {fields.length === 0 ? (
        <p className="text-gray-400">
          Drag fields here to start building your form
        </p>
      ) : (
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault;
            e.target.reportValidity();
          }}
        >
          {fields.map((field, index) => (
            <DraggableField
              key={field.id}
              index={index}
              field={field}
              moveField={moveField}
              isSelected={selectedFieldIndex === field.id}
              onClick={() => {
                onselect(field.id);
                setSelectedFieldIndex(field.id);
              }}
            />
          ))}

          <div className="mt-4 flex gap-2 items-center">
            <button className="px-4 py-2 border rounded" onClick={codeExport}>Export</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded shadow">
              COPY
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
