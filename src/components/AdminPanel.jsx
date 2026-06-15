// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";

export default function AdminPanel({ onClose }) {
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
    totalRevenue: 0
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    setRequests(allRequests.reverse());
    
    // Подсчет статистики
    const pending = allRequests.filter(r => r.status === "pending").length;
    const confirmed = allRequests.filter(r => r.status === "confirmed").length;
    const cancelled = allRequests.filter(r => r.status === "cancelled").length;
    
    setStats({
      total: allRequests.length,
      pending,
      confirmed,
      cancelled,
      totalRevenue: confirmed * 1500 // Примерный расчет
    });
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
    }
  };

  const deleteRequest = (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const stored = localStorage.getItem("hotel_requests");
      const allRequests = stored ? JSON.parse(stored) : [];
      const filtered = allRequests.filter(r => r.requestId !== requestId);
      localStorage.setItem("hotel_requests", JSON.stringify(filtered));
      loadRequests();
      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest(null);
      }
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === "all") return true;
    return r.status === filter;
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🛡️</span> Admin Dashboard
            </h2>
            <p className="text-sm opacity-90">Manage booking requests and reservations</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl transition">✕</button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-4 p-6 bg-gray-50">
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
            <p className="text-xs text-gray-500">Est. Revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
              filter === "all" 
                ? "bg-amber-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📋 All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
              filter === "pending" 
                ? "bg-yellow-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ⏳ Pending
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
              filter === "confirmed" 
                ? "bg-green-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ✅ Confirmed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
              filter === "cancelled" 
                ? "bg-red-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ❌ Cancelled
          </button>
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
                  <p className="text-xs text-gray-400 mt-1">Created: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
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
      </div>
    </div>
  );
}