import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import CoachesPage from "../Pages/CoachesPage/CoachesPage";
import TariffsPage  from "../Pages/TariffsPage/TariffsPage";
import ProtectedRoute from "./ProtectedRoute";
import MyProfilePage from "../Pages/MyProfilePage/MyProfilePage";
import LogPage from "../Pages/LogPage/LogPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage />},
            {path: "login", element: <LoginPage />},
            {path: "register", element: <RegisterPage />},
            {path: "coaches", element: <CoachesPage />},
            {path: "tariffs", element: <TariffsPage />},
            {path: "me",
                element: <ProtectedRoute> <MyProfilePage/> </ProtectedRoute>
            },
            {path: "logs",
                element: <ProtectedRoute> <LogPage/> </ProtectedRoute>
            }
        ]
    }
])