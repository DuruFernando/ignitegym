import { UserDTO } from "@dtos/user-dto";
import { api } from "@services/api";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storage-user";
import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    isLoadingUserStorageData: boolean

}

type AuthContextProviderProps = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState<boolean>(true)

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', {email, password});

            if(data.user) {
                setUser(data.user)
                storageUserSave(data.user)
            }
        } catch (error) {
            throw error
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as  UserDTO)
            await storageUserRemove()
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function loadUserData() {
        try {        
            const userLogged = await storageUserGet()

            if(userLogged) {
                setUser(userLogged)
                setIsLoadingUserStorageData(false)
            }
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoadingUserStorageData }}>
            {
              children
            }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }