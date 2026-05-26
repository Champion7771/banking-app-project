import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="
        w-full
        border-b
        border-white/10
        bg-[#0f172a]/80
        backdrop-blur-xl
        sticky
        top-0
        z-50
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-3
          sm:px-6
          lg:px-10
          py-4
        "
      >
        {/* TOP ROW */}
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          {/* LOGO */}
          <Link
            to="/"
            className="
              text-3xl
              sm:text-5xl
              font-extrabold
              text-emerald-400
              tracking-tight
              whitespace-nowrap
            "
          >
            SkyPay
          </Link>

          {/* DESKTOP LINKS */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-8
              text-sm
              font-medium
              text-zinc-300
            "
          >
            <Link
              to="/about"
              className="
                hover:text-emerald-400
                transition
              "
            >
              About
            </Link>

            <Link
              to="/services"
              className="
                hover:text-emerald-400
                transition
              "
            >
              Services
            </Link>

            <Link
              to="/contact"
              className="
                hover:text-emerald-400
                transition
              "
            >
              Contact
            </Link>
          </div>

          {/* DESKTOP BUTTONS */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-4

            "
          >
            {location.pathname !== "/login" && (
              <Link
                to="/login"
                className="
                    bg-emerald-500
                    text-black

                    min-w-[120px]
                    text-center

                    px-5
                    py-3

                    rounded-2xl
                    font-semibold

                    hover:bg-emerald-400
                    transition
                  "
              >
                Login
              </Link>
            )}

            {location.pathname !== "/register" && (
              <Link
                to="/register"
                className="
                bg-emerald-500
                text-black

                min-w-[120px]
                text-center

                px-5
                py-3

                rounded-2xl
                font-semibold

                hover:bg-emerald-400
                transition
              "
              >
                Register
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              md:hidden
              text-white
            "
          >
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* MOBILE BUTTONS */}
        <div
          className="
            flex
            md:hidden
            justify-center
            items-center
            gap-3
            mt-4
            w-full
          "
        >
          {location.pathname !== "/login" && (
            <Link
              to="/login"
              className="
                bg-emerald-500
                text-black
                px-5
                py-2
                rounded-xl
                font-semibold
                hover:bg-emerald-400
                transition
              "
            >
              Login
            </Link>
          )}

          {location.pathname !== "/register" && (
            <Link
              to="/register"
              className="
                bg-emerald-500
                text-black
                px-5
                py-2
                rounded-xl
                font-semibold
                hover:bg-emerald-400
                transition
              "
            >
              Register
            </Link>
          )}
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className="
              md:hidden
              flex
              flex-col
              gap-5
              mt-6
              text-zinc-300
              text-center
          pb-4
        "
          >
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="
            hover:text-emerald-400
            transition
          "
            >
              About
            </Link>

            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="
            hover:text-emerald-400
            transition
          "
            >
              Services
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="
            hover:text-emerald-400
            transition
          "
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
