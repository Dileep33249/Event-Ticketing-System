import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    userName: "",
    userEmail: "",
  });
  const [myEventIds, setMyEventIds] = useState(new Set());
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    fromDate: "",
    toDate: "",
    location: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await api.get(`/events${params.toString() ? `?${params.toString()}` : ""}`);
      setEvents(res.data);
    };
    fetchEvents();
  }, [filters]);

  useEffect(() => {
    api.get(`/bookings/my`).then((res) => {
      const ids = new Set((res.data || []).map((b) => b.eventId && b.eventId._id).filter(Boolean));
      setMyEventIds(ids);
    }).catch(() => {});
  }, []);

  const handleBookTicket = async () => {
    if (!bookingDetails.userName || !bookingDetails.userEmail) {
      toast.error("Please fill in all fields!");
      return;
    }
    try {
      await api.post(`/bookings/${selectedEvent._id}`);
      toast.success("Ticket booked successfully!");
      setSelectedEvent(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Booking failed";
      toast.error(msg);
    }
  };

  return (
    <div id="search-events" className="min-h-[50vh] bg-[#1f1f1f] p-6 flex flex-col items-center text-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-bold text-purple-400 text-center mb-8">Search & Book Events</h1>
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          placeholder="Search by name/desc"
          className="border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 transition"
        />
        <select
          name="category"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
          <option value="Art">Art</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
          className="border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
          className="border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          placeholder="Location"
          className="border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 transition"
        />
        <div className="md:col-span-5 flex gap-4 mt-2">
          <button type="button" className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition" onClick={() => setFilters({ search: "", category: "", fromDate: "", toDate: "", location: "" })}>Clear</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-[#2e2e2e] p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <h3 className="text-2xl font-semibold text-purple-300 mb-2">{event.name}</h3>
              <p className="text-gray-300 mb-1">📅 Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-400 mb-2">{event.description}</p>
              <p className="text-gray-400 mb-2">Category: {event.category || "N/A"}</p>
              <p className="text-gray-400 mb-2">Location: {event.location || "N/A"}</p>
              <p className="text-gray-400 mb-2">Price: {event.price ? `₹${event.price}` : "Free"}</p>
              <p className="text-gray-400 mb-2">
                {typeof event.bookedCount === 'number' && typeof event.capacity === 'number' ? `Capacity: ${event.bookedCount}/{event.capacity}` : null}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No events available at the moment.</p>
        )}
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Book Ticket for {selectedEvent.name}
            </h2>
            <input
              type="text"
              placeholder="Your Name"
              value={bookingDetails.userName}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, userName: e.target.value })
              }
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={bookingDetails.userEmail}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, userEmail: e.target.value })
              }
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={handleBookTicket}
                disabled={
                  (selectedEvent && typeof selectedEvent.capacity === 'number' && typeof selectedEvent.bookedCount === 'number' && selectedEvent.bookedCount >= selectedEvent.capacity)
                  || (selectedEvent && myEventIds.has(selectedEvent._id))
                }
                className={`px-6 py-2 rounded-lg transition text-white ${
                  (selectedEvent && typeof selectedEvent.capacity === 'number' && typeof selectedEvent.bookedCount === 'number' && selectedEvent.bookedCount >= selectedEvent.capacity)
                    || (selectedEvent && myEventIds.has(selectedEvent._id))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {selectedEvent && myEventIds.has(selectedEvent._id) ? 'Already Booked' : 'Book Ticket'}
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
               Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEvents;