import { ExerciseDto } from "./ExerciseDto";
import { ProfileDto } from "./ProfileDto";
import { TariffDto } from "./TariffDto";

export interface EditReport {
    id: number,
    description?: string | null,
    dateTime?: Date | null,
    tariffId: number
    exercises: ExerciseDto[];
}

export interface CreateReport {
    description: string;
    dateTime: Date | null;
    tariffId: number | null;
    athleteId: number;
    exercises: ExerciseDto[];
}

export interface ReportDto {
    id: number;
    description?: string;
    dateTime?: Date;
    exercises: ExerciseDto[];
    tariff: TariffDto;
    profile: ProfileDto;
}
