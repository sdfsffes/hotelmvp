// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";

export default function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
    todayBookings: 0,
    weekBookings: 0,
    monthBookings: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      loadNotifications();
      loadRecentActivity();
    }
  }, [isAuthenticated]);

  const loadRequests = () => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    
    const sorted = allRequests.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    setRequests(sorted);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const pending = allRequests.filter(r => r.status === "pending").length;
    const confirmed = allRequests.filter(r => r.status === "confirmed").length;
    const cancelled = allRequests.filter(r => r.status === "cancelled").length;
    
    const todayBookings = allRequests.filter(r => 
      new Date(r.createdAt) >= today && r.status === "confirmed"
    ).length;
    
    const weekBookings = allRequests.filter(r => 
      new Date(r.createdAt) >= weekAgo && r.status === "confirmed"
    ).length;
    
    const monthBookings = allRequests.filter(r => 
      new Date(r.createdAt) >= monthAgo && r.status === "confirmed"
    ).length;

    setStats({
      total: allRequests.length,
      pending,
      confirmed,
      cancelled,
      totalRevenue: confirmed * 1500,
      todayBookings,
      weekBookings,
      monthBookings
    });
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem("admin_notifications");
    setNotifications(stored ? JSON.parse(stored) : []);
  };

  const loadRecentActivity = () => {
    const stored = localStorage.getItem("admin_activity");
    setRecentActivity(stored ? JSON.parse(stored) : []);
  };

  const addActivity = (action, details) => {
    const activity = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [activity, ...recentActivity].slice(0, 20);
    setRecentActivity(updated);
    localStorage.setItem("admin_activity", JSON.stringify(updated));
  };

  const updateStatus = (requestId, newStatus) => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    const index = allRequests.findIndex(r => r.requestId === requestId);
    
    if (index !== -1) {
      allRequests[index].status = newStatus;
      allRequests[index].updatedAt = new Date().toISOString();
      localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
      loadRequests();
      
      addActivity('status_change', {
        requestId,
        newStatus,
        serviceTitle: allRequests[index].service.title
      });
      
      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest({...allRequests[index]});
      }
    }
  };

  const updateRequest = () => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    const index = allRequests.findIndex(r => r.requestId === selectedRequest.requestId);
    
    if (index !== -1) {
      allRequests[index] = { ...allRequests[index], ...editData };
      allRequests[index].updatedAt = new Date().toISOString();
      localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
      loadRequests();
      setSelectedRequest({ ...allRequests[index] });
      setShowEditModal(false);
      
      addActivity('edit_request', {
        requestId: selectedRequest.requestId,
        serviceTitle: allRequests[index].service.title
      });
    }
  };

  const deleteRequest = (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const stored = localStorage.getItem("hotel_requests");
      const allRequests = stored ? JSON.parse(stored) : [];
      const filtered = allRequests.filter(r => r.requestId !== requestId);
      localStorage.setItem("hotel_requests", JSON.stringify(filtered));
      loadRequests();
      
      addActivity('delete_request', { requestId });
      
      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest(null);
      }
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = searchTerm === "" || 
      r.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.service?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return "⏳";
      case "confirmed": return "✅";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "pending": return "Pending";
      case "confirmed": return "Confirmed";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Если не авторизован - показываем экран входа
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-700 to-amber-900 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-sm opacity-90">Manage your hotel bookings and reservations</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <span className="text-xl">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                onClose();
              }}
              className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition text-sm"
            >
              🚪 Logout
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl transition">✕</button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 bg-gray-50">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Requests</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-yellow-500">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-green-500">
            <div className="text-2xl mb-1">✅</div>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            <p className="text-xs text-gray-500">Confirmed</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-red-500">
            <div className="text-2xl mb-1">❌</div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-amber-500">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-2xl font-bold text-amber-600">฿{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl mb-1">📅</div>
            <p className="text-2xl font-bold text-blue-600">{stats.todayBookings}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border-l-4 border-purple-500">
            <div className="text-2xl mb-1">📈</div>
            <p className="text-2xl font-bold text-purple-600">{stats.weekBookings}</p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">🔄 Recent Activity:</span>
            {recentActivity.slice(0, 3).map((activity, idx) => (
              <span key={idx} className="bg-white px-2 py-1 rounded-full text-xs shadow-sm">
                {activity.details.serviceTitle || 'Request'} {activity.action}
              </span>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === "all" 
                  ? "bg-amber-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📋 All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === "pending" 
                  ? "bg-yellow-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ⏳ Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === "confirmed" 
                  ? "bg-green-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ✅ Confirmed ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === "cancelled" 
                  ? "bg-red-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ❌ Cancelled ({stats.cancelled})
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 Search by code, name, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-amber-500 outline-none w-64"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Requests List */}
          <div className="w-full md:w-1/2 border-r p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Recent Requests</h3>
              <span className="text-xs text-gray-400">{filteredRequests.length} items</span>
            </div>
            {filteredRequests.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No requests found</p>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.requestId}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    selectedRequest?.requestId === request.requestId
                      ? "border-amber-400 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{request.service?.icon || "🏨"}</span>
                      <div>
                        <p className="font-mono text-sm font-bold text-amber-600">
                          {request.bookingCode}
                        </p>
                        <p className="font-semibold text-gray-800 text-sm">{request.service?.title}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(request.status)}`}>
                      <span>{getStatusIcon(request.status)}</span>
                      <span>{getStatusText(request.status)}</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>👤 {request.customer?.name}</p>
                    <p>📅 {new Date(request.booking?.date).toLocaleDateString()}</p>
                    <p>🚪 Room {request.roomNumber}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Request Details */}
          <div className="w-full md:w-1/2 p-4">
            {selectedRequest ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">Request Details</h3>
                  <button
                    onClick={() => deleteRequest(selectedRequest.requestId)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  {selectedRequest.status !== "confirmed" && (
                    <button
                      onClick={() => updateStatus(selectedRequest.requestId, "confirmed")}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-1"
                    >
                      ✅ Accept
                    </button>
                  )}
                  {selectedRequest.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(selectedRequest.requestId, "cancelled")}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-1"
                    >
                      ❌ Decline
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditData(selectedRequest);
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                </div>

                {/* Info Cards */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Booking Code</p>
                  <p className="text-2xl font-bold text-amber-600 font-mono">{selectedRequest.bookingCode}</p>
                  <p className="text-xs text-gray-400 mt-1">Created: {formatDate(selectedRequest.createdAt)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-semibold">{selectedRequest.customer?.name}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.customer?.email}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.customer?.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Booking Details</p>
                    <p className="font-semibold">{selectedRequest.service?.title}</p>
                    <p className="text-sm text-gray-600">📅 {new Date(selectedRequest.booking?.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">🚪 Room {selectedRequest.roomNumber}</p>
                    <p className="text-sm text-gray-600">👥 {selectedRequest.booking?.guests} guests</p>
                  </div>
                </div>

                {selectedRequest.booking?.message && (
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Special Requests</p>
                    <p className="text-sm text-gray-700">{selectedRequest.booking.message}</p>
                  </div>
                )}

                <div className="border-t pt-3 text-xs text-gray-400">
                  <p>Status updated: {selectedRequest.updatedAt ? formatDate(selectedRequest.updatedAt) : 'Never'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16">
                <div className="text-6xl mb-4">📋</div>
                <p>Select a request to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Edit Request</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editData.customer?.name || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editData.customer?.email || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editData.customer?.phone || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editData.roomNumber || ""}
                    onChange={(e) => setEditData({ ...editData, roomNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editData.booking?.date || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      booking: { ...editData.booking, date: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={updateRequest} className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600">Save Changes</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Popup */}
        {showNotifications && (
          <div className="absolute top-20 right-20 w-80 bg-white rounded-2xl shadow-2xl border p-4 z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold">Notifications</h4>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No notifications</p>
            ) : (
              notifications.map((n, idx) => (
                <div key={idx} className="border-b last:border-0 py-2 text-sm">
                  <p className="text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400">{formatDate(n.timestamp)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}