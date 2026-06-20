export default function Card({ title, description, image, action }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      {image && (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
          {typeof image === 'string' ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">{image}</span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Action Button */}
        {action && (
          <button className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
