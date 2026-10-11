import { useMemo, useState } from "react"
import type { Course } from "../types"

export const useCourseFilter = (courses: Course[] = []) => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categoryArray = useMemo(() => Array.from(new Set(courses.map((item) => item.category))), [courses]);

    const query = searchQuery.trim().toLowerCase();
    const filteredCourses = useMemo(() => courses.filter((course) => {
        const matchesCategory =
            selectedCategory === "all" || course.category === selectedCategory;

        const matchesSearch =
            !query ||
            course.title.toLowerCase().includes(query) ||
            (course.technologies?.some((tech: string) =>
                tech.toLowerCase().includes(query)
            ));

        return matchesCategory && matchesSearch;
    }), [courses, selectedCategory, query]);

    return { filteredCourses, categoryArray, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }
}