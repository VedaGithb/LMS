import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../pages/LoginPage";
import { MyLearningPage } from "../../pages/MyLearningPage";
import { HomePage } from "../../pages/HomePage";
import { PublicLayout } from "../../shared/layouts/PublicLayout";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { RegisterPage } from "../../pages/RegisterPage";
import { CoursesPage } from "../../pages/CoursesPage";
import { ProtectedLayout } from "../../shared/layouts/ProtectedLayout";
import { CoursePage } from "../../pages/CoursePage";
import { LessonPage } from "../../pages/LessonPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/courses",
                element: <CoursesPage />,
            },
            {
                path: "/courses/:id",
                element: <CoursePage />
            }
        ]
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: "/my-learning",
                        element: <MyLearningPage />
                    },
                    {
                        path: "/lessons/:id",
                        element: <LessonPage />
                    }
                ]
            }
        ]
    }
]);