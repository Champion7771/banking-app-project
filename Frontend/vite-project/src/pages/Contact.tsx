const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white text-center px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          Contact Us
        </h1>

        <div className="bg-[#111827] border border-white/10 rounded-3xl p-10">
          <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>

          <p className="text-zinc-400 leading-8 text-lg">
            For project collaboration, freelance opportunities, fintech
            development, or technical discussions, feel free to reach out.
          </p>

          <div className="mt-10 space-y-5">
            <div>
              <p className="text-zinc-500">Email</p>

              <a
                href="mailto:akashrainaf5@gmail.com"
                className="text-emerald-400 text-lg"
              >
                akashrainaf5@gmail.com
              </a>
            </div>

            <div>
              <p className="text-zinc-500">Developer</p>

              <p className="text-white text-lg">Akash Raina</p>
            </div>

            <div>
              <p className="text-zinc-500">Role</p>

              <p className="text-white text-lg">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
