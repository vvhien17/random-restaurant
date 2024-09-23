import React, { useState } from "react";

const AddRestaurant = ({ restaurants, setRestaurants }) => {
  const [name, setName] = useState("");

  const addName = (name) => {
    const nameList = name.split('\n').map(item => item.trim()).filter(item => item);
    if (!nameList.length) return;
    const newItems = nameList.map(item => ({ name: item, address: '', lat: '', lng: '' }));
    const updatedRestaurants = [...restaurants, ...newItems];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setName('');
  };

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
        onClick={() => { addName(name); setName("") }}
      >
        Add
      </button>
    </div>
  );
};

export default AddRestaurant;
