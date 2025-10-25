import {DragFields} from "./DragFields"
const LeftSideBarFields = ({ basicFormFields, advancedFormFields }) => {
  return (
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
  );
};
export default LeftSideBarFields;
