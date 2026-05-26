const Footer = () => {
  return (
    <footer
      className="
        border-t border-white/10
        bg-[#0b1220]
        mt-20
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          px-8 py-8
          flex flex-col md:flex-row
          items-center
          justify-between
          gap-5
        "
      >
        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-400">SkyPay</h2>

          <p className="text-zinc-500 mt-2 text-sm">
            Modern digital banking platform with secure real-time transactions.
          </p>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/officialakashraina"
            target="_blank"
            className="
              text-zinc-400
              hover:text-emerald-400
              transition
            "
          >
            Instagram
          </a>

          <a
            href="https://x.com/akashrainaf5"
            target="_blank"
            className="
              text-zinc-400
              hover:text-emerald-400
              transition
            "
          >
            X
          </a>

          <a
            href="https://www.linkedin.com/in/akash-raina-9baa0021a/"
            target="_blank"
            className="
              text-zinc-400
              hover:text-emerald-400
              transition
            "
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/Champion7771"
            target="_blank"
            className="
              text-zinc-400
              hover:text-emerald-400
              transition
            "
          >
            GitHub
          </a>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/5 py-5 text-center text-zinc-500 text-sm">
        Made by{" "}
        <span className="text-emerald-400 font-semibold">Akash Raina</span>{" "}
        (Full Stack Developer)
      </div>
    </footer>
  );
};

export default Footer;
