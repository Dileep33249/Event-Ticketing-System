import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events`).then((res) => {
      const found = res.data.find((e) => e._id === id);
      console.log("Event found:", found);
      console.log("Event image path:", found?.image);
      setEvent(found);
    });
  }, [id]);

  const handleBook = async () => {
    try {
      await api.post(`/bookings/${id}`);
      toast.success("Ticket booked successfully!");
      setBooking(true);
      setTimeout(() => navigate("/PublicEvents"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If the path already starts with http, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // If the path starts with /, add base URL
    if (imagePath.startsWith('/')) return `http://localhost:5000${imagePath}`;
    // Otherwise, add base URL and /
    return `http://localhost:5000/${imagePath}`;
  };

  const isEventFull = typeof event?.capacity === 'number' && typeof event?.bookedCount === 'number' && event.bookedCount >= event.capacity;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Image */}
          {event.image ? (
            <div className="w-full h-80 bg-gray-200">
              <img
                src={getImageUrl(event.image)}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image failed to load:", getImageUrl(event.image));
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-100">
                      <div class="text-center">
                        <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-gray-500">Image not available</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No image available</p>
              </div>
            </div>
          )}
          
          {/* Event Content */}
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                {/* Event Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {event.name}
                </h1>
                
                {/* Event Category */}
                {event.category && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full mb-6">
                    {event.category}
                  </span>
                )}
                
                {/* Event Description */}
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-lg font-semibold text-gray-900">{event.location || "TBA"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {event.price ? `₹${event.price}` : "Free"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {event.bookedCount || 0} / {event.capacity || "Unlimited"} attendees
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Section */}
              <div className="lg:ml-12 lg:flex-shrink-0 w-full lg:w-80">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-gray-900">
                      {event.price ? `₹${event.price}` : "Free"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">per ticket</p>
                  </div>
                  
                  {isEventFull ? (
                    <div className="text-center">
                      <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 font-semibold">Event Full</p>
                        <p className="text-red-600 text-sm">All tickets have been booked</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleBook}
                      disabled={booking}
                      className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 ${
                        booking
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {booking ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  )}
                  
                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Instant confirmation
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Mobile tickets
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Secure payment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
