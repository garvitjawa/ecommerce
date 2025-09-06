import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';


const CartPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const { cartItems, loading, error, removeFromCart } = useCart();

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const productIndex = parseInt(productId);
      const product = getProductByIndex(productIndex);
      
      await removeFromCart(productId);
      toast.success(`${product?.name || 'Product'} removed from cart! 🗑️`);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      toast.error('Failed to remove product from cart. Please try again.');
    }
  };

  const getProductByIndex = (productIndex: number) => {
    return products[productIndex];
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => {
      const productIndex = parseInt(item.productId);
      const product = getProductByIndex(productIndex);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="back-button">
              ← Back to Store
            </Link>
            <h1>🛒 Shopping Cart</h1>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="cart-main">
        <div className="cart-section">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                <h2>Cart Items ({cartItems.length})</h2>
                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const productIndex = parseInt(item.productId);
                    const product = getProductByIndex(productIndex);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="cart-item">
                        <div className="cart-item-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="cart-item-details">
                          <h3>{product.name}</h3>
                          <p className="cart-item-price">${product.price.toFixed(2)} each</p>
                          <div className="cart-item-quantity">
                            <span>Qty: {item.quantity}</span>
                            <button
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="remove-button"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-total">
                          <span>${(product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button className="checkout-button">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
