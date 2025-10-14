import { useDrag } from "react-dnd";

export const DragFields = ({ type, label,placeholder }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "side-field",
    item: { type, label, placeholder },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div>
      <li
        ref={dragRef}
        className={`flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-gray-100 ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <span>⬜</span> {label}
      </li>
    </div>
  );
};
