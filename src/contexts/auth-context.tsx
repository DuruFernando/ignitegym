import { UserDTO } from "@dtos/user-dto";
import { createContext, ReactNode, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    setUser: (user: UserDTO) => void

}

type AuthContextProviderProps = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState({
        id: '1', 
        name: 'Fernando',
        email: 'fernando@gmail.com',
        avatar: 'fernando.png'
    })
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {
              children
            }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }