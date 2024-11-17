import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/useAuth';
import { toast } from 'react-toastify';
import { ProfileDto } from '../../Models/ProfileDto';
import { TariffDto } from '../../Models/TariffDto';
import { useNavigate } from 'react-router';

const api = "http://localhost:5294/api/";

const CoachesPage: React.FC = () => {
    const { isLoggedIn, currentRole } = useAuth(); 

    const [coaches, setCoaches] = useState<ProfileDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [subject, setSubject] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [coachesPerPage] = useState(3);
    const [isDescending, setIsDescending] = useState(false);
    const [sex, setSex] = useState<string>(''); 

    // State for managing requests
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
    const [tariffs, setTariffs] = useState<TariffDto[]>([]);
    const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
    const [requestDateTime, setRequestDateTime] = useState<Date | null>(null);
    
    const navigate = useNavigate();

    // Fetch coaches
    const fetchCoaches = async (pageNumber: number = currentPage) => {
        try {
            const response = await axios.get<ProfileDto[]>(api + "users/coaches", {
                params: { 
                    PageNumber: pageNumber,
                    PageSize: coachesPerPage,
                    SearchPhrase: searchPhrase,
                    IsDescending: isDescending,
                    Sex: sex 
                }
            });
            setCoaches(response.data);
        } catch (err) {
            setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch tariffs
    const fetchTariffs = async () => {
        try {
            const response = await axios.get<TariffDto[]>(`${api}tariffs`);
            if (Array.isArray(response.data)) {
                setTariffs(response.data);
            } else {
                setError('Unexpected data format');
            }
        } catch (err) {
            console.error('Ошибка при загрузке тарифов:', err);
        }
    };

    // Send request
    const sendRequest = async () => {
        if (selectedCoachId === null){
            toast.error("Ошибка при отправке заявки.");
            return;
        } 
        
        try {
            await axios.post(`${api}requests`, {
                DateTime: requestDateTime,
                Subject: subject ?? 'Новая заявка',
                CoachId: selectedCoachId,
                TariffId: selectedTariffId
            });
            toast.success("Заявка отправлена!");
            setRequestModalOpen(false); // Close modal after sending request
        } catch (error) {
            toast.error("Ошибка при отправке заявки.");
        }
    };

    useEffect(() => {
        fetchCoaches(currentPage);
        fetchTariffs(); // Fetch tariffs when component mounts
    }, [currentPage, searchPhrase, isDescending, sex]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Тренеры</h1>
            <input 
                type="text" 
                placeholder="Поиск по имени..." 
                className="border p-2 mb-4 rounded w-full max-w-xl"
                value={searchPhrase} 
                onChange={(e) => setSearchPhrase(e.target.value)} 
            />
            <select 
                className="border p-2 mb-4 rounded w-full max-w-xl"
                value={sex} 
                onChange={(e) => setSex(e.target.value)}
            >
                <option value="">Все мастера</option>
                <option value="M">Кун</option>
                <option value="F">Тян</option>
            </select>
            <button 
                className={`${isDescending ? 'bg-gray-300' : 'bg-gray-700'} text-white px-4 py-2 rounded w-full max-w-xl`}
                onClick={() => setIsDescending(!isDescending)}
            >
                {isDescending ? 'Сортировать по убыванию житейского опыта' : 'Сортировать по вохрастанию житейского опыта'}
            </button>
            
            {/* Pagination */}
            <div className="flex justify-between mt-3 w-full max-w-xl">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Предыдущая
                </button>
                <span>{`Страница ${currentPage}`}</span>
                <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={coaches.length < coachesPerPage}
                    className={`px-4 py-2 rounded ${coaches.length < coachesPerPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Следующая
                </button>
            </div>
            
            {coaches.map(coach => (
                <div key={coach.id} className="bg-gray-100 shadow-lg rounded text-medium text-gray-900 p-5 mt-3 w-full max-w-xl text-center">
                    <h2 className="text-xl font-semibold">{`${coach.firstName} ${coach.lastName}`}</h2>
                    <p className="mt-2"><strong>Телефон:</strong> {coach.phone || 'Не указан'}</p>
                    <p><strong>Дата рождения:</strong> {coach.birthDate ? new Date(coach.birthDate).toLocaleDateString() : 'Не указана'}</p>
                    <p><strong>Пол:</strong> {coach.sex || 'Не указан'}</p>
                    {currentRole() !== "Coach" ? 
                        <div className="flex justify-center">
                            <button 
                                className="mt-3 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200" 
                                onClick={() => {
                                    if (!isLoggedIn()) {
                                        navigate("/login"); // Перенаправляем на страницу логина
                                    } else {
                                        setSelectedCoachId(coach.id); // Устанавливаем выбранный ID тренера
                                        fetchTariffs(); // Получаем тарифы для этого тренера
                                        setRequestModalOpen(true); // Открываем модальное окно запроса
                                    }
                                }}
                            >
                                Оставить заявку
                            </button>
                        </div>
                    : null}
                </div>
            ))}
            {/* Modal for creating a request */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-200 p-4 rounded mt-4 w-96">
                        <h3 className="text-lg font-bold mb-2">Создать заявку</h3>
                        <input
                            type="text" 
                            placeholder="Введите подробности..." 
                            className="border p-2 mb-4 rounded w-full max-w-xl"
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                        />
                        <select 
                            value={selectedTariffId || ''} 
                            onChange={(e) => setSelectedTariffId(Number(e.target.value))}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="">Выберите тариф</option>
                            {tariffs.map(tariff => (
                                <option key={tariff.id} value={tariff.id}>{`${tariff.description} - ${tariff.price} ¥`}</option>
                            ))}
                        </select>
                        <input 
                            type="datetime-local"
                            onChange={(e) => setRequestDateTime(new Date(e.target.value))}
                            placeholder="Дата и время"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button onClick={sendRequest} className="bg-blue-500 text-white rounded px-4 py-1">Отправить</button>
                        <button onClick={() => setRequestModalOpen(false)} className="bg-gray-300 text-black rounded px-4 py-1 ml-2">Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachesPage;

export {};