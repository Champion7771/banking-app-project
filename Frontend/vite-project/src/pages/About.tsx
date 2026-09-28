const About = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white text-center px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-400 mb-8">
          About SkyPay
        </h1>

        <p className="text-zinc-300 leading-8 text-lg">
          SkyPay is a modern digital banking platform built with scalable MERN
          architecture, secure authentication, real-time transaction handling,
          and modern fintech UI principles.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
              Secure Banking
            </h2>

            <p className="text-zinc-400 leading-7">
              JWT authentication, protected routes, encrypted passwords, and
              secure transaction architecture.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
              Real-Time Payments
            </h2>

            <p className="text-zinc-400 leading-7">
              Instant transfers with transaction tracking, history management,
              and scalable APIs.
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
              Modern Tech Stack
            </h2>

            <p className="text-zinc-400 leading-7">
              Built using React, Redux Toolkit, Node.js, Express, MongoDB, and
              TypeScript.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
