import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you use react-router

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
          withCredentials: true
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // Helper to calculate progress bar width based on status
  const getProgressPercentage = (status) => {
    switch(status) {
      case 'Pending Approval': return '10%';
      case 'Approved': return '30%';
      case 'Processing': return '50%';
      case 'Shipped': return '75%';
      case 'Delivered': return '100%';
      case 'Cancelled': return '100%'; // Full bar but red
      default: return '0%';
    }
  };

  // Helper for progress bar color
  const getProgressColor = (status) => {
    return status === 'Cancelled' ? '#ef4444' : '#10b981'; // Red if cancelled, Green otherwise
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh', padding: '30px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'normal', color: '#0f1111' }}>Your Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
            <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg" alt="Empty Orders" style={{ height: '150px', marginBottom: '20px' }} />
            <h2>Looks like you haven't placed an order yet</h2>
            <Link to="/" style={{ color: '#007185', textDecoration: 'none', fontWeight: 'bold' }}>Start shopping</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={{ backgroundColor: '#fff', border: '1px solid #d5d9d9', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
              
              {/* === AMAZON STYLE HEADER === */}
              <div style={{ backgroundColor: '#f0f2f2', borderBottom: '1px solid #d5d9d9', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '14px', color: '#565959' }}>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '12px' }}>Order Placed</div>
                    <div style={{ color: '#0f1111' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '12px' }}>Total</div>
                    <div style={{ color: '#0f1111' }}>₹{order.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '12px' }}>Ship To</div>
                    <div style={{ color: '#007185', cursor: 'pointer' }}>{order.shippingAddress?.name || "Customer"}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ textTransform: 'uppercase', fontSize: '12px' }}>Order # {order._id.substring(order._id.length - 10).toUpperCase()}</div>
                  <div style={{ color: '#007185', cursor: 'pointer', marginTop: '2px' }}>View order details</div>
                </div>
              </div>

              {/* === CARD BODY === */}
              <div style={{ padding: '20px' }}>
                
                {/* Status Header */}
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: order.status === 'Cancelled' ? '#c40000' : '#0f1111' }}>
                  {order.status === 'Delivered' ? 'Delivered successfully' : 
                   order.status === 'Cancelled' ? 'Order Cancelled' : 
                   `Arriving soon: ${order.status}`}
                </h3>

                {/* === FLIPKART STYLE PROGRESS BAR === */}
                <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px', marginBottom: '25px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: getProgressColor(order.status), 
                    width: getProgressPercentage(order.status),
                    transition: 'width 0.5s ease-in-out'
                  }}></div>
                </div>

                {/* Items List */}
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: '20px', gap: '20px', alignItems: 'flex-start' }}>
                    
                    {/* Product Image */}
                    <div style={{ width: '90px', height: '90px', flexShrink: 0, backgroundColor: '#f7f7f7', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    
                    {/* Product Details */}
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ color: '#007185', fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: '#565959', marginBottom: '5px' }}>Return window closed</div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button style={{ padding: '6px 12px', backgroundColor: '#ffd814', border: 'none', borderRadius: '100px', fontSize: '13px', cursor: 'pointer', color: '#0f1111', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                          Buy it again
                        </button>
                        <button style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #d5d9d9', borderRadius: '100px', fontSize: '13px', cursor: 'pointer', color: '#0f1111', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                          View your item
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Panel (Right Side) */}
                    <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button style={{ padding: '8px', backgroundColor: '#fff', border: '1px solid #d5d9d9', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#0f1111', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                        Track package
                      </button>
                      <button style={{ padding: '8px', backgroundColor: '#fff', border: '1px solid #d5d9d9', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#0f1111', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                        Write a product review
                      </button>
                    </div>

                  </div>
                ))}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserOrders;