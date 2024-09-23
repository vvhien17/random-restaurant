import React from "react";

const AddRestaurant = ({ name, setName, addRestaurantName }) => {
  return (
    <div className="items-center justify-center gap-4 flex">
      <textarea
        className="border rounded-md w-3/5 p-3 focus-visible:outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter names here..."
        rows="5"
        cols="50"
      />
      <button
        className="border p-2 w-1/5 bg-blue-500 text-white rounded-md"
        onClick={addRestaurantName}
      >
        Add
      </button>
    </div>
  );
};

export default AddRestaurant;
