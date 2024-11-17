import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import {ProfileDto} from "../../Models/ProfileDto";

const api = "http://localhost:5294/api/";

const Profile = () => {
    const {currentRole} = useAuth();
    const [userInfo, setUserInfo] = useState<ProfileDto | null>(null);

    // Fetch current user info
    const fetchCurrentUserInfo = async () => {
        try {
            const response = await axios.get<ProfileDto>(`${api}users/me`);
            setUserInfo(response.data);
        } catch (err) {
            toast.error('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        } 
    };

    useEffect(() => {
        fetchCurrentUserInfo();
    }, []);

    return <>
        <h1 className="text-xl text-center font-bold mb-4">Профиль {currentRole() == "Athlete" ? "гакусея" : "сенсея"}</h1>
        {userInfo && (
            <div className="bg-gray-100 shadow-lg rounded p-5 w-full max-w-xl text-center mb-4">
                <h2 className="text-xl font-semibold">{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                <p><strong>Телефон:</strong> {userInfo.phone || 'Не указан'}</p>
                <p><strong>Дата рождения:</strong> {userInfo.birthDate ? new Date(userInfo.birthDate).toLocaleDateString() : 'Не указана'}</p>
                <p><strong>Пол:</strong> {userInfo.sex || 'Не указан'}</p>
            </div>
        )}
        <h1 className="text-xl font-bold mb-4 text-center">Мое расписание</h1>
    </>

}

export default Profile;

export {};