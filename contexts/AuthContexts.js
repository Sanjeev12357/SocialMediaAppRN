import { createContext, useContext, useState } from "react";

const AuthCOntext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);

    const setAuth=authUser=>{
        setUser(authUser);
    }

    const setUserData=userData=>{
        setUser({...userData});
    }

    return (
        <AuthCOntext.Provider value={{user,setAuth,setUserData}}>
            {children}
        </AuthCOntext.Provider>
    )
}

export const useAuth=()=>useContext(AuthCOntext);