// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import { supabase } from "../utils/supabase";

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
  const [isLoading, setIsLoading] = useState(true);
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
      loadNotifications();
      loadRecentActivity();
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validRequests = data?.filter(r => 
        r.request_id && 
        !r.request_id.includes('invalid') && 
        r.booking_code
      ) || [];

      if (validRequests.length > 0) {
        const uniqueRequests = [];
        const seenCodes = new Set();
        validRequests.forEach(r => {
          if (!seenCodes.has(r.booking_code)) {
            seenCodes.add(r.booking_code);
            uniqueRequests.push(r);
          }
        });
        
        setRequests(uniqueRequests);
        updateStats(uniqueRequests);
        localStorage.setItem("hotel_requests", JSON.stringify(uniqueRequests));
      } else {
        const stored = localStorage.getItem("hotel_requests");
        const allRequests = stored ? JSON.parse(stored) : [];
        const validLocal = allRequests.filter(r => 
          r.request_id && 
          !r.request_id.includes('invalid') && 
          r.booking_code
        );
        
        const uniqueLocal = [];
        const seenCodes = new Set();
        validLocal.forEach(r => {
          if (!seenCodes.has(r.booking_code)) {
            seenCodes.add(r.booking_code);
            uniqueLocal.push(r);
          }
        });
        
        setRequests(uniqueLocal);
        updateStats(uniqueLocal);
        localStorage.setItem("hotel_requests", JSON.stringify(uniqueLocal));
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      const stored = localStorage.getItem("hotel_requests");
      const allRequests = stored ? JSON.parse(stored) : [];
      const validLocal = allRequests.filter(r => 
        r.request_id && 
        !r.request_id.includes('invalid') && 
        r.booking_code
      );
      
      const uniqueLocal = [];
      const seenCodes = new Set();
      validLocal.forEach(r => {
        if (!seenCodes.has(r.booking_code)) {
          seenCodes.add(r.booking_code);
          uniqueLocal.push(r);
        }
      });
      
      setRequests(uniqueLocal);
      updateStats(uniqueLocal);
      localStorage.setItem("hotel_requests", JSON.stringify(uniqueLocal));
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (allRequests) => {
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
      new Date(r.created_at || r.createdAt) >= today && r.status === "confirmed"
    ).length;
    
    const weekBookings = allRequests.filter(r => 
      new Date(r.created_at || r.createdAt) >= weekAgo && r.status === "confirmed"
    ).length;
    
    const monthBookings = allRequests.filter(r => 
      new Date(r.created_at || r.createdAt) >= monthAgo && r.status === "confirmed"
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

  const updateStatus = async (requestId, newStatus) => {
    if (!requestId) return;
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('request_id', requestId)
        .select();

      if (error) throw error;

      await loadRequests();
      addActivity('status_change', {
        requestId,
        newStatus,
        serviceTitle: data?.[0]?.service_title || 'Service'
      });
      
      if (selectedRequest?.request_id === requestId) {
        setSelectedRequest({...data[0]});
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const stored = localStorage.getItem("hotel_requests");
      const allRequests = stored ? JSON.parse(stored) : [];
      const index = allRequests.findIndex(r => r.request_id === requestId);
      if (index !== -1) {
        allRequests[index].status = newStatus;
        localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
        await loadRequests();
        if (selectedRequest?.request_id === requestId) {
          setSelectedRequest({...allRequests[index]});
        }
      }
    }
  };

  const deleteRequest = async (requestId) => {
    if (!requestId) {
      console.error('❌ No request ID provided');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('request_id', requestId);

      if (error) {
        console.error('❌ Supabase delete error:', error);
      } else {
        console.log('✅ Request deleted successfully from Supabase');
      }

      const updatedRequests = requests.filter(r => r.request_id !== requestId);
      setRequests(updatedRequests);
      updateStats(updatedRequests);
      localStorage.setItem("hotel_requests", JSON.stringify(updatedRequests));

      if (selectedRequest?.request_id === requestId) {
        setSelectedRequest(null);
      }
      
      addActivity('delete_request', { requestId });
      
    } catch (error) {
      console.error('❌ Error deleting request:', error);
      alert('Ошибка при удалении: ' + error.message);
    }
  };

  const updateRequest = async () => {
    if (!selectedRequest?.request_id) return;
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({
          customer_name: editData.customer_name,
          customer_email: editData.customer_email,
          customer_phone: editData.customer_phone,
          room_number: editData.room_number,
          booking_date: editData.booking_date,
          updated_at: new Date().toISOString()
        })
        .eq('request_id', selectedRequest.request_id)
        .select();

      if (error) throw error;

      await loadRequests();
      setSelectedRequest({ ...data[0] });
      setShowEditModal(false);
      addActivity('edit_request', {
        requestId: selectedRequest.request_id,
        serviceTitle: data?.[0]?.service_title || 'Service'
      });
    } catch (error) {
      console.error('Error updating request:', error);
      const stored = localStorage.getItem("hotel_requests");
      const allRequests = stored ? JSON.parse(stored) : [];
      const index = allRequests.findIndex(r => r.request_id === selectedRequest.request_id);
      if (index !== -1) {
        allRequests[index] = { ...allRequests[index], ...editData };
        localStorage.setItem("hotel_requests", JSON.stringify(allRequests));
        await loadRequests();
        setSelectedRequest({ ...allRequests[index] });
        setShowEditModal(false);
      }
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = searchTerm === "" || 
      r.booking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.service_title?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
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

      <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur-xl animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Admin Dashboard</h2>
              <p className="text-sm text-white/50">Manage your hotel bookings &amp; reservations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <span className="text-xl">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                onClose();
              }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 text-sm font-medium flex items-center gap-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-xl hover:scale-110 hover:rotate-90"
            >
              ✕
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Loading requests...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3 p-4">
              {[
                { label: "Total", value: stats.total, color: "text-white" },
                { label: "Pending", value: stats.pending, color: "text-yellow-300" },
                { label: "Confirmed", value: stats.confirmed, color: "text-green-300" },
                { label: "Cancelled", value: stats.cancelled, color: "text-red-300" },
                { label: "Revenue", value: `฿${stats.totalRevenue.toLocaleString()}`, color: "text-amber-300" },
                { label: "Today", value: stats.todayBookings, color: "text-blue-300" },
                { label: "This Week", value: stats.weekBookings, color: "text-purple-300" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="font-medium text-amber-300/80">🔄 Recent Activity:</span>
                {recentActivity.slice(0, 3).map((activity, idx) => (
                  <span key={idx} className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                    {activity.details.serviceTitle || 'Request'} {activity.action}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 border-b border-white/10 flex flex-wrap gap-2 items-center">
              {[
                { id: "all", label: "📋 All" },
                { id: "pending", label: "⏳ Pending" },
                { id: "confirmed", label: "✅ Confirmed" },
                { id: "cancelled", label: "❌ Cancelled" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
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
                placeholder="🔍 Search by code, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/40 ml-auto w-64"
              />
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 border-r border-white/10 p-4 space-y-2 max-h-[50vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-white/80 uppercase tracking-wider text-sm">Recent Requests</h3>
                  <span className="text-xs text-white/40">{filteredRequests.length} items</span>
                </div>
                {filteredRequests.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No requests found</p>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request.request_id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-500 backdrop-blur-sm ${
                        selectedRequest?.request_id === request.request_id
                          ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-[1.02]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono text-sm font-bold text-amber-300">{request.booking_code}</p>
                          <p className="font-medium text-white text-sm">{request.service_title || 'Service'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <div className="text-xs text-white/50 space-y-1">
                        <p>👤 {request.customer_name}</p>
                        <p>📅 {new Date(request.booking_date).toLocaleDateString()}</p>
                        <p>🚪 Room {request.room_number}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="w-full md:w-1/2 p-4">
                {selectedRequest ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-bold text-white">Request Details</h3>
                      <button
                        onClick={() => deleteRequest(selectedRequest.request_id)}
                        className="text-red-400 hover:text-red-300 text-sm transition-all hover:scale-110"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {selectedRequest.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(selectedRequest.request_id, "confirmed")}
                          className="flex-1 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/20 hover:scale-105 font-medium"
                        >
                          ✅ Accept
                        </button>
                      )}
                      {selectedRequest.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(selectedRequest.request_id, "cancelled")}
                          className="flex-1 bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/20 hover:scale-105 font-medium"
                        >
                          ❌ Decline
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditData({
                            customer_name: selectedRequest.customer_name,
                            customer_email: selectedRequest.customer_email,
                            customer_phone: selectedRequest.customer_phone,
                            room_number: selectedRequest.room_number,
                            booking_date: selectedRequest.booking_date
                          });
                          setShowEditModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500/80 to-blue-600/80 backdrop-blur-sm text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 font-medium"
                      >
                        ✏️ Edit
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-700/20 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/20">
                      <p className="text-xs text-amber-300/60 uppercase tracking-wider">Booking Code</p>
                      <p className="text-2xl font-bold text-amber-300 font-mono tracking-wider">{selectedRequest.booking_code}</p>
                      <p className="text-xs text-amber-300/40 mt-1">Created: {formatDate(selectedRequest.created_at)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Guest</p>
                        <p className="font-medium text-white mt-1">{selectedRequest.customer_name}</p>
                        <p className="text-sm text-white/50">{selectedRequest.customer_email}</p>
                        <p className="text-sm text-white/50">{selectedRequest.customer_phone}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Booking</p>
                        <p className="font-medium text-white mt-1">{selectedRequest.service_title || 'Service'}</p>
                        <p className="text-sm text-white/50">📅 {new Date(selectedRequest.booking_date).toLocaleDateString()}</p>
                        <p className="text-sm text-white/50">🚪 Room {selectedRequest.room_number}</p>
                        <p className="text-sm text-white/50">👥 {selectedRequest.guests} guests</p>
                      </div>
                    </div>

                    {selectedRequest.message && (
                      <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20">
                        <p className="text-xs text-blue-300/60 uppercase tracking-wider">Special Requests</p>
                        <p className="text-sm text-white/80">{selectedRequest.message}</p>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-3 text-xs text-white/30">
                      <p>Status updated: {selectedRequest.updated_at ? formatDate(selectedRequest.updated_at) : 'Never'}</p>
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
          </>
        )}

        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">✏️ Edit Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Guest Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer_name || ''}
                    onChange={(e) => setEditData({ ...editData, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer_email || ''}
                    onChange={(e) => setEditData({ ...editData, customer_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Phone</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.customer_phone || ''}
                    onChange={(e) => setEditData({ ...editData, customer_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Room Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.room_number || ''}
                    onChange={(e) => setEditData({ ...editData, room_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-white placeholder-white/30"
                    value={editData.booking_date || ''}
                    onChange={(e) => setEditData({ ...editData, booking_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={updateRequest} 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-700 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:scale-105"
                >
                  💾 Save Changes
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

        {showNotifications && (
          <div className="absolute top-20 right-20 w-80 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-4 z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white">🔔 Notifications</h4>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-white/40 hover:text-white/60 transition"
              >
                ✕
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-center text-white/40 py-4">No notifications</p>
            ) : (
              notifications.map((n, idx) => (
                <div key={idx} className="border-b border-white/10 last:border-0 py-2 text-sm">
                  <p className="text-white/80">{n.message}</p>
                  <p className="text-xs text-white/40 mt-1">{formatDate(n.timestamp)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}