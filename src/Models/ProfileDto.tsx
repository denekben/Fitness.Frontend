export interface ProfileDto {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string | null;
    birthDate?: Date | null;
    sex?: string | null;
}