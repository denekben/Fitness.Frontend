import React from "react";
import logo from "./logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

interface Props {}

const Navbar = (props: Props) => {
  const {isLoggedIn, user, logout, currentRole} = useAuth()
  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
        <Link to="/">
            <img src={logo} alt="" className="w-20 h-auto"/>
        </Link>
          <div className="hidden font-bold lg:flex">
            <Link to="/coaches" className="text-black hover:text-darkBlue text-lg">
              Тренеры
            </Link>
          </div>
          <div className="hidden font-bold lg:flex">
            <Link to="/tariffs" className="text-black hover:text-darkBlue text-lg">
              Тарифы
            </Link>
          </div>
          {currentRole() === "Coach" ? (
            <div className="hidden font-bold lg:flex">
            <Link to="/logs" className="text-black hover:text-darkBlue text-lg">
              Логи
            </Link>
          </div>
          ) : null}
        </div>
        {isLoggedIn() ? (
          <div className="hidden sm:flex items-center space-x-6 text-back">
          <Link to="/me" className="hover:text-darkBlue">Здравствуйте, {user?.unique_name}!</Link>
          <a
            onClick={logout}
            className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
          >
            Выйти
          </a>
        </div>
        ) : (
          <div className="hidden sm:flex items-center space-x-6 text-back">
            <Link className="hover:text-darkBlue" to={"/login"}>Войти</Link>
            <Link
              to="/register"
              className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
            >
              Зарегистрироваться
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;