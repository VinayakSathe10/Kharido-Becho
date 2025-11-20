export default function ProductCard({ product }) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-out">
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-500">{product.brand} • {product.subCategory}</p>
          <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
        </div>
      </div>
    );
  }
  