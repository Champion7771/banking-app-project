import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../redux/store";

import api from "../api/axios";

import { logout, loadUser } from "../redux/Slices/authSlice";

import {
  getTransactions,
  transferMoney,
} from "../redux/Slices/transactionSlice";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

/* =========================
   TYPES
========================= */

type UserType = {
  _id: string;
  name: string;
  email: string;
};

type TransactionType = {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  sender: UserType | string;
  receiver: UserType | string;
};

/* =========================
   COMPONENT
========================= */

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  /* =========================
     LOCAL STATE
  ========================= */

  const [receiverEmail, setReceiverEmail] = useState("");

  const [amount, setAmount] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 5;

  /* =========================
     REDUX STATE
  ========================= */

  const { user } = useSelector((state: RootState) => state.auth);

  const { transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions,
  ) as {
    transactions: TransactionType[];
    loading: boolean;
    error: string | null;
  };

  /* =========================
     FETCH TRANSACTIONS
  ========================= */

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

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
     TRANSFER MONEY
  ========================= */

  const handleTransfer = async () => {
    try {
      await dispatch(
        transferMoney({
          receiverEmail,
          amount: Number(amount),
        }),
      ).unwrap();

      // REFRESH USER
      await dispatch(loadUser());

      // REFRESH TRANSACTIONS
      await dispatch(getTransactions());

      // CLEAR INPUTS
      setReceiverEmail("");

      setAmount("");
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     FILTER TRANSACTIONS
  ========================= */

  const filteredTransactions = transactions.filter((transaction) => {
    if (!transaction) return false;

    const senderName =
      typeof transaction.sender === "object"
        ? transaction.sender?.name || ""
        : "";

    const receiverName =
      typeof transaction.receiver === "object"
        ? transaction.receiver?.name || ""
        : "";

    return (
      senderName.toLowerCase().includes(search.toLowerCase()) ||
      receiverName.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* =========================
     PAGINATION
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
     JSX
  ========================= */

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* =========================
         TOPBAR
      ========================= */}

      <header className="border-b border-white/10 bg-[#111827]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400">
              SkyPay Dashboard
            </h1>

            <p className="text-zinc-400 mt-1">Welcome back, {user?.name}</p>
          </div>

          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* =========================
         MAIN
      ========================= */}

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* =========================
           STATS
        ========================= */}

        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <Card>
            <p className="text-zinc-400 mb-2">Current Balance</p>

            <h2 className="text-4xl font-bold text-emerald-400">
              ₹{user?.balance?.toLocaleString()}
            </h2>
          </Card>

          <Card>
            <p className="text-zinc-400 mb-2">Total Transactions</p>

            <h2 className="text-4xl font-bold">{transactions.length}</h2>
          </Card>

          <Card>
            <p className="text-zinc-400 mb-2">Account Status</p>

            <h2 className="text-4xl font-bold text-emerald-400">Active</h2>
          </Card>
        </section>

        {/* =========================
           TRANSFER + HISTORY
        ========================= */}

        <section className="grid lg:grid-cols-3 gap-8">
          {/* =========================
             TRANSFER CARD
          ========================= */}

          <Card className="lg:col-span-1 h-fit">
            <h2 className="text-2xl font-bold mb-6">Transfer Money</h2>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Receiver Email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {Number(amount) > 10000 && (
                <p className="text-red-400 mt-3">
                  Maximum transfer limit is ₹10,000
                </p>
              )}

              <button
                onClick={handleTransfer}
                disabled={!receiverEmail || !amount || Number(amount) > 10000}
                className={`
                  w-full
                  py-4
                  rounded-2xl
                  font-semibold
                  transition

                  ${
                    Number(amount) > 10000
                      ? `
                        bg-red-500/20
                        text-red-400
                        cursor-not-allowed
                      `
                      : `
                        bg-emerald-500
                        hover:bg-emerald-400
                        text-black
                      `
                  }
                `}
              >
                {Number(amount) > 10000 ? "Limit Exceeded" : "Send Money"}
              </button>

              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          </Card>

          {/* =========================
             TRANSACTION HISTORY
          ========================= */}

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Recent Transactions</h2>

            {/* SEARCH */}

            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search by sender or receiver..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* LOADING */}

            {loading && (
              <p className="text-zinc-400">Loading transactions...</p>
            )}

            {/* TRANSACTIONS */}

            <div className="space-y-5">
              {currentTransactions
                .filter((transaction) => transaction && transaction._id)
                .map((transaction) => {
                  const isSender =
                    typeof transaction.sender === "object"
                      ? transaction.sender._id === user?._id
                      : transaction.sender === user?._id;

                  const senderName =
                    typeof transaction.sender === "object"
                      ? transaction.sender.name
                      : "Unknown User";

                  const receiverName =
                    typeof transaction.receiver === "object"
                      ? transaction.receiver.name
                      : "Unknown User";

                  const senderEmail =
                    typeof transaction.sender === "object"
                      ? transaction.sender.email
                      : "No Email";

                  const receiverEmail =
                    typeof transaction.receiver === "object"
                      ? transaction.receiver.email
                      : "No Email";

                  return (
                    <Card
                      key={transaction._id}
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div>
                        {/* AMOUNT */}

                        <p className="text-2xl font-bold">
                          ₹{transaction.amount}
                        </p>

                        {/* SENT / RECEIVED */}

                        <p className="text-zinc-400 mt-2">
                          {isSender
                            ? `Sent to ${receiverName}`
                            : `Received from ${senderName}`}
                        </p>

                        {/* EMAIL */}

                        <p className="text-zinc-500 text-sm mt-1">
                          {isSender ? receiverEmail : senderEmail}
                        </p>

                        {/* DATE */}

                        <p className="text-zinc-500 text-sm mt-2">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div>
                        <span
                          className="
                            bg-emerald-500/20
                            text-emerald-400
                            px-4 py-2
                            rounded-xl
                            text-sm
                          "
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </Card>
                  );
                })}
            </div>

            {/* =========================
               PAGINATION
            ========================= */}

            <div className="flex items-center justify-center gap-5 mt-10">
              {/* PREVIOUS */}

              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {/* PAGE INFO */}

              <p className="text-zinc-400">
                Page {currentPage} of {totalPages}
              </p>

              {/* NEXT */}

              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
