export interface ExerciseDto {
    id: number; // Убедитесь, что у вас есть уникальный идентификатор
    repeatQuantity?: number | null;
    setQuantity?: number | null;
    name?: string | null;
}