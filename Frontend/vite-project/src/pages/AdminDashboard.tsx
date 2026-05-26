import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import type { RootState, AppDispatch } from "../redux/store";

import { logout } from "../redux/Slices/authSlice";

/* =========================
   TYPES
========================= */

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  isBlocked: boolean;
  isFrozen: boolean;
  isSuspicious: boolean;
  ipAddress?: string;
  device?: string;
  userAgent?: string;
  suspiciousReason?: string;
}

interface TransactionUser {
  _id?: string;
  name?: string;
  email?: string;
}

interface Transaction {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  ipAddress?: string;
  device?: string;
  isSuspicious: boolean;
  suspiciousReason?: string;
  sender?: TransactionUser | string;
  receiver?: TransactionUser | string;
}

interface Analytics {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
}

type ActiveSection = "users" | "transactions" | "analytics";

/* =========================
   REUSABLE CLASSES
========================= */

const cardClass = "bg-[#111827] border border-white/10 rounded-3xl";

/* =========================
   COMPONENT
========================= */

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  /* =========================
     STATES
  ========================= */

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [transactionFilter, setTransactionFilter] = useState("all");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [activeSection, setActiveSection] = useState<ActiveSection>("users");

  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });

  /* =========================
     PAGINATION
  ========================= */

  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 5;

  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, analyticsResponse, transactionResponse] =
          await Promise.all([
            api.get("/admin/users"),
            api.get("/admin/analytics"),
            api.get("/admin/transactions"),
          ]);

        setUsers(usersResponse.data.data || []);

        setAnalytics(
          analyticsResponse.data.data || {
            totalUsers: 0,
            totalTransactions: 0,
            totalRevenue: 0,
            activeUsers: 0,
          },
        );

        setTransactions(transactionResponse.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  /* =========================
     FILTER TRANSACTIONS
  ========================= */

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // STATUS FILTER

      if (transactionFilter === "suspicious" && !transaction.isSuspicious) {
        return false;
      }

      if (transactionFilter === "successful" && transaction.isSuspicious) {
        return false;
      }

      // DATE FILTER

      const transactionDate = new Date(transaction.createdAt);

      if (fromDate && transactionDate < new Date(fromDate)) {
        return false;
      }

      if (toDate && transactionDate > new Date(toDate)) {
        return false;
      }

      return true;
    });
  }, [transactions, transactionFilter, fromDate, toDate]);

  /* =========================
     PAGINATION LOGIC
  ========================= */

  const indexOfLastTransaction = currentPage * transactionsPerPage;

  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;

  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage,
  );

  /* =========================
     USER ACTIONS
  ========================= */

  const handleBlockUser = async (id: string) => {
    try {
      await api.patch(`/admin/block/${id}`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked: true,
              }
            : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
      await api.patch(`/admin/unblock/${id}`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked: false,
              }
            : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFreezeUser = async (id: string) => {
    try {
      await api.patch(`/admin/freeze/${id}`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isFrozen: true,
              }
            : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfreezeUser = async (id: string) => {
    try {
      await api.patch(`/admin/unfreeze/${id}`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isFrozen: false,
              }
            : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/user/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      dispatch(logout());

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOADING UI
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">
        Loading Admin Dashboard...
      </div>
    );
  }

  /* =========================
     JSX
  ========================= */

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* =========================
         HEADER
      ========================= */}

      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-bold text-emerald-400">
            Admin Dashboard
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Welcome back, {user?.name}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="
            bg-red-500/20
            hover:bg-red-500/30
            text-red-400
            font-semibold
            px-6 py-3
            rounded-2xl
            transition
          "
        >
          Logout
        </button>
      </div>

      {/* =========================
         STATS
      ========================= */}

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className={`${cardClass} p-6`}>
          <p className="text-zinc-400 mb-3">Total Users</p>

          <h2 className="text-4xl font-bold">{analytics.totalUsers}</h2>
        </div>

        <div className={`${cardClass} p-6`}>
          <p className="text-zinc-400 mb-3">Transactions</p>

          <h2 className="text-4xl font-bold">{analytics.totalTransactions}</h2>
        </div>

        <div className={`${cardClass} p-6`}>
          <p className="text-zinc-400 mb-3">Revenue</p>

          <h2 className="text-4xl font-bold text-emerald-400">
            ₹{analytics.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className={`${cardClass} p-6`}>
          <p className="text-zinc-400 mb-3">Active Sessions</p>

          <h2 className="text-4xl font-bold">{analytics.activeUsers}</h2>
        </div>
      </section>

      {/* =========================
         MAIN GRID
      ========================= */}

      <section className="grid lg:grid-cols-3 gap-8 text-sm">
        {/* =========================
           LEFT SIDE
        ========================= */}

        <div className="lg:col-span-2">
          {/* USERS */}

          {activeSection === "users" && (
            <div className={`${cardClass} p-8`}>
              <h2 className="text-4xl font-bold mb-8">Manage Users</h2>

              <div className="space-y-5">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="
                      flex
                      items-center
                      justify-between
                      bg-white/5
                      border border-white/10
                      rounded-2xl
                      p-5
                    "
                  >
                    <div>
                      <h3 className="text-2xl font-semibold">{user.name}</h3>

                      <p className="text-zinc-400 mt-1">{user.email}</p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      {/* BLOCK */}

                      {user.isBlocked ? (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          className="
                            bg-green-500/20
                            hover:bg-green-500/30
                            text-green-400
                            px-5 py-2
                            rounded-xl
                            transition
                          "
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          className="
                            bg-yellow-500/20
                            hover:bg-yellow-500/30
                            text-yellow-400
                            px-5 py-2
                            rounded-xl
                            transition
                          "
                        >
                          Block
                        </button>
                      )}

                      {/* FREEZE */}

                      {user.isFrozen ? (
                        <button
                          onClick={() => handleUnfreezeUser(user._id)}
                          className="
                            bg-cyan-500/20
                            hover:bg-cyan-500/30
                            text-cyan-400
                            px-5 py-2
                            rounded-xl
                            transition
                          "
                        >
                          Unfreeze
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFreezeUser(user._id)}
                          className="
                            bg-blue-500/20
                            hover:bg-blue-500/30
                            text-blue-400
                            px-5 py-2
                            rounded-xl
                            transition
                          "
                        >
                          Freeze
                        </button>
                      )}

                      {/* DELETE */}

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="
                          bg-red-500/20
                          hover:bg-red-500/30
                          text-red-400
                          px-5 py-2
                          rounded-xl
                          transition
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRANSACTIONS */}

          {activeSection === "transactions" && (
            <div className={`${cardClass} p-8`}>
              {/* HEADER */}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold">Transactions</h2>

                <div className="flex gap-3">
                  <button
                    onClick={() => setTransactionFilter("all")}
                    className="
                      bg-white/5
                      text-white
                      px-4 py-2
                      rounded-xl
                    "
                  >
                    All
                  </button>

                  <button
                    onClick={() => setTransactionFilter("successful")}
                    className="
                      bg-emerald-500/20
                      text-emerald-400
                      px-4 py-2
                      rounded-xl
                    "
                  >
                    Successful
                  </button>

                  <button
                    onClick={() => setTransactionFilter("suspicious")}
                    className="
                      bg-red-500/20
                      text-red-400
                      px-4 py-2
                      rounded-xl
                    "
                  >
                    Suspicious
                  </button>
                </div>
              </div>

              {/* DATE FILTER */}

              <div className="flex gap-4 mb-8 items-center">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="
                    bg-white/5
                    border border-white/10
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />

                <h1 className="text-2xl font-bold">To</h1>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="
                    bg-white/5
                    border border-white/10
                    rounded-xl
                    px-4 py-3
                    outline-none
                  "
                />
              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-zinc-400 text-sm">
                      <th className="text-left py-3 px-4 font-medium">
                        Amount
                      </th>

                      <th className="text-left py-3 px-4 font-medium">
                        Sender
                      </th>

                      <th className="text-left py-3 px-4 font-medium">
                        Receiver
                      </th>

                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>

                      <th className="text-left py-3 px-4 font-medium">
                        Device
                      </th>

                      <th className="text-left py-3 px-4 font-medium">Date</th>

                      <th className="text-left py-3 px-4 font-medium">
                        Security
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="
                            text-center
                            py-10
                            text-zinc-500
                          "
                        >
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      currentTransactions.map((transaction) => {
                        const senderName =
                          typeof transaction.sender === "object"
                            ? transaction.sender?.name || "Unknown"
                            : "Unknown";

                        const senderEmail =
                          typeof transaction.sender === "object"
                            ? transaction.sender?.email || "No Email"
                            : "No Email";

                        const receiverName =
                          typeof transaction.receiver === "object"
                            ? transaction.receiver?.name || "Unknown"
                            : "Unknown";

                        const receiverEmail =
                          typeof transaction.receiver === "object"
                            ? transaction.receiver?.email || "No Email"
                            : "No Email";

                        return (
                          <tr
                            key={transaction._id}
                            className="
                                bg-white/5
                                hover:bg-white/[0.07]
                                transition
                              "
                          >
                            {/* AMOUNT */}

                            <td className="py-5 px-6 min-w-[140px]">
                              <p className="font-bold text-emerald-400 text-lg">
                                ₹{(transaction.amount || 0).toLocaleString()}
                              </p>
                            </td>

                            {/* SENDER */}

                            <td className="py-5 px-6 min-w-[230px]">
                              <p className="font-semibold text-white">
                                {senderName}
                              </p>

                              <p className="text-zinc-400 text-sm mt-1">
                                {senderEmail}
                              </p>
                            </td>

                            {/* RECEIVER */}

                            <td className="py-5 px-6 min-w-[230px]">
                              <p className="font-semibold text-white">
                                {receiverName}
                              </p>

                              <p className="text-zinc-400 text-sm mt-1">
                                {receiverEmail}
                              </p>
                            </td>

                            {/* STATUS */}

                            <td className="py-5 px-6 min-w-[140px]">
                              <span
                                className={`
                                    px-4
                                    py-1.5
                                    rounded-full
                                    text-xs
                                    font-semibold

                                    ${
                                      transaction.status === "success"
                                        ? `
                                          bg-emerald-500/20
                                          text-emerald-400
                                        `
                                        : `
                                          bg-red-500/20
                                          text-red-400
                                        `
                                    }
                                  `}
                              >
                                {transaction.status || "Unknown"}
                              </span>
                            </td>

                            {/* DEVICE */}

                            <td className="py-5 px-6 min-w-[120px] text-zinc-400 text-sm">
                              {transaction.device || "Unknown"}
                            </td>

                            {/* DATE */}

                            <td className="py-5 px-6 min-w-[220px] text-zinc-400 text-sm leading-6">
                              {transaction.createdAt
                                ? new Date(
                                    transaction.createdAt,
                                  ).toLocaleString()
                                : "No date"}
                            </td>

                            {/* SECURITY */}

                            <td className="py-5 px-6 min-w-[220px]">
                              {transaction.isSuspicious ? (
                                <div className="space-y-2">
                                  <span
                                    className="
                                        bg-red-500/20
                                        text-red-400
                                        px-4
                                        py-1.5
                                        rounded-full
                                        text-xs
                                        font-semibold
                                      "
                                  >
                                    Warning
                                  </span>

                                  <p className="text-red-400 text-xs leading-5">
                                    {transaction.suspiciousReason ||
                                      "Suspicious activity"}
                                  </p>
                                </div>
                              ) : (
                                <span
                                  className="
                                      bg-emerald-500/20
                                      text-emerald-400
                                      px-4
                                      py-1.5
                                      rounded-full
                                      text-xs
                                      font-semibold
                                    "
                                >
                                  Safe
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}

              <div className="flex justify-center items-center gap-5 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="
                    bg-white/5
                    border border-white/10
                    px-5 py-2
                    rounded-xl
                    disabled:opacity-40
                  "
                >
                  Prev
                </button>

                <p className="text-zinc-400">
                  Page {currentPage} of {totalPages || 1}
                </p>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="
                    bg-white/5
                    border border-white/10
                    px-5 py-2
                    rounded-xl
                    disabled:opacity-40
                  "
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ANALYTICS */}

          {activeSection === "analytics" && (
            <div className={`${cardClass} p-8`}>
              <h2 className="text-4xl font-bold mb-8">Banking Analytics</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6">
                  <p className="text-zinc-400">Total Revenue</p>

                  <h3 className="text-4xl font-bold mt-3 text-emerald-400">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white/5 rounded-2xl p-6">
                  <p className="text-zinc-400">Transactions</p>

                  <h3 className="text-4xl font-bold mt-3">
                    {analytics.totalTransactions}
                  </h3>
                </div>

                <div className="bg-white/5 rounded-2xl p-6">
                  <p className="text-zinc-400">Users</p>

                  <h3 className="text-4xl font-bold mt-3">
                    {analytics.totalUsers}
                  </h3>
                </div>

                <div className="bg-white/5 rounded-2xl p-6">
                  <p className="text-zinc-400">Active Users</p>

                  <h3 className="text-4xl font-bold mt-3">
                    {analytics.activeUsers}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================
           RIGHT SIDE
        ========================= */}

        <div className={`${cardClass} p-8 h-fit`}>
          <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>

          <div className="space-y-5">
            <button
              onClick={() => setActiveSection("users")}
              className="
                w-full
                bg-emerald-500
                hover:bg-emerald-400
                text-black
                font-semibold
                py-4
                rounded-2xl
                transition
              "
            >
              Manage Users
            </button>

            <button
              onClick={() => setActiveSection("transactions")}
              className="
                w-full
                bg-white/5
                hover:bg-white/10
                border border-white/10
                py-4
                rounded-2xl
                transition
              "
            >
              View Transactions
            </button>

            <button
              onClick={() => setActiveSection("analytics")}
              className="
                w-full
                bg-cyan-500/20
                hover:bg-cyan-500/30
                text-cyan-400
                py-4
                rounded-2xl
                transition
              "
            >
              Analytics
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
