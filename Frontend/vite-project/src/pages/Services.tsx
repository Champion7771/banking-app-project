const Services = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-400 mb-12">
          Our Services
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Money Transfers</h2>

            <p className="text-zinc-400 leading-7">
              Send and receive money instantly with secure transaction
              processing.
            </p>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Account Management</h2>

            <p className="text-zinc-400 leading-7">
              Manage balances, history, and account security seamlessly.
            </p>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">
              Transaction Tracking
            </h2>

            <p className="text-zinc-400 leading-7">
              Search, paginate, and monitor all payment activity in real-time.
            </p>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">
              Secure Authentication
            </h2>

            <p className="text-zinc-400 leading-7">
              JWT-based authentication with protected routes and session
              persistence.
            </p>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

            <p className="text-zinc-400 leading-7">
              Manage users, transactions, and banking operations efficiently.
            </p>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">
              Scalable Infrastructure
            </h2>

            <p className="text-zinc-400 leading-7">
              Backend architecture designed for performance and scalability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
