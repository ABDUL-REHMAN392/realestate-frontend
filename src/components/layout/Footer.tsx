import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { MapPin, Phone, Mail } from "lucide-react";

const CITIES = ["Lahore","Islamabad","Karachi","Rawalpindi","Faisalabad","Multan","Peshawar"];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8ede3] mt-0">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.png"
                alt="GharFind"
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-[#6b7280] leading-relaxed mb-6 max-w-xs">
              Pakistan ka sabse behtareen real estate platform. Verified listings, trusted agents, aur real-time property search — sab ek jagah.
            </p>

            {/* Contact */}
            <div className="space-y-3 mb-6">
              {[
                { icon: MapPin, text: "F-7 Markaz, Islamabad, Pakistan" },
                { icon: Phone, text: "+92 300 1234567" },
                { icon: Mail, text: "hello@gharfind.pk" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-[#6b7280] group">
                  <div className="w-7 h-7 rounded-lg bg-[#f0f7e8] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-[#3b6d11]" />
                  </div>
                  <span className="group-hover:text-[#1c1c1c] transition-colors">{text}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {[
                { icon: FaFacebook,  href: "#", label: "Facebook"  },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaTwitter,   href: "#", label: "Twitter"   },
                { icon: FaWhatsapp,  href: "#", label: "WhatsApp"  },
                { icon: FaYoutube,   href: "#", label: "YouTube"   },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[#f5f5f5] border border-[#e8ede3] flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-[#3b6d11] hover:border-[#3b6d11] transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-sm font-bold text-[#1c1c1c] mb-5">
              Properties
            </h4>
            <ul className="space-y-3">
              {[
                { label: "For Sale",    href: "/properties?purpose=sale"      },
                { label: "For Rent",    href: "/properties?purpose=rent"      },
                { label: "Houses",      href: "/properties?type=house"        },
                { label: "Apartments",  href: "/properties?type=apartment"    },
                { label: "Plots",       href: "/properties?type=plot"         },
                { label: "Commercial",  href: "/properties?type=commercial"   },
                { label: "Villas",      href: "/properties?type=villa"        },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6b7280] hover:text-[#3b6d11] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-sm font-bold text-[#1c1c1c] mb-5">
              Top Cities
            </h4>
            <ul className="space-y-3">
              {CITIES.map((city) => (
                <li key={city}>
                  <Link
                    href={`/properties?city=${city}`}
                    className="text-sm text-[#6b7280] hover:text-[#3b6d11] transition-colors flex items-center gap-1.5 group"
                  >
                    <MapPin className="h-3 w-3 text-[#c0dd97] group-hover:text-[#3b6d11] transition-colors flex-shrink-0" />
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#1c1c1c] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Sign In",              href: "/login"                  },
                { label: "Register Free",        href: "/register"               },
                { label: "Dashboard",            href: "/dashboard"              },
                { label: "Saved Properties",     href: "/dashboard/favorites"    },
                { label: "Price Alerts",         href: "/dashboard/alerts"       },
                { label: "Find an Agent",        href: "/agents"                 },
                { label: "Calculator",  href: "/calculator"    },
                { label: "Compare Properties",   href: "/compare"                },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6b7280] hover:text-[#3b6d11] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e8ede3] bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9ca3af]">
            © {new Date().getFullYear()} GharFind. All rights reserved. Made with ❤️ in Pakistan.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy",   href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Cookie Policy",    href: "#" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="text-xs text-[#9ca3af] hover:text-[#3b6d11] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}