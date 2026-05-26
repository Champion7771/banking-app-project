import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="
          relative
          overflow-hidden
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          py-16
          md:py-28
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-14
          lg:gap-20
          items-center
        "
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.08]
            pointer-events-none
          "
        >
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop"
            alt="Banking Background"
            className="
              w-full
              h-full
              object-cover
            "
          />
        </div>

        {/* GLOW EFFECT */}
        <div
          className="
            absolute
            top-1/2
            right-0
            -translate-y-1/2

            w-[300px]
            h-[300px]

            bg-emerald-500/20
            blur-[120px]
            rounded-full

            pointer-events-none
          "
        />

        {/* LEFT CONTENT */}
        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="
            relative
            z-10
            max-w-xl
          "
        >
          <p
            className="
              text-emerald-400
              font-semibold
              tracking-wide
              mb-4
              text-sm
              sm:text-base
            "
          >
            MODERN DIGITAL BANKING
          </p>

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl

              font-extrabold
              leading-tight
              mb-6
            "
          >
            Banking Built for the Future
          </h1>

          <p
            className="
              text-zinc-400
              text-base
              sm:text-lg
              leading-8
              mb-8
            "
          >
            Secure money transfers, real-time transactions, advanced analytics,
            and modern financial management — all in one platform.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <button
              className="
                bg-emerald-500
                hover:bg-emerald-400
                hover:scale-105
                active:scale-95

                text-black
                font-semibold

                px-7
                py-3

                rounded-2xl
                transition
              "
            >
              Get Started
            </button>

            <button
              className="
                bg-white/5
                border
                border-white/10

                hover:bg-white/10
                hover:scale-105
                active:scale-95

                px-7
                py-3

                rounded-2xl
                transition
              "
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative
            z-10

            bg-white/5
            border
            border-white/10

            rounded-3xl

            p-5
            sm:p-8

            backdrop-blur-xl
            w-full

            shadow-2xl
          "
        >
          <div className="space-y-5">
            {/* TOTAL BALANCE */}
            <div
              className="
                bg-[#111827]
                p-5
                sm:p-6
                rounded-2xl
              "
            >
              <p className="text-zinc-400 mb-2 text-sm sm:text-base">
                Total Balance
              </p>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-extrabold
                "
              >
                ₹8,45,200
              </h2>
            </div>

            {/* STATS */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >
              {/* TRANSACTIONS */}
              <div
                className="
                  bg-[#111827]
                  p-5
                  rounded-2xl
                  hover:bg-[#1a2438]
                  transition
                "
              >
                <p className="text-zinc-400 text-sm">Transactions</p>

                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    mt-2
                  "
                >
                  12,540
                </h3>
              </div>

              {/* ACTIVE USERS */}
              <div
                className="
                  bg-[#111827]
                  p-5
                  rounded-2xl
                  hover:bg-[#1a2438]
                  transition
                "
              >
                <p className="text-zinc-400 text-sm">Active Users</p>

                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    mt-2
                  "
                >
                  24K+
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
