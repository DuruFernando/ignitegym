import { UserDTO } from "@dtos/user-dto";
import { api } from "@services/api";
import { createContext, ReactNode, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>

}

type AuthContextProviderProps = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', {email, password});

            if(data.user) {
                setUser(data.user)
            }
        } catch (error) {
            throw error
        }
    }
    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {
              children
            }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }