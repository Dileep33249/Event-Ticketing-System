import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/events`)
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="explore-events"
      className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff] py-12 px-4 flex flex-col items-center"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-3">
            Explore Events
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover and join the latest events happening around you. Click on an event to see more details.
          </p>
        </header>
        {loading ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-300 flex flex-col"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {event.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="mr-2">📅</span>
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-3">{event.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {event.category || "General"}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {event.location || "TBA"}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">
                        {event.price ? (
                          <>
                            <span className="text-green-600">₹{event.price}</span>
                          </>
                        ) : (
                          <span className="text-blue-600">Free</span>
                        )}
                      </span>
                      {typeof event.bookedCount === "number" && typeof event.capacity === "number" && (
                        <span className="text-gray-500">
                          {event.bookedCount}/{event.capacity} seats
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 text-lg py-12">
                No events available at the moment.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreEvents;
