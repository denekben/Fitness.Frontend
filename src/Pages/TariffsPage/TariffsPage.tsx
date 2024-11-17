import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';

const api = "http://localhost:5294/api/";

interface TariffDto {
    id: number;
    price?: number | null;
    description?: string | null;
}

const TariffsPage: React.FC = () => {
    const {currentRole} = useAuth();

    const [tariffs, setTariffs] = useState<TariffDto[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tariffsPerPage] = useState(3); // Number of tariffs per page
    const [isDescending, setIsDescending] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(3000); // Default maximum price

    // Состояние для нового тарифа
    const [newTariff, setNewTariff] = useState<TariffDto>({ id: 0, price: null, description: '' });
    // Состояние для редактируемого тарифа
    const [editingTariff, setEditingTariff] = useState<TariffDto | null>(null);

    // Function to fetch tariffs
    const fetchTariffs = async (pageNumber: number = currentPage) => {
        try {
            const response = await axios.get<TariffDto[]>(`${api}tariffs`, {
                params: { 
                    PageNumber: pageNumber,
                    PageSize: tariffsPerPage,
                    SearchPhrase: searchPhrase,
                    IsDescending: isDescending,
                    MinPrice: minPrice,
                    MaxPrice: maxPrice
                }
            });
            console.log(response.data);
            // Ensure response.data is an array
            if (Array.isArray(response.data)) {
                setTariffs(response.data);
                setError("");
            } else {
                setTariffs([]); // Reset to empty array if response is not valid
            }
        } catch (err) {
            setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    // Функция для добавления нового тарифа
    const addTariff = async () => {
        try {
            await axios.post(`${api}tariffs`, newTariff);
            toast.success("Тариф добавлен!");
            fetchTariffs(); // Обновляем список тарифов
            setNewTariff({ id: 0, price: null, description: '' }); // Сбрасываем форму
        } catch (error) {
            console.error('Ошибка при добавлении тарифа:', error);
            toast.error("Ошибка при добавлении тарифа.");
        }
    };

    // Функция для обновления тарифа
    const updateTariff = async () => {
        if (!editingTariff) return;

        try {
            await axios.put(`${api}tariffs/`, editingTariff);
            toast.success("Тариф обновлен!");
            fetchTariffs(); // Обновляем список тарифов
            setEditingTariff(null); // Закрываем форму редактирования
        } catch (error) {
            console.error('Ошибка при обновлении тарифа:', error);
            toast.error("Ошибка при обновлении тарифа.");
        }
    };

    // Функция для удаления тарифа
    const deleteTariff = async (id: number) => {
        try {
            await axios.delete(`${api}tariffs/${id}`);
            toast.success("Тариф удален!");
            fetchTariffs(); // Обновляем список тарифов
        } catch (error) {
            console.error('Ошибка при удалении тарифа:', error);
            toast.error("Ошибка при удалении тарифа.");
        }
    };

    useEffect(() => {
        fetchTariffs(currentPage);
    }, [currentPage, searchPhrase, isDescending, minPrice, maxPrice]); // Dependencies for updates

    // Pagination logic
    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1)); // Prevent page from being less than 1
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Тарифы</h1>
            
            
            {/*Поиск*/}
            <input 
                type="text" 
                placeholder="Поиск по описанию..." 
                className="border p-2 mb-4 rounded w-full max-w-xl"
                value={searchPhrase} 
                onChange={(e) => setSearchPhrase(e.target.value)} 
            />
            <div className="flex space-x-4 mb-4">
                <input 
                    type="number" 
                    placeholder="Минимальная цена" 
                    className="border p-2 rounded w-full max-w-xl" // Updated max-w to match tariff cards
                    value={minPrice} 
                    onChange={(e) => {
                        const value = e.target.value; // Get the string value from the input
                        if (value === '' || isNaN(Number(value))) {
                            setMinPrice(0); // Set to 0 if empty or invalid
                        } else {
                            const numericValue = Number(value);
                            setMinPrice(numericValue < 0 ? 0 : numericValue); // Ensure it's not negative
                        }
                    }} 
                />
                <input 
                    type="number" 
                    placeholder="Максимальная цена" 
                    className="border p-2 rounded w-full max-w-xl" // Updated max-w to match tariff cards
                    value={maxPrice} 
                    onChange={(e) => {
                        const value = e.target.value; // Similar handling for max price
                        if (value === '' || isNaN(Number(value))) {
                            setMaxPrice(0); // Set to 0 if empty or invalid
                        } else {
                            const numericValue = Number(value);
                            setMaxPrice(numericValue < 0 ? 0 : numericValue); // Ensure it's not negative
                        }
                    }} 
                />
            </div>
            <button 
                className={`mb-3 ${isDescending ? 'bg-gray-300' : 'bg-gray-700'} text-white px-4 py-2 rounded w-full max-w-xl`}
                onClick={() => setIsDescending(!isDescending)}
            >
                {isDescending ? 'Сортировать по возрастанию цены' : 'Сортировать по убыванию цены'}
            </button>
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Pagination */}
            <div className="flex justify-between w-full max-w-xl">
                <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Предыдущая
                </button>
                <div className="flex items-center">
                    <span>{`Страница ${currentPage}`}</span>
                </div>
                <button 
                    onClick={handleNextPage} 
                    disabled={tariffs.length < tariffsPerPage}
                    className={`px-4 py-2 rounded ${tariffs.length < tariffsPerPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Следующая
                </button>
            </div>
            
            {/* Отображение списка тарифов */}
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {tariffs.length > 0 ? (
                tariffs.map(tariff => (
                    <div key={tariff.id} className="bg-gray-100 shadow-lg rounded text-medium text-gray-900 p-5 mt-3 w-full max-w-xl text-center">
                        <h2 className="text-xl font-semibold">{`Цена: ${tariff.price?.toFixed(2)} ¥`}</h2>
                        <p><strong>Описание:</strong> {tariff.description || 'Не указано'}</p>
                        {currentRole() === "Coach" ? (
                        <>
                            <button onClick={() => { setEditingTariff(tariff); }} className="bg-yellow-500 text-white rounded px-2 py-1">Редактировать</button>
                            <button onClick={() => deleteTariff(tariff.id)} className="bg-red-500 text-white rounded px-2 py-1 ml-2">Удалить</button>
                        </>) 
                        : null}
                    </div>
                ))
            ) : (
                !loading && <p>Нет доступных тарифов.</p>
            )}


             {currentRole() === "Coach" ? (
                <>
                    {/* Форма для добавления нового тарифа */}
                    <h2 className="text-xl font-bold mb-2">Добавить новый тариф</h2>
                    <input 
                        type="text" 
                        placeholder="Описание" 
                        className="border p-2 mb-2 rounded w-full max-w-xl"
                        value={newTariff.description ?? ''} 
                        onChange={(e) => setNewTariff({ ...newTariff, description: e.target.value })} 
                    />
                    <input 
                        type="number" 
                        placeholder="Цена" 
                        className="border p-2 mb-2 rounded w-full max-w-xl"
                        value={newTariff.price || ''} 
                        onChange={(e) => setNewTariff({ ...newTariff, price: Number(e.target.value) })} 
                    />
                    <button onClick={addTariff} className="bg-green-500 text-white px-4 py-2 rounded">Добавить</button>
                </>
            ) : null}

            {/* Форма редактирования тарифа */}
            {editingTariff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-200 p-4 rounded mt-4 w-96">
                        <h3 className="text-lg font-bold mb-2">Редактировать тариф</h3>
                        <input
                            type="text"
                            value={editingTariff.description || ''}
                            onChange={(e) => setEditingTariff({ ...editingTariff, description: e.target.value })}
                            placeholder="Описание"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="number"
                            value={editingTariff.price || ''}
                            onChange={(e) => setEditingTariff({ ...editingTariff, price: Number(e.target.value) })}
                            placeholder="Цена"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button onClick={updateTariff} className="bg-blue-500 text-white rounded px-4 py-1">Сохранить изменения</button>
                        <button onClick={() => setEditingTariff(null)} className="bg-gray-300 text-black rounded px-4 py-1 ml-2">Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Обработчик нажатия на кнопку "Оставить заявку"
const handleApply = (tariffId: number) => {
    alert(`Заявка на тариф с ID ${tariffId} отправлена!`);
};

export default TariffsPage;

export {};