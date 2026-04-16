import React from 'react';

const ProductCard = ({ product }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 font-medium">{product.supplier}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          <p className="text-xs text-gray-500">per sqm</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Match Score</span>
          <span className={`text-sm font-bold ${getScoreTextColor(product.score)}`}>
            {product.score}%
          </span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-2 backdrop-blur-sm">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(product.score)}`}
            style={{ width: `${product.score}%` }}
          />
        </div>
      </div>

      {/* Specs Chips */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Specifications</p>
        <div className="flex flex-wrap gap-2">
          {product.thickness && (
            <span className="px-3 py-1 bg-blue-100/70 text-blue-800 text-xs font-medium rounded-full backdrop-blur-sm border border-blue-200/50">
              {product.thickness}mm
            </span>
          )}
          {product.size && (
            <span className="px-3 py-1 bg-purple-100/70 text-purple-800 text-xs font-medium rounded-full backdrop-blur-sm border border-purple-200/50">
              {product.size}
            </span>
          )}
          {product.coating && (
            <span className="px-3 py-1 bg-green-100/70 text-green-800 text-xs font-medium rounded-full backdrop-blur-sm border border-green-200/50">
              {product.coating}
            </span>
          )}
          {product.category && (
            <span className="px-3 py-1 bg-gray-100/70 text-gray-800 text-xs font-medium rounded-full backdrop-blur-sm border border-gray-200/50">
              {product.category}
            </span>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="border-t border-white/20 pt-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Why This Match</p>
        <p className="text-sm text-gray-700 leading-relaxed bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          {product.explanation}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default ProductCard;
