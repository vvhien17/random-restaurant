import React from "react";

const RestaurantList = ({ restaurants, setRestaurants, isSpinning }) => {
  const deleteRestaurant = (index) => {
    if (isSpinning) return;
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };
  return (
    <div className="restaurant-list mt-4">
      <p className="text-lg font-semibold border-b border-gray-400 p-4">
        List of Restaurants
      </p>
      <div className="grid max-h-[50vh] overflow-auto">
        {restaurants.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-6 p-4 border-b">
            <p className="text-sm text-gray-900">{item.name}</p>
            <button
              className="px-4 py-2 text-white bg-red-400 rounded-md"
              onClick={() => deleteRestaurant(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
