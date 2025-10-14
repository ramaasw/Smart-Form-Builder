import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { validator } from "../helper/helper";

export const DraggableField = ({
  field,
  index,
  moveField,
  isSelected,
  onClick,
}) => {
  const ref = useRef(null);

  // Make it draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: "form-field",
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make it a drop target for reordering
  const [, dropRef] = useDrop({
    accept: "form-field",
    hover: (item) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex; //  Update the index in the dragged item
    },
  });

  dragRef(dropRef(ref)); // connect both drag & drop

  return (
    <div
      ref={ref}
      className={`w-full mb-4 p-2 flex items-center gap-2 cursor-move ${
        isSelected ? "border-2 border-blue-500 bg-white" : "null"
      }`}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* label */}
      <span className="whitespace-nowrap w-25 font-medium inline-block">
        {field.label}
      </span>

      {/* Different input types */}
      {field.type === "checkbox" && (
        <input type="checkbox" className="w-4 h-4" required={field.required} />
      )}

      {field.type === "radio" &&
        field.options.map((option) => (
          <div
            key={`${field.id}-${option}`}
            className="flex items-center gap-2"
          >
            <label>{option}</label>
            <input
              type="radio"
              name={field.id}
              value={option}
              required={field.required}
            />
          </div>
        ))}

      {(field.type === "text" || field.type === "textarea") && (
        <input
          type={field.type}
          placeholder={field.placeholder}
          className="p-2 flex flex-1 border rounded"
          required={field.required}
          minLength={field.minChar}
          maxLength={field.maxChar}
          onBlur={(e) => {
            const error = validator(field, e.target.value);
            if (error) alert(error);
          }}
        />
      )}

      {field.type === "select" && (
        <select
          className="p-2 flex flex-1 border rounded"
          required={field.required}
        >
          <option value="">Select an option</option>
          {field.options?.map((option, idx) => (
            <option key={`${field.id}-opt-${idx}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {field.type === "date" && (
        <input type="date" className="p-2 flex flex-1 border rounded" />
      )}

      {field.type === "file" && (
        <input type="file" className="p-2 flex flex-1 border rounded" />
      )}
    </div>
  );
};
