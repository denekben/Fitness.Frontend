import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TimeIntervalDto } from "../../Models/TimeIntervalDto";

const api = "http://localhost:5294/api/";

const ProfileTimeIntervals = () => {
    const [isDescending, setIsDescending] = useState(false);
    const isValidDate = (date: Date): boolean => {
        return date instanceof Date && !isNaN(date.getTime());
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [intervalsPerPage] = useState(3);
    const [loadingIntervals, setLoadingIntervals] = useState<boolean>(true);
    const [timeIntervals, setTimeIntervals] = useState<TimeIntervalDto[]>([]);
    const [newInterval, setNewInterval] = useState<TimeIntervalDto>({ start: new Date(), end: new Date() });
    const [editingInterval, setEditingInterval] = useState<TimeIntervalDto | null>(null);

    // Fetch user's time intervals
    const fetchTimeIntervals = async () => {
        try {
            const response = await axios.get<TimeIntervalDto[]>(`${api}intervals/me`, {
                params: { 
                    IsDescending: isDescending,
                    PageNumber: currentPage,
                    PageSize: intervalsPerPage,
                }
            });
            setTimeIntervals(response.data || []);
        } catch (err) {
            toast.error('Ошибка при загрузке временных интервалов.');
        } finally {
            setLoadingIntervals(false);
        }
    };


    // Handle adding a new time interval
    const addTimeInterval = async () => {
        if (newInterval.start >= newInterval.end) {
            toast.warning('Время начала должно быть меньше времени окончания.');
            return;
        }

        try {
            await axios.post(`${api}intervals`, newInterval);
            fetchTimeIntervals(); // Refresh the list after adding
            setNewInterval({ start: new Date(), end: new Date() }); // Reset form
            toast.success('Расписание добавлено!');
        } catch (err) {
            toast.error('Ошибка при добавлении временного интервала.');
        }
    };

    // Handle deleting a time interval
    const deleteTimeInterval = async (id: number) => {
        try {
            await axios.delete(`${api}intervals/${id}`);
            fetchTimeIntervals(); // Refresh the list after deletion
            toast.success('Расписание удалено!');
        } catch (err) {
            toast.error('Ошибка при удалении временного интервала.');
        }
    };

    // Handle updating a time interval
    const updateTimeInterval = async () => {
        if (editingInterval && editingInterval.start >= editingInterval.end) {
            toast.warning('Время начала должно быть меньше времени окончания.');
            return;
        }

        try {
            await axios.put(`${api}intervals`, editingInterval);
            fetchTimeIntervals(); // Refresh the list after updating
            setEditingInterval(null); // Close the edit form
            toast.success('Расписание обновлено!');
        } catch (err) {
            toast.error('Ошибка при обновлении временного интервала.');
        }
    };

    useEffect(() => {
        fetchTimeIntervals();
    }, [currentPage, isDescending]); // Fetch on mount and when pagination/sorting changes

    return (
        <>
            {/* Сортировка */}
            <button 
                className={`mb-4 ${isDescending ? 'bg-gray-300' : 'bg-gray-700'} text-white px-4 py-2 rounded w-full max-w-xl`}
                onClick={() => setIsDescending(!isDescending)}
            >
            {isDescending ? 'Сортировать по возрастанию даты' : 'Сортировать по убыванию даты'}
            </button>

            {/*Добавление*/}
            <div className="flex mt-4 max-w-xl gap-4 pb-4">
            <input 
                type="datetime-local" 
                className="border p-2 rounded w-full max-w-xs"
                value={isValidDate(newInterval.start) ? newInterval.start.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} // Fallback to today's date
                onChange={(e) => {
                    const newStart = new Date(e.target.value);
                    setNewInterval({ ...newInterval, start: isValidDate(newStart) ? newStart : new Date() }); // Validate and set default
                }}
            />
            <input 
                type="datetime-local" 
                className="border p-2 rounded w-full max-w-xs"
                value={isValidDate(newInterval.end) ? newInterval.end.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} // Fallback to today's date
                onChange={(e) => {
                    const newEnd = new Date(e.target.value);
                    setNewInterval({ ...newInterval, end: isValidDate(newEnd) ? newEnd : new Date() }); // Validate and set default
                }}
            />
            <button onClick={addTimeInterval} className="bg-blue-500 text-white rounded px-4 py-2 mb-3">Добавить</button>
            </div>


            {/* Пагинация */}
            <div className="flex justify-between w-full max-w-xl mb-4">
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
                    disabled={timeIntervals.length < intervalsPerPage}
                    className={`px-4 py-2 rounded ${timeIntervals.length < intervalsPerPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
                >
                    Следующая
                </button>
            </div>

            {/* Вывод*/}
            {timeIntervals.length > 0 ? (
            timeIntervals.map(interval => (
                <div key={interval.id} className="bg-gray-100 shadow-lg rounded p-5 w-full max-w-xl text-center mb-3">
                    <h3 className="text-lg font-semibold">{`С ${new Date(interval.start).toLocaleString()} до ${new Date(interval.end).toLocaleString()}`}</h3>
                    <button onClick={() => deleteTimeInterval(interval.id!)} className="mt-2 bg-red-500 text-white rounded px-4 py-1">Удалить</button>
                    <button 
                        onClick={() => setEditingInterval(interval)} 
                        className="mt-2 bg-yellow-500 text-white rounded px-4 py-1"
                    >
                        Изменить
                    </button>
                </div>
            ))
            ) : (
            !loadingIntervals && <p>Нет доступных временных интервалов.</p>
            )}

            {/* Модал редактирования */}
            {editingInterval && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Изменить Временной Интервал</h3>
                    <input 
                        type="datetime-local" 
                        className="border p-2 rounded w-full mb-4"
                        value={editingInterval.start instanceof Date ? editingInterval.start.toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                            const newStart = new Date(e.target.value);
                            if (isValidDate(newStart)) {
                                setEditingInterval(prev => ({ ...prev!, start: newStart }));
                            } else {
                                setEditingInterval(prev => ({ ...prev!, start: new Date() })); // Set to today if invalid
                            }
                        }}
                    />
                    <input 
                        type="datetime-local" 
                        className="border p-2 rounded w-full mb-4"
                        value={editingInterval.end instanceof Date ? editingInterval.end.toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                            const newEnd = new Date(e.target.value);
                            if (isValidDate(newEnd)) {
                                setEditingInterval(prev => ({ ...prev!, end: newEnd }));
                            } else {
                                setEditingInterval(prev => ({ ...prev!, end: new Date() })); // Set to today if invalid
                            }
                        }}
                    />
                    <button 
                        onClick={() => {
                            // Check if start date is less than end date before updating'
                            console.log(editingInterval)
                            if (editingInterval.start >= editingInterval.end) {
                                toast.warning('Время начала должно быть меньше времени окончания.');
                                return;
                            }
                            updateTimeInterval();
                        }} 
                        className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
                    >
                        Сохранить
                    </button>
                    <button onClick={() => setEditingInterval(null)} className="bg-gray-300 text-black rounded px-4 py-2">Отмена</button>
                </div>
            </div>
            )}
        </>
    );
        
}

export default ProfileTimeIntervals;