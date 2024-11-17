import axios from "axios"
import { TokensDto } from "../Models/TokensDto"
import { handleError } from "../Helpers/ErrorHandler"
import { toast } from "react-toastify";

const api = "http://localhost:5294/api/";

export const loginAPI = async (email: string, password: string) => {
    try{
        const data = await axios.post<TokensDto>(api + "account/sign-in", {
            email: email,
            password: password
        })
        return data
    } catch(error) {
        console.log(api+"account/sign-in");
        toast.error("Что-то пошло не так");
    }
}

export const registerAPI = async (
    firstName: string,
    lastName: string,
    phone: string | null,
    email: string,
    password: string,
    dateOfBirth: Date | null,
    sex: string | null
 ) => {
    try {
        const data = await axios.post<TokensDto>(api + "account/register", {
            firstName : firstName,
            lastName : lastName,
            phone : phone,
            email : email,
            password : password,
            dateOfBirth : dateOfBirth,
            sex : sex
        })
        return data
    } catch (error) {
        toast.error("Что-то пошло не так");
    }
};