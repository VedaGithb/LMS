import {api} from "../../../shared/api/axios";
import type {Enrollment, MyEnrollmentsResponse} from "../types";

export const enrollCourse = async (courseId: number): Promise<Enrollment> => {
    const response = await api.post("/enrollments", {courseId});
    return response.data;
}

export const getMyEnrollments = async (): Promise<MyEnrollmentsResponse> => {
    const response = await api.get("/enrollments/my");
    return response.data;
}