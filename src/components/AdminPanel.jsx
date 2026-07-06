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
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: 0
  });
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = [
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/2609221/pexels-photo-2609221.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?w=1920&h=1080&fit=crop"
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadRequests = () => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    setRequests(allRequests.reverse());
    
    const pending = allRequests.filter(r => r.status === "pending").length;
    const confirmed = allRequests.filter(r => r.status === "confirmed").length;
    const cancelled = allRequests.filter(r => r.status === "cancelled").length;
    
    setStats({
      total: allRequests.length,
      pending,
      confirmed,
      cancelled,
      revenue: confirmed * 1500
    });
  };

  const updateStatus = (requestId, newStatus) => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    const index = allRequests.findIndex(r => r.requestId === requestId);
    
    if (index !== -1) {
      allRequests[index].status = newStatus;
      localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
      loadRequests();
      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest({...allRequests[index]});
      }
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

  const updateRequest = () => {
    const stored = localStorage.getItem("hotel_requests");
    const allRequests = stored ? JSON.parse(stored) : [];
    const index = allRequests.findIndex(r => r.requestId === selectedRequest.requestId);
    
    if (index !== -1) {
      allRequests[index] = { ...allRequests[index], ...editData };
      localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
      loadRequests();
      setSelectedRequest({ ...allRequests[index] });
      setShowEditModal(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = searchTerm === "" || 
      r.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/20";
      case "confirmed": return "bg-green-500/20 text-green-300 border-green-500/20";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/20";
      default: return "bg-white/10 text-white/70 border-white/10";
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

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Фоновый слайдер */}
      <div className="absolute inset-0 transition-all duration-1000">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: index === bgIndex ? 1 : 0
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-7xl text-amber-400/10 animate-float">✦</div>
        <div className="absolute bottom-10 right-10 text-7xl text-amber-400/10 animate-float-delayed">✦</div>
        <div className="absolute top-1/2 left-1/4 text-8xl text-white/5 animate-pulse-slow">★</div>
        <div className="absolute bottom-1/3 right-1/4 text-7xl text-white/5 animate-spin-slow">☀️</div>
        
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Главная панель */}
      <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur-xl animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-serif font-bold text-white">M</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Admin Dashboard</h2>
              <p className="text-sm text-white/50">Manage your hotel bookings & reservations</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white/60 hover:text-white text-xl hover:scale-110 hover:rotate-90"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 p-6">
          {[
            { label: "Total", value: stats.total, color: "text-white", border: "border-white/10" },
            { label: "Pending", value: stats.pending, color: "text-yellow-300", border: "border-yellow-500/20" },
            { label: "Confirmed", value: stats.confirmed, color: "text-green-300", border: "border-green-500/20" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red-300", border: "border-red-500/20" },
            { label: "Revenue", value: `฿${stats.revenue.toLocaleString()}`, color: "text-amber-300", border: "border-amber-500/20" }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border ${stat.border} hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group animate-fadeInUp`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap gap-2 items-center">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "confirmed", label: "Confirmed" },
            { id: "cancelled", label: "Cancelled" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wider ${
                filter === f.id 
                  ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30 scale-105" 
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search by code, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/40 ml-auto w-64"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Requests List */}
          <div className="w-full md:w-1/2 border-r border-white/10 p-4 space-y-2 max-h-[50vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white/80 uppercase tracking-wider text-sm">Recent Requests</h3>
              <span className="text-xs text-white/40">{filteredRequests.length} items</span>
            </div>
            {filteredRequests.length === 0 ? (
              <p className="text-center text-white/40 py-8">No requests found</p>
            ) : (
              filteredRequests.map((request, idx) => (
                <div
                  key={request.requestId}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-500 backdrop-blur-sm animate-fadeInUp ${
                    selectedRequest?.requestId === request.requestId
                      ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-[1.01]"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-mono text-sm font-bold text-amber-300">{request.bookingCode}</p>
                      <p className="font-medium text-white text-sm">{request.service?.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 space-y-1">
                    <p>Guest: {request.customer?.name}</p>
                    <p>Date: {new Date(request.booking?.date).toLocaleDateString()}</p>
                    <p>Room: {request.roomNumber}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-4">
            {selectedRequest ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-serif font-bold text-white">Request Details</h3>
                  <button
                    onClick={() => deleteRequest(selectedRequest.requestId)}
                    className="text-red-400 hover:text-red-300 text-sm transition-all hover:scale-110"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex gap-2">
                  {selectedRequest.status !== "confirmed" && (
                    <button
                      onClick={() => updateStatus(selectedRequest.requestId, "confirmed")}
                      className="flex-1 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/20 hover:scale-105 font-medium"
                    >
                      Accept
                    </button>
                  )}
                  {selectedRequest.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(selectedRequest.requestId, "cancelled")}
                      className="flex-1 bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/20 hover:scale-105 font-medium"
                    >
                      Decline
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditData(selectedRequest);
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500/80 to-blue-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 font-medium"
                  >
                    Edit
                  </button>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-amber-700/20 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/20">
                  <p className="text-xs text-amber-300/60 uppercase tracking-wider">Booking Code</p>
                  <p className="text-2xl font-bold text-amber-300 font-mono tracking-wider">{selectedRequest.bookingCode}</p>
                  <p className="text-xs text-amber-300/40 mt-1">Created: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Guest</p>
                    <p className="font-medium text-white mt-1">{selectedRequest.customer?.name}</p>
                    <p className="text-sm text-white/50">{selectedRequest.customer?.email}</p>
                    <p className="text-sm text-white/50">{selectedRequest.customer?.phone}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Booking</p>
                    <p className="font-medium text-white mt-1">{selectedRequest.service?.title}</p>
                    <p className="text-sm text-white/50">Date: {new Date(selectedRequest.booking?.date).toLocaleDateString()}</p>
                    <p className="text-sm text-white/50">Room: {selectedRequest.roomNumber}</p>
                    <p className="text-sm text-white/50">Guests: {selectedRequest.booking?.guests}</p>
                  </div>
                </div>

                {selectedRequest.booking?.message && (
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20">
                    <p className="text-xs text-blue-300/60 uppercase tracking-wider">Special Requests</p>
                    <p className="text-sm text-white/80">{selectedRequest.booking.message}</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 text-xs text-white/30">
                  <p>Status updated: {selectedRequest.updatedAt ? new Date(selectedRequest.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/30 py-16">
                <div className="text-6xl font-serif mb-4">📋</div>
                <p className="text-lg">Select a request to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">Edit Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Guest Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer?.name || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer?.email || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Phone</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer?.phone || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      customer: { ...editData.customer, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Room Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.roomNumber || ""}
                    onChange={(e) => setEditData({ ...editData, roomNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.booking?.date || ""}
                    onChange={(e) => setEditData({
                      ...editData,
                      booking: { ...editData.booking, date: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={updateRequest} 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-700 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:scale-105"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="flex-1 bg-white/10 text-white/60 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}