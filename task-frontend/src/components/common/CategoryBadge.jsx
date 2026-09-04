import React from 'react';

const CategoryBadge = ({ category }) => {
  if (!category) return null;

  return (
    <span
      className="category-badge"
      style={{ backgroundColor: category.color + '22', color: category.color, borderColor: category.color }}
    >
      {category.title}
    </span>
  );
};

export default CategoryBadge;
