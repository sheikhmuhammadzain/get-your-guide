"use client";

import { useMemo, useState } from "react";

type AdminTab = "users" | "orders" | "itineraries" | "feedback";

interface AdminPanelClientProps {
  overview: {
    totals: {
      users: number;
      itineraries: number;
      orders: number;
      feedback: number;
      recentRevenue: number;
    };
  };
  users: {
    data: Array<{
      id: string;
      name: string;
      email: string;
      image: string | null;
      emailVerified: Date | string | null;
    }>;
  };
  orders: {
    data: Array<{
      id: string;
      orderCode: string;
      status: string;
      total: number;
      currency: string;
      customer: { email: string; fullName: string };
      createdAt: Date | string;
    }>;
  };
  itineraries: {
    data: Array<{
      id: string;
      userId: string;
      status: string;
      notes?: string;
      updatedAt: Date | string;
    }>;
  };
  feedback: {
    data: Array<{
      id: string;
      email: string | null;
      category: string;
      status: string;
      rating: number | null;
      message: string;
      createdAt: Date | string;
    }>;
  };
}

export default function AdminPanelClient(props: AdminPanelClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [users, setUsers] = useState(props.users.data);
  const [orders, setOrders] = useState(props.orders.data);
  const [itineraries, setItineraries] = useState(props.itineraries.data);
  const [feedback, setFeedback] = useState(props.feedback.data);

  const totals = props.overview.totals;

  const filteredUsers = useMemo(
    () =>
      users.filter((item) =>
        `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );
  const filteredOrders = useMemo(
    () =>
      orders.filter((item) =>
        `${item.orderCode} ${item.customer.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [orders, search],
  );
  const filteredItineraries = useMemo(
    () =>
      itineraries.filter((item) =>
        `${item.id} ${item.userId} ${item.status}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [itineraries, search],
  );
  const filteredFeedback = useMemo(
    () =>
      feedback.filter((item) =>
        `${item.category} ${item.email ?? ""} ${item.message}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [feedback, search],
  );

  async function runAction(action: () => Promise<void>, id: string, successMessage: string) {
    setMessage(null);
    setBusyId(id);
    try {
      await action();
      setMessage(successMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Operations Control Center</h2>
          <p className="text-sm text-slate-300">
            Manage users, bookings, itineraries, and support feedback from one panel.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          <StatCard label="Users" value={String(totals.users)} />
          <StatCard label="Orders" value={String(totals.orders)} />
          <StatCard label="Itineraries" value={String(totals.itineraries)} />
          <StatCard label="Feedback" value={String(totals.feedback)} />
          <StatCard label="Recent Revenue" value={`${totals.recentRevenue} EUR`} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["users", "orders", "itineraries", "feedback"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                  activeTab === tab
                    ? "bg-[#0071eb] text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 md:w-80"
          />
        </div>

        {message ? (
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
            {message}
          </div>
        ) : null}

        {activeTab === "users" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Verified</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium">{user.name}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.emailVerified ? "Yes" : "No"}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === user.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                const name = window.prompt("Update name", user.name);
                                if (!name) return;
                                const response = await fetch(`/api/v1/admin/users/${user.id}`, {
                                  method: "PATCH",
                                  headers: { "content-type": "application/json" },
                                  body: JSON.stringify({ name }),
                                });
                                if (!response.ok) throw new Error("User update failed");
                                setUsers((prev) =>
                                  prev.map((item) => (item.id === user.id ? { ...item, name } : item)),
                                );
                              },
                              user.id,
                              "User updated",
                            )
                          }
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          disabled={busyId === user.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                if (!window.confirm("Delete user and related records?")) return;
                                const response = await fetch(`/api/v1/admin/users/${user.id}`, {
                                  method: "DELETE",
                                });
                                if (!response.ok) throw new Error("User delete failed");
                                setUsers((prev) => prev.filter((item) => item.id !== user.id));
                              },
                              user.id,
                              "User deleted",
                            )
                          }
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === "orders" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium">{order.orderCode}</td>
                    <td className="px-3 py-3">{order.customer.email}</td>
                    <td className="px-3 py-3 capitalize">{order.status}</td>
                    <td className="px-3 py-3">
                      {order.total} {order.currency}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === order.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                const nextStatus = order.status === "confirmed" ? "cancelled" : "confirmed";
                                const response = await fetch(`/api/v1/admin/orders/${order.id}`, {
                                  method: "PATCH",
                                  headers: { "content-type": "application/json" },
                                  body: JSON.stringify({ status: nextStatus }),
                                });
                                if (!response.ok) throw new Error("Order update failed");
                                setOrders((prev) =>
                                  prev.map((item) =>
                                    item.id === order.id ? { ...item, status: nextStatus } : item,
                                  ),
                                );
                              },
                              order.id,
                              "Order updated",
                            )
                          }
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Toggle Status
                        </button>
                        <button
                          disabled={busyId === order.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                if (!window.confirm("Delete this order?")) return;
                                const response = await fetch(`/api/v1/admin/orders/${order.id}`, {
                                  method: "DELETE",
                                });
                                if (!response.ok) throw new Error("Order delete failed");
                                setOrders((prev) => prev.filter((item) => item.id !== order.id));
                              },
                              order.id,
                              "Order deleted",
                            )
                          }
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === "itineraries" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Itinerary ID</th>
                  <th className="px-3 py-2">User ID</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Updated</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItineraries.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-mono text-xs">{item.id}</td>
                    <td className="px-3 py-3 font-mono text-xs">{item.userId}</td>
                    <td className="px-3 py-3 capitalize">{item.status}</td>
                    <td className="px-3 py-3">{new Date(item.updatedAt).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === item.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                const status =
                                  item.status === "saved"
                                    ? "archived"
                                    : item.status === "archived"
                                      ? "draft"
                                      : "saved";
                                const response = await fetch(`/api/v1/admin/itineraries/${item.id}`, {
                                  method: "PATCH",
                                  headers: { "content-type": "application/json" },
                                  body: JSON.stringify({ status }),
                                });
                                if (!response.ok) throw new Error("Itinerary update failed");
                                setItineraries((prev) =>
                                  prev.map((row) => (row.id === item.id ? { ...row, status } : row)),
                                );
                              },
                              item.id,
                              "Itinerary updated",
                            )
                          }
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Cycle Status
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                if (!window.confirm("Delete itinerary?")) return;
                                const response = await fetch(`/api/v1/admin/itineraries/${item.id}`, {
                                  method: "DELETE",
                                });
                                if (!response.ok) throw new Error("Itinerary delete failed");
                                setItineraries((prev) => prev.filter((row) => row.id !== item.id));
                              },
                              item.id,
                              "Itinerary deleted",
                            )
                          }
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === "feedback" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Rating</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-3 capitalize">{item.category}</td>
                    <td className="px-3 py-3">{item.email ?? "Anonymous"}</td>
                    <td className="px-3 py-3">{item.rating ?? "-"}</td>
                    <td className="px-3 py-3 capitalize">{item.status}</td>
                    <td className="max-w-sm px-3 py-3 text-slate-700">{item.message}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === item.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                const status = item.status === "new" ? "reviewed" : "new";
                                const response = await fetch(`/api/v1/admin/feedback/${item.id}`, {
                                  method: "PATCH",
                                  headers: { "content-type": "application/json" },
                                  body: JSON.stringify({ status }),
                                });
                                if (!response.ok) throw new Error("Feedback update failed");
                                setFeedback((prev) =>
                                  prev.map((row) => (row.id === item.id ? { ...row, status } : row)),
                                );
                              },
                              item.id,
                              "Feedback updated",
                            )
                          }
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Toggle Status
                        </button>
                        <button
                          disabled={busyId === item.id}
                          onClick={() =>
                            runAction(
                              async () => {
                                if (!window.confirm("Delete feedback entry?")) return;
                                const response = await fetch(`/api/v1/admin/feedback/${item.id}`, {
                                  method: "DELETE",
                                });
                                if (!response.ok) throw new Error("Feedback delete failed");
                                setFeedback((prev) => prev.filter((row) => row.id !== item.id));
                              },
                              item.id,
                              "Feedback deleted",
                            )
                          }
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
