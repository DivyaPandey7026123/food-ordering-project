import { useEffect, useState } from "react";
import axios from "axios";

const FoodList = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/foods`)
      .then((response) => {
        setFoods(response.data);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍽️ Restaurant Menu</h2>
      {foods.length === 0 ? (
        <p>No food items available.</p>
      ) : (
        foods.map((food) => (
          <div
            key={food._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h3>{food.name}</h3>
            <p><strong>Price:</strong> ₹{food.price}</p>
            <p><strong>Category:</strong> {food.category}</p>
            <p>{food.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FoodList;