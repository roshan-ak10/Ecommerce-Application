import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = ['Pending Approval', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const fetchAdminOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin/all`, {
        withCredentials: true
      });
      setAllOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/admin/update/${orderId}`, 
        { status: newStatus },
        { withCredentials: true }
      );
      
      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert(`Order updated to ${newStatus}!`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status.");
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading admin dashboard...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #2874f0', paddingBottom: '10px', color: '#2874f0' }}>
        ⚙️ Admin Order Management
      </h2>
      
      {allOrders.length === 0 ? (
        <p>No orders in the system yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>Order ID</th>
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>Customer Email</th>
                {/* NEW UTR COLUMN */}
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>UTR / Ref No.</th>
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>Total</th>
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '15px 12px', borderBottom: '2px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                  
                  <td style={{ padding: '12px', fontSize: '14px', color: '#555' }}>
                    {order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  
                  <td style={{ padding: '12px' }}>{order.email}</td>
                  
                  {/* NEW UTR CELL */}
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '15px', fontWeight: 'bold', color: '#d32f2f' }}>
                    {order.utrNumber || 'N/A'}
                  </td>
                  
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                  
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: order.status === 'Pending Approval' ? '#fff3cd' : 
                                     order.status === 'Cancelled' ? '#f8d7da' : '#d1e7dd',
                      color: order.status === 'Pending Approval' ? '#856404' : 
                             order.status === 'Cancelled' ? '#721c24' : '#0f5132'
                    }}>
                      {order.status}
                    </span>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc', 
                        cursor: 'pointer',
                        backgroundColor: '#f9f9f9',
                        outline: 'none'
                      }}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;