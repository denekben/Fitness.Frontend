import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ReportLog, RequestLog, UserLog } from '../../Models/LogDto';

const api = "http://localhost:5294/api/";

const LogPage: React.FC = () => {
    const [usersLogs, setUsersLogs] = useState<UserLog[]>([]);
    const [reportsLogs, setReportsLogs] = useState<ReportLog[]>([]);
    const [requestsLogs, setRequestsLogs] = useState<RequestLog[]>([]);
    const [loading, setLoading] = useState(true);

    // Функция для загрузки логов
    const fetchLogs = async () => {
        setLoading(true);
        try {

            const [usersResponse, reportsResponse, requestsResponse] = await Promise.all([
                axios.get<UserLog[]>(`${api}logs/users`), // Предполагается, что этот API возвращает Users_Log
                axios.get<ReportLog[]>(`${api}logs/reports`), // Предполагается, что этот API возвращает Reports_Log
                axios.get<RequestLog[]>(`${api}logs/requests`) // Предполагается, что этот API возвращает Requests_Log
            ]);
            setUsersLogs(usersResponse.data);
            setReportsLogs(reportsResponse.data);
            setRequestsLogs(requestsResponse.data);
        } catch (error) {
            toast.error('Ошибка при загрузке логов:');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="flex justify-between">
            <div className="w-1/3 p-4">
                <h2 className="text-xl font-bold mb-2">Users Logs</h2>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border">ID</th>
                                <th className="border">User ID</th>
                                <th className="border">Action</th>
                                <th className="border">Timestamp</th>
                                <th className="border">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="border">{log.id}</td>
                                    <td className="border">{log.userId}</td>
                                    <td className="border">{log.action}</td>
                                    <td className="border">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="border">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="w-1/3 p-4">
                <h2 className="text-xl font-bold mb-2">Reports Logs</h2>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border">ID</th>
                                <th className="border">Report ID</th>
                                <th className="border">Action</th>
                                <th className="border">Timestamp</th>
                                <th className="border">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="border">{log.id}</td>
                                    <td className="border">{log.reportId}</td>
                                    <td className="border">{log.action}</td>
                                    <td className="border">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="border">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="w-1/3 p-4">
                <h2 className="text-xl font-bold mb-2">Requests Logs</h2>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border">ID</th>
                                <th className="border">Request ID</th>
                                <th className="border">Action</th>
                                <th className="border">Timestamp</th>
                                <th className="border">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestsLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="border">{log.id}</td>
                                    <td className="border">{log.requestId}</td>
                                    <td className="border">{log.action}</td>
                                    <td className="border">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="border">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div> 
    );
};

export default LogPage;