export function CategoryWrapper({ title, children }) {
  return (
    <div className="p-4 border rounded-md bg-white shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

export function Table({ children }) {
  return <table className="w-full border bg-white">{children}</table>;
}

export function Th({ children }) {
  return <th className="p-3 border bg-gray-100">{children}</th>;
}

export function Td({ children }) {
  return <td className="p-3 border text-sm">{children}</td>;
}

export function ActionBtn({ children, onClick, color }) {
  const cls =
    color === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-red-600 hover:bg-red-700";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-white text-sm ${cls} mr-2`}
    >
      {children}
    </button>
  );
}
