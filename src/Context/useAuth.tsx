import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import React from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { TokensDto } from "../Models/TokensDto"
import { AccessTokenPayload } from "../Models/AccessTokenPayload"
import { UserProfile } from "../Models/UserProfile"
import { loginAPI, registerAPI } from "../Services/AuthService"

type UserContextType ={
    user: UserProfile | null
    token: string | null
    registerUser: (
        firstName: string, 
        lastName: string, 
        phone: string | null,
        email: string,
        password: string,
        dateOfBirth: Date | null,
        sex: string | null) => void
    loginUser: (username:string, password:string) => void
    logout:()=> void
    isLoggedIn: () => boolean
    currentRole: () => string | undefined
}

type Props = {children: React.ReactNode}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({children}: Props) => {
    const navigate = useNavigate()
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<UserProfile | null>(null)
    const[isReady, setIsReady] = useState(false)

    useEffect(()=> {
        const user = localStorage.getItem("user")
        const token = localStorage.getItem("access-token")
        if(user && token) {
            setUser(JSON.parse(user))
            setToken(token)
            axios.defaults.headers.common["Authorization"] = "Bearer " + token
        }
        setIsReady(true)
    },[])

    const registerUser = async (
        firstName: string,
        lastName: string,
        phone: string | null,
        email: string,
        password: string,
        dateOfBirth: Date | null,
        sex: string | null
    ) => {
        try {
            const res = await registerAPI(
                firstName,
                lastName,
                phone,
                email,
                password,
                dateOfBirth,
                sex
            );

            if (res) {
                const tokens : TokensDto = res.data; // Извлекаем токены из ответа
                localStorage.setItem("access-token", tokens.accessToken);
                localStorage.setItem("refresh-token", tokens.refreshToken);

                // Декодируем токен
                const decodedToken = jwtDecode(tokens.accessToken) as AccessTokenPayload;
                
                // Извлекаем информацию о пользователе
                const userObj = {
                    nameid: decodedToken.nameid,
                    unique_name: decodedToken.unique_name, 
                    email: decodedToken.email,
                    role: decodedToken.role
                };

                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(tokens.accessToken);
                setUser(userObj);
                toast.success("Login success!");
                axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken;
                navigate("/me");
            }
        } catch (e) {
            toast.warning("Server error occurred");
        }
    }

    const loginUser = async (
        email: string,
        password: string
    ) => {
        try {
            const res = await loginAPI( email, password );
            if (res) {
                const tokens : TokensDto = res.data; // Извлекаем токены из ответа
                localStorage.setItem("access-token", tokens.accessToken);
                localStorage.setItem("refresh-token", tokens.refreshToken);
    
                // Декодируем токен
                const decodedToken = jwtDecode(tokens.accessToken) as AccessTokenPayload;
                
                // Извлекаем информацию о пользователе
                const userObj = {
                    nameid: decodedToken.nameid,
                    unique_name: decodedToken.unique_name, 
                    email: decodedToken.email,
                    role: decodedToken.role
                };

                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(tokens.accessToken);
                setUser(userObj);
                axios.defaults.headers.common["Authorization"] = "Bearer " + tokens.accessToken;
                toast.success("Login success!");
                navigate("/me");
            }
        } catch (e) {
            toast.warning("Server error occurred");
        }
    };

    const isLoggedIn = () => {
        return !!user
    }

    const currentRole = () => {
        return user?.role
    }

    const logout = () => {
        localStorage.removeItem("access-token")
        localStorage.removeItem("refresh-token")
        localStorage.removeItem("user")
        setUser(null)
        setToken("")
        navigate("/")
    }

    return (
        <UserContext.Provider value ={{loginUser, user, token, logout, isLoggedIn, registerUser, currentRole}}>
            {isReady ? children:null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext)