import { useEffect, useState } from "react";
import api from "../lib/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get(`/bookings/my`);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancel = async (eventId) => {
    try {
      await api.delete(`/bookings/${eventId}`);
      setBookings((prev) => prev.filter((b) => b.eventId._id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b._id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{b.eventId.name}</div>
                <div className="text-sm text-gray-600">{new Date(b.eventId.date).toLocaleString()}</div>
                {b.eventId.location && (
                  <div className="text-sm text-gray-600">{b.eventId.location}</div>
                )}
              </div>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => cancel(b.eventId._id)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;


