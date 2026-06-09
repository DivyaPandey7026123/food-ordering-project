import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {

  // ================= STATES =================

  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showCart, setShowCart] = useState(false);
  const API = "https://food-ordering-project-966g.onrender.com";

  // ================= AUTH =================

  const [showLogin, setShowLogin] = useState(false);

  const [isSignup, setIsSignup] = useState(false);

  const [showPayment, setShowPayment] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const totalPrice = cart.reduce(
  (total, item) =>
    total + Number(item.price) * item.quantity,
  0
);

const handlePayment = () => {

  if (!window.Razorpay) {
    alert("Razorpay failed to load");
    return;
  }

  const options = {

    key: "rzp_test_SynpfzmjYWasZD",

    amount: totalPrice * 100,

    currency: "INR",

    name: "FoodieHub",

    description: "Food Payment",

    handler: function (response) {

      alert("Payment Successful");

      console.log(response);

      setShowPayment(false);
    },

    theme: {
      color: "#ff9800",
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.open();
};
  // ================= FETCH FOODS =================

  useEffect(() => {

    fetch("https://food-ordering-project-966g.onrender.com/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.log(err));

  }, []);

  // ================= CART FUNCTIONS =================

  const addToCart = (food) => {

    const existingItem = cart.find(
      (item) => item._id === food._id
    );

    if (existingItem) {

      setCart(
        cart.map((item) =>
          item._id === food._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...food,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {

    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {

    setCart(
      cart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ================= AUTH FUNCTIONS =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const endpoint = isSignup
      ? "signup"
      : "login";

    try {

      const response = await fetch(
        `https://food-ordering-project-966g.onrender.com/api/auth/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        // LOGIN
        if (!isSignup) {

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          setUser(data.user);

          setShowLogin(false);

          alert("Login successful ✅");
        }

        // SIGNUP
        else {

          alert("Signup successful ✅");

          setIsSignup(false);
        }

      } else {

        alert(data.message);
      }

    } catch (err) {

      console.log(err);
    }
  };

  // ================= TOTAL =================

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // ================= PLACE ORDER =================

  const placeOrder = async () => {

  try {

    const res = await fetch(
      "`https://food-ordering-project-966g.onrender.com/api/auth/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: totalPrice,
        }),
      }
    );

    const data = await res.json();

    const options = {

      key: "rzp_test_SynpfzmjYWasZD",

      amount: data.amount,

      currency: data.currency,

      name: "FoodieHub",

      description: "Food Order Payment",

      order_id: data.id,

      handler: async function (response) {

        alert("Payment Successful");

        // SAVE ORDER

        await fetch(
          "https://food-ordering-project-966g.onrender.com/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              userEmail: email,
              items: cart,
              totalAmount: totalPrice,
            }),
          }
        );

        setCart([]);

        setShowPayment(false);
      },

      theme: {
        color: "#ff9800",
      },
    };

    const razor = new window.Razorpay(options);

    razor.open();

  } catch (err) {

    console.log(err);

  }
};

  // ================= UI =================

  return (

    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <h1 className="logo">
          🍔 FoodieHub
        </h1>

        <div className="nav-right">

          <p>Home</p>
          <p>Menu</p>
          <p>Offers</p>
          <p>Contact</p>

          {/* LOGIN / LOGOUT */}

          {user ? (

            <button
              className="login-btn"
              onClick={() => {

                localStorage.removeItem("token");

                localStorage.removeItem("user");

                setUser(null);
              }}
            >
              Logout
            </button>

          ) : (

            <button
              className="login-btn"
              onClick={() =>
                setShowLogin(true)
              }
            >
              Login
            </button>

          )}

          {/* CART */}

          <div
            className="cart-box"
            onClick={() =>
              setShowCart(true)
            }
          >
            🛒 {cart.length}
          </div>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero">

  <div className="overlay">

    <div className="hero-content">

      <h1 className="hero-title">
        Delicious Food Delivered Fast
      </h1>

      <p className="hero-subtitle">
        Fresh meals at your doorstep
      </p>

      <button className="hero-btn">
        Explore Menu
      </button>

    </div>

  </div>

</section>
      {/* ================= SEARCH ================= */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ================= CATEGORIES ================= */}

      <div className="categories">

        <button
          onClick={() =>
            setCategory("All")
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setCategory("Pizza")
          }
        >
          Pizza
        </button>

        <button
          onClick={() =>
            setCategory("Burger")
          }
        >
          Burger
        </button>

        <button
          onClick={() =>
            setCategory("Biryani")
          }
        >
          Biryani
        </button>

        <button
          onClick={() =>
            setCategory("Drinks")
          }
        >
          Drinks
        </button>

      </div>

      {/* ================= FOODS ================= */}

      <section className="foods-section">

        <h2>
          Popular Dishes
        </h2>

        <div className="food-grid">

          {foods

            .filter((food) => {

              const matchesSearch =
                food.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  );

              const matchesCategory =

                category === "All" ||

                food.category
                  ?.toLowerCase() ===
                category.toLowerCase();

              return (
                matchesSearch &&
                matchesCategory
              );
            })

            .map((food) => (

              <div
                className="food-card"
                key={food._id}
              >

                <div className="image-container">

                  <img
                    src={food.image}
                    alt={food.name}
                  />

                  <span className="offer-badge">
                    20% OFF
                  </span>

                </div>

                <div className="food-info">

                  <h3>
                    {food.name}
                  </h3>

                  <p className="desc">
                    Fresh and delicious meal
                  </p>

                  <div className="rating">
                    ⭐⭐⭐⭐☆
                  </div>

                  <div className="bottom">

                    <p className="price">
                      ₹{food.price}
                    </p>

                    <button
                      onClick={() =>
                        addToCart(food)
                      }
                    >
                      Add
                    </button>

                  </div>

                </div>

              </div>

            ))}

        </div>

      </section>

      {/* ================= CART ================= */}

      <div
        className={`cart-sidebar ${
          showCart ? "active" : ""
        }`}
      >

        <div className="cart-header">

          <h2>Your Cart</h2>

          <button
            onClick={() =>
              setShowCart(false)
            }
          >
            X
          </button>

        </div>

        {cart.length === 0 ? (

          <p className="empty-cart">
            Cart is Empty
          </p>

        ) : (

          cart.map((item) => (

            <div
              className="cart-item"
              key={item._id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-info">

                <h4>{item.name}</h4>

                <p>
                  ₹{item.price}
                </p>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item._id
                      )
                    }
                  >
                    -
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item._id
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          ))
        )}

        <div className="cart-total">

          <h2>
            Total: ₹{total}
          </h2>

          <button
            className="checkout-btn"
            onClick={() =>
              setShowPayment(true)
            }
          >
            Checkout
          </button>

        </div>

      </div>

      {/* ================= LOGIN MODAL ================= */}

      {showLogin && (

        <div className="modal-overlay">

          <div className="auth-modal">

            <h2>

              {isSignup
                ? "Create Account"
                : "Login"}

            </h2>

            <form onSubmit={handleSubmit}>

              {isSignup && (

                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  required
                />

              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <button type="submit">

                {isSignup
                  ? "Signup"
                  : "Login"}

              </button>

            </form>

            <p
              className="switch-auth"
              onClick={() =>
                setIsSignup(!isSignup)
              }
            >

              {isSignup

                ? "Already have account? Login"

                : "New user? Signup"}

            </p>

            <button
              className="close-btn"
              onClick={() =>
                setShowLogin(false)
              }
            >
              X
            </button>

          </div>

        </div>

      )}

      {/* ================= PAYMENT MODAL ================= */}

    {/* ================= PAYMENT MODAL ================= */}

{showPayment && (
  <div className="payment-overlay">

    <div className="payment-modal">

      <h2>Confirm Payment</h2>

      <h3>Total: ₹{totalPrice}</h3>

      <button
        className="pay-btn"
        onClick={handlePayment}
      >
        Pay with Razorpay
      </button>

      <button
        className="cancel-btn"
        onClick={() => setShowPayment(false)}
      >
        Cancel
      </button>

    </div>

  </div>
)}
</div>
);
}
