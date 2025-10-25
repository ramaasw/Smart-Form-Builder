const BuilderHeader = ({ isPreviewMode, setIsPreviewMode }) => {
  return (
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
  );
};
export default BuilderHeader;
