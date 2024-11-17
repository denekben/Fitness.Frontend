import { ProfileDto } from "./ProfileDto";
import { TariffDto } from "./TariffDto";

export interface RequestDto {
    id: number;
    dateTime?: Date;
    subject?: string;
    profile: ProfileDto;
    tariff: TariffDto; 
    isAccepted: boolean;
}

export interface EditRequest {
    id: number;
    dateTime?: Date;
    subject?: string;
    coachId: number,
    tariffId: number
}