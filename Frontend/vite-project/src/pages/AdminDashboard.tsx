import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../api/axios";
import type { RootState } from "../redux/store";
import { logout } from "../redux/Slices/authSlice";
import type { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";

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

interface Transaction {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  ipAddress: string;
  device: string;
  isSuspicious: boolean;
  suspiciousReason: string;
  sender?: {
    name: string;
    email: string;
  };
  receiver?: {
    name: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [activeSection, setActiveSection] = useState("users");
  const filteredTransactions = transactions.filter((transaction) => {
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

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.data);
        const analyticsResponse = await api.get("/admin/analytics");
        setAnalytics(analyticsResponse.data.data);
        const transactionResponse = await api.get("/admin/transactions");
        setTransactions(transactionResponse.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // BLOCK USER
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

  // UNBLOCK USER
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

  // FREEZE USER
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

  // UNFREEZE USER
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

  // DELETE USER
  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/user/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* HEADER */}
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

      {/* STATS */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* USERS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400 mb-3">Total Users</p>

          <h2 className="text-4xl font-bold">{analytics.totalUsers}</h2>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400 mb-3">Transactions</p>

          <h2 className="text-4xl font-bold">{analytics.totalTransactions}</h2>
        </div>

        {/* REVENUE */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400 mb-3">Revenue</p>

          <h2 className="text-4xl font-bold text-emerald-400">
            ₹{analytics.totalRevenue.toLocaleString()}
          </h2>
        </div>

        {/* ACTIVE USERS */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6">
          <p className="text-zinc-400 mb-3">Active Sessions</p>

          <h2 className="text-4xl font-bold">{analytics.activeUsers}</h2>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="grid lg:grid-cols-3 gap-8 text-sm">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          {/* USERS */}
          {activeSection === "users" && (
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
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
                      {/* BLOCK / UNBLOCK */}
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

                      {/* FREEZE / UNFREEZE */}
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
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
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
                    {(filteredTransactions || []).length === 0 ? (
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
                      (filteredTransactions || []).map((transaction) => (
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
                              {transaction.sender?.name || "Unknown"}
                            </p>

                            <p className="text-zinc-400 text-sm mt-1">
                              {transaction.sender?.email || "No email"}
                            </p>
                          </td>

                          {/* RECEIVER */}
                          <td className="py-5 px-6 min-w-[230px]">
                            <p className="font-semibold text-white">
                              {transaction.receiver?.name || "Unknown"}
                            </p>

                            <p className="text-zinc-400 text-sm mt-1">
                              {transaction.receiver?.email || "No email"}
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
                              ? new Date(transaction.createdAt).toLocaleString()
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  className="
          bg-white/5
          border border-white/10
          px-5 py-2
          rounded-xl
        "
                >
                  Prev
                </button>

                <button
                  className="
          bg-white/5
          border border-white/10
          px-5 py-2
          rounded-xl
        "
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeSection === "analytics" && (
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-8">
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

        {/* RIGHT SIDE */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 h-fit">
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

            {/* <button
              onClick={() => setActiveSection("analytics")}
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
              Banking Analytics
            </button> */}

            <button
              className="
          w-full
          bg-red-500/20
          hover:bg-red-500/30
          text-red-400
          py-4
          rounded-2xl
          transition
        "
            >
              System Controls
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
