import { useRef , React, memo} from "react";
import { useDrag, useDrop } from "react-dnd";
import DynamicInputRenderer from "../helper/RenderFieldInput.js/DynamicInputRenderer";

export const DraggableField = memo(({
  field,
  index,
  moveField,
  isSelected,
  onClick,
}) => {
  const ref = useRef(null);

  // --- Make it draggable ---
  const [{ isDragging }, dragRef] = useDrag({
    type: "form-field",
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // --- Make it droppable for reordering ---
  const [, dropRef] = useDrop({
    accept: "form-field",
    hover: (item) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  dragRef(dropRef(ref)); // connect both drag & drop

  // --- Render UI ---
  return (
    <div
      ref={ref}
      className={`w-full mb-4 p-2 flex items-center gap-2 cursor-move ${
        isSelected ? "border-2 border-blue-500 bg-white" : "null"
      }`}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Label */}
      <label
        htmlFor={field.id}
        className="font-medium text-gray-800 text-sm shrink-0 text-left !min-w-20"
      >
        {field.label}
      </label>

      {/* Dynamic input */}
      <DynamicInputRenderer
        field={field}
        value={field.value || ""}
        onChange={(e) => {
          const val =
            e?.target?.type === "checkbox"
              ? e.target.checked
              : e?.target?.value ?? e;
          field.value = val; // You can also lift this up via props if needed
        }}
      />
    </div>
  );
});
