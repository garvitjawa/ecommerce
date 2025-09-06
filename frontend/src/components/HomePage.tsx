import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const handleAddToCart = async (productIndex: number) => {
    try {
      const product = products[productIndex];
      await addToCart(productIndex.toString());
      toast.success(`${product?.name || 'Product'} added to cart! 🛒`);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add product to cart. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>🛍️ E-Commerce Store</h1>
          <div className="user-info">
            <Link to="/cart" className="cart-button">
              🛒 Cart
            </Link>
            <span>Welcome, {user?.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="products-section">
          <h2>Our Products</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(index)}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
