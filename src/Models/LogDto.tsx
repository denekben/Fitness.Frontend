// DTO для Users_Logs
export interface UserLog {
    id: number; // Уникальный идентификатор лога
    userId: number; // Идентификатор пользователя
    action: string; // Действие, выполненное пользователем
    timestamp: Date; // Время выполнения действия
    details?: string; // Дополнительные детали (необязательное поле)
}

// DTO для Reports_Logs
export interface ReportLog {
    id: number; // Уникальный идентификатор лога
    reportId: number; // Идентификатор отчета
    action: string; // Действие, выполненное с отчетом
    timestamp: Date; // Время выполнения действия
    details?: string; // Дополнительные детали (необязательное поле)
}

// DTO для Requests_Log
export interface RequestLog {
    id: number; // Уникальный идентификатор лога
    requestId: number; // Идентификатор запроса
    action: string; // Действие, выполненное с запросом
    timestamp: Date; // Время выполнения действия
    details?: string; // Дополнительные детали (необязательное поле)
}