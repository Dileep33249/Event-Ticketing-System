import { useEffect, useState } from "react";
import api from "../lib/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [u, e, b] = await Promise.all([
          api.get(`/admin/users`),
          api.get(`/admin/events`),
          api.get(`/admin/bookings`),
        ]);
        setUsers(u.data || []);
        setEvents(e.data || []);
        setBookings(b.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const block = async (id) => {
    try {
      await api.put(`/admin/users/block/${id}`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: "blocked" } : u)));
    } catch (err) {
      console.error(err);
    }
  };

  const unblock = async (id) => {
    try {
      await api.put(`/admin/users/unblock/${id}`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: "active" } : u)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 text-center">{u.role}</td>
                  <td className="p-2 text-center">{u.status}</td>
                  <td className="p-2 text-center">
                    {u.status === "active" ? (
                      <button className="px-3 py-1 border rounded text-red-600" onClick={() => block(u._id)}>Block</button>
                    ) : (
                      <button className="px-3 py-1 border rounded text-green-600" onClick={() => unblock(u._id)}>Unblock</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Events</h2>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e._id} className="border rounded p-3 flex justify-between">
              <div>
                <div className="font-semibold">{e.name || e.title}</div>
                <div className="text-sm text-gray-600">{new Date(e.date).toLocaleString()}</div>
              </div>
              <div className="text-sm">{e.category} · {e.location}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Bookings</h2>
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b._id} className="border rounded p-3">
              <div className="font-semibold">{b.eventId?.name}</div>
              <div className="text-sm text-gray-600">User: {b.userId?.email}</div>
              <div className="text-sm text-gray-600">At: {new Date(b.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;


