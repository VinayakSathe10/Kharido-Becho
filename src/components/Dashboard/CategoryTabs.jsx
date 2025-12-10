export default function CategoryTabs({ activeCategory, onChange }) {
  const categories = ["LAPTOPS", "BIKES", "CARS", "MOBILES"];

  return (
    <div className="flex gap-3 my-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-md font-semibold ${
            activeCategory === cat
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
