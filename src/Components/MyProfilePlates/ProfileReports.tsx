import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import { CreateReport, EditReport, ReportDto } from '../../Models/Reports';
import { ExerciseDto } from '../../Models/ExerciseDto';
import { TariffDto } from '../../Models/TariffDto';

const api = "http://localhost:5294/api/";

const ProfileReports = () => {
    const {currentRole} = useAuth();

    const [reports, setReports] = useState<ReportDto[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [searchReports, setSearchReports] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const intervalsPerPage = 1; 
    const [editingReport, setEditingReport] = useState<EditReport | null>(null);

    // Состояние для нового упражнения
    const [newExercise, setNewExercise] = useState<ExerciseDto>({
        id: Date.now(), // Временный ID для нового упражнения
        repeatQuantity: null,
        setQuantity: null,
        name: ''
    });

    const [tariffs, setTariffs] = useState<TariffDto[]>([]);

    useEffect(() => {
        const fetchTariffs = async () => {
            try {
                const response = await axios.get<TariffDto[]>(`${api}tariffs`);
                setTariffs(response.data);
            } catch (error) {
                toast.error('Ошибка при загрузке тарифов:');
            }
        };

        fetchTariffs();
    }, []);

    const fetchUserReports = async () => {
        setLoadingReports(true);
        try {
            const response = await axios.get<ReportDto[]>(`${api}reports/me`, {
                params: { SearchPhrase: searchReports, PageNumber: currentPage, PageSize: intervalsPerPage }
            });
            setReports(response.data || []);
        } catch (error) {
            toast.error('Ошибка при загрузке отчетов:');
            setReports([]);
        } finally {
            setLoadingReports(false);
        }
    };

    const updateReport = async () => {
        if (!editingReport) return;

        try {
            await axios.put(`${api}reports`, editingReport);
            fetchUserReports();
            toast.success("Отчет обновлен!");
        } catch (error) {
            toast.error('Ошибка при обновлении отчета:');
        }
    };

    const deleteReport = async (id: number) => {
        try {
            await axios.delete(`${api}reports/${id}`);
            fetchUserReports();
            toast.success("Отчет удален!");
        } catch (error) {
            toast.error('Ошибка при удалении отчета:');
        }
    };

   // Функция для добавления нового упражнения
   const addExercise = () => {
       if (!editingReport) return;

       // Добавляем новое упражнение в массив упражнений
       const updatedExercises = [...(editingReport.exercises || []), newExercise];
       setEditingReport({ ...editingReport, exercises: updatedExercises });

       // Сбрасываем состояние нового упражнения
       setNewExercise({ id: Date.now(), repeatQuantity: null, setQuantity: null, name: '' });
   };

   // Функция для удаления упражнения
   const deleteExercise = (exerciseId: number) => {
       if (!editingReport) return;

       // Фильтруем массив упражнений
       const updatedExercises = editingReport.exercises.filter(exercise => exercise.id !== exerciseId);
       setEditingReport({ ...editingReport, exercises: updatedExercises });
   };

   useEffect(() => {
       fetchUserReports();
   }, [searchReports, currentPage]);

   return (
       <>
           <h2 className="text-xl text-center font-bold mb-4">Отчеты о тренировках</h2>
           
           <div className="">
               <input 
                   type="text" 
                   placeholder="Поиск отчетов..." 
                   value={searchReports} 
                   onChange={(e) => setSearchReports(e.target.value)} 
                   className="border p-2 rounded w-full mb-3"
               />
           </div>

            {/* Pagination Controls */}
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
                   disabled={reports.length < intervalsPerPage}
                   className={`px-4 py-2 rounded ${reports.length < intervalsPerPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
               >
                   Следующая
               </button>
           </div>


           {reports.length > 0 ? (
               reports.map(report => (
                   <div key={report.id} className="bg-gray-100 p-3 rounded mb-2">
                       <h3 className='text-center'><strong>{report.description || "Без описания"}</strong></h3>
                       <p><strong>Дата и время:</strong> {report.dateTime?.toLocaleString() || "Не указано"}</p>
                       <h4><strong>Профиль:</strong></h4>
                       <p><strong>Имя:</strong> {report.profile.firstName} {report.profile.lastName}</p>
                       {report.profile.phone && <p><strong>Телефон:</strong> {report.profile.phone}</p>}
                       <p><strong>Тариф:</strong> {report.tariff.description || "Не указано"}</p>
                       <p><strong>Цена:</strong> {report.tariff.price} ¥</p>
                       <h4><strong>Упражнения:</strong></h4>
                       {report.exercises.length > 0 ? (
                           report.exercises.map(exercise => (
                               <div key={exercise.id} className="ml-4">
                                   <p><strong>Упражнение:</strong> {exercise.name || "Не указано"}</p>
                                   <p><strong>Количество повторений:</strong> {exercise.repeatQuantity || "Не указано"}</p>
                                   <p><strong>Количество сетов:</strong> {exercise.setQuantity || "Не указано"}</p>

                               </div>
                           ))
                       ) : (
                           <p>Нет доступных упражнений.</p>
                       )}
                       {currentRole() == "Coach" ?
                        <div className="flex justify-center p-1">
                            <button onClick={() => deleteReport(report.id)} className="bg-red-500 text-white rounded px-4 py-1">Удалить</button>
                            <button onClick={() => setEditingReport({
                                id: report.id,
                                description: report.description,
                                dateTime: report.dateTime,
                                tariffId: report.tariff.id,
                                exercises: report.exercises // Передаем упражнения в редактируемый отчет
                            })} className="bg-yellow-500 text-white rounded px-4 py-1">Изменить</button>
                        </div>
                     : <></>}

                   </div>
               ))
           ) : (
               !loadingReports && <p>Нет доступных отчетов.</p>
           )}


           
           {/* Форма редактирования отчета */}
           {editingReport && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                   <div className="bg-gray-200 p-4 rounded mt-4 w-96">
                       <h3 className="text-lg font-bold mb-2">Редактировать отчет</h3>
                       <input
                           type="text"
                           value={editingReport.description || ''}
                           onChange={(e) => setEditingReport({ ...editingReport, description: e.target.value })}
                           placeholder="Описание"
                           className="border p-2 rounded w-full mb-2"
                       />
                       <input
                           type="datetime-local"
                           value={editingReport.dateTime instanceof Date ? editingReport.dateTime.toISOString().slice(0, 16) : ''}
                           onChange={(e) => setEditingReport({ ...editingReport, dateTime: new Date(e.target.value) })}
                           placeholder="Дата и время"
                           className="border p-2 rounded w-full mb-2"
                       />
                       <select
                           value={editingReport.tariffId || ''}
                           onChange={(e) => setEditingReport({ ...editingReport, tariffId: Number(e.target.value) })}
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
                       {editingReport.exercises.map(exercise => (
                           <div key={exercise.id} className="flex justify-between items-center mb-1">
                               <span>{exercise.name || "Не указано"} - Повторы: {exercise.repeatQuantity}, Подходы: {exercise.setQuantity}</span>
                               {/* Кнопка удаления текущего упражнения */}
                               <button onClick={() => deleteExercise(exercise.id)} className="bg-red-500 text-white rounded px-2 py-1">Удалить</button>
                           </div>
                       ))}

                       {/* Кнопки сохранения и отмены */}
                       <button onClick={updateReport} className="bg-blue-500 text-white rounded px-4 py-1">Сохранить изменения</button>
                       <button onClick={() => setEditingReport(null)} className="bg-gray-300 text-black rounded px-4 py-1 ml-2">Отмена</button>
                   </div>
               </div>
           )}
       </>
   );
};
export default ProfileReports;