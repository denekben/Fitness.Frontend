import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {EditRequest, RequestDto} from '../../Models/Requests';
import { useAuth } from '../../Context/useAuth';
import { TariffDto } from '../../Models/TariffDto';
import { CreateReport } from '../../Models/Reports';
import { ExerciseDto } from '../../Models/ExerciseDto';

const api = "http://localhost:5294/api/";

const ProfileRequests = () => {
    const {currentRole} = useAuth();
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPerPage] = useState(2); // Number of requests per page
    const [isDescending, setIsDescending] = useState(false);
    const [createReport, setCreateReport] = useState<CreateReport | null>(null);

    // State for managing tariffs
    const [tariffs, setTariffs] = useState<TariffDto[]>([]);

    // State for managing the edit modal
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<EditRequest | null>(null);

    // Состояние для нового упражнения
    const [newExercise, setNewExercise] = useState<ExerciseDto>({
        id: Date.now(), // Временный ID для нового упражнения
        repeatQuantity: null,
        setQuantity: null,
        name: ''
    });

    // Function to fetch user requests
    const fetchUserRequests = async (pageNumber: number = currentPage) => {
        try {
            const response = await axios.get<RequestDto[]>(`${api}requests/me`, {
                params: { 
                    IsDescending: isDescending,
                    SearchPhrase: searchPhrase,
                    PageNumber: pageNumber,
                    PageSize: requestsPerPage
                }
            });
            if (Array.isArray(response.data)) {
                setRequests(response.data);
                setError(null);
            } else {
                setRequests([]);
            }
        } catch (err) {
            console.error('Error fetching user requests:', err);
        } finally {
            setLoading(false);
        }
    };

        // Fetch available tariffs
    const fetchTariffs = async () => {
        try {
            const response = await axios.get<TariffDto[]>(`${api}tariffs`);
            if (Array.isArray(response.data)) {
                setTariffs(response.data);
            }
        } catch (err) {
            console.error('Error fetching tariffs:', err);
        }
    };

    useEffect(() => {
        fetchUserRequests(currentPage);
        fetchTariffs(); // Fetch tariffs when component mounts
    }, [currentPage, searchPhrase, isDescending]);


     // Function to delete a request
     const deleteRequest = async (id: number) => {
        try {
            await axios.delete(`${api}requests/${id}`);
            toast.success("Запрос удален!");
            fetchUserRequests(); // Refresh the request list
        } catch (error) {
            console.error('Ошибка при удалении запроса:', error);
            toast.error("Ошибка при удалении запроса.");
        }
    };

    // Function to update a request
    const updateRequest = async () => {
        if (!editingRequest) return;

        try {
            await axios.put(`${api}requests`, editingRequest); // Make sure the endpoint is correct
            toast.success("Запрос обновлен!");
            fetchUserRequests(); // Refresh the request list
            setEditModalOpen(false); // Close the edit modal
        } catch (error) {
            console.error('Ошибка при обновлении запроса:', error);
            toast.error("Ошибка при обновлении запроса.");
        }
    };

    // Function to accept a request
    const acceptRequest = async (id: number) => {
        try {
            await axios.patch(`${api}requests/${id}`); // Adjust the endpoint as necessary
            toast.success("Запрос принят!");
            fetchUserRequests(); // Refresh the request list
        } catch (error) {
            console.error('Ошибка при принятии запроса:', error);
            toast.error("Ошибка при принятии запроса.");
        }
    };

    const addReport = async () => {
        if(!createReport) return;
            await axios.post(`${api}reports`, createReport);
            toast.success("Отчет добавлен!");
        try{

        } catch(error){
            toast.error('Ошибка при создании отчета:');
        }
    }

       // Функция для добавления нового упражнения
    const addExercise = () => {
        if (!createReport) return;

        // Добавляем новое упражнение в массив упражнений
        const updatedExercises = [...(createReport.exercises || []), newExercise];
        setCreateReport({ ...createReport, exercises: updatedExercises });

        // Сбрасываем состояние нового упражнения
        setNewExercise({ id: Date.now(), repeatQuantity: null, setQuantity: null, name: '' });
    };

    // Функция для удаления упражнения
    const deleteExercise = (exerciseId: number) => {
        if (!createReport) return;

        // Фильтруем массив упражнений
        const updatedExercises = createReport.exercises.filter(exercise => exercise.id !== exerciseId);
        setCreateReport({ ...createReport, exercises: updatedExercises });
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Запросы</h1>
            <input 
                type="text" 
                placeholder="Поиск по теме..." 
                className="border p-2 mb-4 rounded w-full max-w-xl"
                value={searchPhrase} 
                onChange={(e) => setSearchPhrase(e.target.value)} 
            />
            <button 
                onClick={() => setIsDescending(prev => !prev)}
                className={`mb-3 ${isDescending ? 'bg-gray-300' : 'bg-gray-700'} text-white px-4 py-2 rounded w-full max-w-xl`}
            >
                {isDescending ? 'Сортировать по возрастанию цены' : 'Сортировать по убыванию цены'}
            </button>
            
            {/* Пагинация */}
            <div className="flex justify-between w-full max-w-xl">
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
                    disabled={requests.length < requestsPerPage}
                    className={`px-4 py-2 rounded ${requests.length < requestsPerPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Следующая
                </button>
            </div>

            {requests.length > 0 ? (
                requests.map(request => (
                    <div key={request.id} className="bg-gray-100 shadow-lg rounded text-medium text-gray-900 p-5 mt-3 w-full max-w-xl text-center">
                        <h2 className="text-xl font-semibold">{request.subject || 'Без темы'}</h2>
                        <p><strong>Дата и время:</strong> {request.dateTime?.toLocaleString() || "Не указано"}</p>
                        <p><strong>Тариф:</strong> {request.tariff?.description || 'Не указано'}</p>
                        <p><strong>Цена:</strong> {request.tariff?.price ?? 'отсутствует'} ¥</p>
                        <p><strong>Профиль:</strong> {request.profile.firstName} {request.profile.lastName}</p>
                        <p><strong>Статус:</strong> {request.isAccepted ? 'Принято' : 'Ожидает'}</p>

                        {/* Action Buttons */}
                        <div className="flex justify-center mt-3 space-x-2">
                            {currentRole() === "Athlete" ? (
                                <div>
                                    <button onClick={() => {setEditingRequest({id: request.id, dateTime: request.dateTime, subject: request.subject, coachId: request.profile.id, tariffId: request.tariff.id}); setEditModalOpen(true); }} className="bg-yellow-500 text-white rounded px-2 py-1">Изменить</button>
                                    <button onClick={() => deleteRequest(request.id)} className="bg-red-500 text-white rounded px-2 py-1">Удалить</button>
                                </div>
                            ) : (
                                <>
                                {!request.isAccepted && (
                                    <button onClick={() => acceptRequest(request.id)} className="bg-green-500 text-white rounded px-2 py-1">Принять</button>
                                )}
                                <button onClick={() => 
                                    setCreateReport({ description: 'Новый отчет', dateTime: new Date(), tariffId: request.tariff.id, athleteId: request.profile.id , exercises: []})} 
                                    className="bg-green-500 text-white rounded px-4 py-2">
                                        Добавить отчет
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                !loading && <p>Нет доступных запросов.</p>
            )}

            {/* Edit Request Modal */}
            {isEditModalOpen && editingRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-200 p-4 rounded mt-4 w-96">
                        <h3 className="text-lg font-bold mb-2">Изменить запрос</h3>
                        <input
                            type="text"
                            value={editingRequest.subject || ''}
                            onChange={(e) => setEditingRequest({ ...editingRequest, subject: e.target.value })}
                            placeholder="Тема"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="datetime-local"
                            value={editingRequest.dateTime instanceof Date ? editingRequest.dateTime.toISOString().slice(0, 16) : ''}
                            onChange={(e) => setEditingRequest({ ...editingRequest, dateTime: new Date(e.target.value) })}
                            placeholder="Дата и время"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <select 
                            value={editingRequest.tariffId || ''} 
                            onChange={(e) => setEditingRequest({ ...editingRequest, tariffId: tariffs.find(tariff => tariff.id === Number(e.target.value))?.id ?? 0})}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="">Выберите тариф</option>
                            {tariffs.map(tariff => (
                                <option key={tariff.id} value={tariff.id}>{`${tariff.description} - ${tariff.price} ¥`}</option>
                            ))}
                        </select>
                        <button onClick={updateRequest} className="bg-blue-500 text-white rounded px-4 py-1">Сохранить изменения</button>
                        <button onClick={() => setEditModalOpen(false)} className="bg-gray-300 text-black rounded px-4 py-1 ml-2">Отмена</button>
                    </div>
                </div>
            )}

            {/*Форма создания*/}
            {createReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-gray-200 p-4 rounded mt-4 w-96">
                    <h3 className="text-lg font-bold mb-2">Редактировать отчет</h3>
                    <input
                        type="text"
                        value={createReport.description || ''}
                        onChange={(e) => setCreateReport({ ...createReport, description: e.target.value })}
                        placeholder="Описание"
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input
                        type="datetime-local"
                        value={createReport.dateTime instanceof Date ? createReport.dateTime.toISOString().slice(0, 16) : ''}
                        onChange={(e) => setCreateReport({ ...createReport, dateTime: new Date(e.target.value) })}
                        placeholder="Дата и время"
                        className="border p-2 rounded w-full mb-2"
                    />
                    <select
                        value={createReport.tariffId || ''}
                        onChange={(e) => setCreateReport({ ...createReport, tariffId: Number(e.target.value) })}
                        className="border p-2 rounded w-full mb-2"
                    >
                        <option value="">Выберите тариф</option>
                        {tariffs.map(tariff => (
                            <option key={tariff.id} value={tariff.id}>{tariff.description} - {tariff.price} ¥</option>
                        ))}
                    </select>

                    {/* Форма для добавления нового упражнения */}
                    <h4 className="text-md font-bold mb-2">Добавить новое упражнение</h4>
                    <input
                        type="text"
                        value={newExercise.name ?? ''}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        placeholder="Название упражнения"
                        className="border p-2 rounded w-full mb-1"
                    />
                    <input
                        type="number"
                        value={newExercise.repeatQuantity || ''}
                        onChange={(e) => setNewExercise({ ...newExercise, repeatQuantity: Number(e.target.value) })}
                        placeholder="Количество повторений"
                        className="border p-2 rounded w-full mb-1"
                    />
                    <input
                        type="number"
                        value={newExercise.setQuantity || ''}
                        onChange={(e) => setNewExercise({ ...newExercise, setQuantity: Number(e.target.value) })}
                        placeholder="Количество подходов"
                        className="border p-2 rounded w-full mb-1"
                    />
                    {/* Кнопка добавления нового упражнения */}
                    <button onClick={addExercise} className="bg-green-500 text-white rounded px-4 py-1 mb-2">Добавить упражнение</button>

                    {/* Список текущих упражнений */}
                    <h4 className="text-md font-bold mb-2">Текущие упражнения</h4>
                    {createReport.exercises.map(exercise => (
                        <div key={exercise.id} className="flex justify-between items-center mb-1">
                            <span>{exercise.name || "Не указано"} - Повторы: {exercise.repeatQuantity}, Подходы: {exercise.setQuantity}</span>
                            {/* Кнопка удаления текущего упражнения */}
                            <button onClick={() => deleteExercise(exercise.id)} className="bg-red-500 text-white rounded px-2 py-1">Удалить</button>
                        </div>
                    ))}

                    {/* Кнопки сохранения и отмены */}
                    <button onClick={addReport} className="bg-blue-500 text-white rounded px-4 py-1">Сохранить отчет</button>
                    <button onClick={() => setCreateReport(null)} className="bg-gray-300 text-black rounded px-4 py-1 ml-2">Отмена</button>
                </div>
            </div>
            )}
        </>
    );
};

export default ProfileRequests;

