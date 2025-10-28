import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-700">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 md:mb-0">Code Hub</h1>
        <div className="flex space-x-5 text-2xl">
          <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
          <FaLinkedinIn className="hover:text-blue-400 cursor-pointer" />
          <FaInstagram className="hover:text-pink-500 cursor-pointer" />
          <FaXTwitter className="hover:text-sky-400 cursor-pointer" />
          <FaYoutube className="hover:text-red-600 cursor-pointer" />
        </div>
      </div>

      <hr className="border-gray-700 my-8" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-300">
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-white inline-block">
            Company
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Get Started
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-white inline-block">
            Account
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-white">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                My Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Preferences
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Purchase
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-white inline-block">
            Courses
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-white">
                Html & CSS
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Javascript
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                React JS
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Node JS
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-white inline-block">
            Company
          </h3>
          <form className="flex flex-col space-y-4 text-white">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-md border-gray-700 focus:border-white border-1 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-100 text-black font-semibold py-3 rounded-md hover:bg-white transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
