import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  getAllCourses,
  type Course,
} from "../../../functions/CourseFunctions/courseFunctions";
import { getImageUrl } from "../../../utils/imageUtils";

const languages = [
  { name: "HTML", imgSrc: "/assets/homePage/Html.png" },
  { name: "Javascript", imgSrc: "/assets/homePage/Javascript.png" },
  { name: "Java", imgSrc: "/assets/homePage/Java.png" },
  { name: "C++", imgSrc: "/assets/homePage/Cplusplus.png" },
];

const FALLBACK_IMAGES = [
  "/assets/homePage/Dsa1.png",
  "/assets/homePage/Dsa2.png",
];

export default function Languages() {
  const navigate = useNavigate();
  const [topCourses, setTopCourses] = useState<Course[]>([]);

  useEffect(() => {
    getAllCourses({ limit: 2, page: 1 })
      .then((res) => setTopCourses(res.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 lg:mb-20">
          Explore Our Languages
        </h2>

        <div className="grid grid-cols-4 gap-8 mb-24">
          {languages.map((lang) => (
            <div key={lang.name} className="flex flex-col items-center">
              <img
                src={lang.imgSrc}
                alt={`${lang.name} logo`}
                className="w-24 h-24 object-contain mb-3 rounded-lg"
              />
              <p className="font-semibold text-gray-700">{lang.name}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 lg:mb-20">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {topCourses.map((course, index) => {
            const thumbnail =
              getImageUrl(course.thumbnail) ?? FALLBACK_IMAGES[index];
            return (
              <div
                key={course._id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.shortDescription ?? course.description}
                  </p>
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Start Learning
                    <FaArrowRight className="ml-2 text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
