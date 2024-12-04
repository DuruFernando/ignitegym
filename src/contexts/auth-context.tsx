import { UserDTO } from "@dtos/user-dto";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storage-auth-token";
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

    
    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingUserStorageData(true)
            await storageUserSave(userData)
            await storageAuthTokenSave(token)
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
        
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', {email, password});

            if(data.user && data.token) {            
                setIsLoadingUserStorageData(true)
                await storageUserAndTokenSave(data.user, data.token)
                await userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as  UserDTO)
            await storageUserRemove()
            await storageAuthTokenRemove()
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function loadUserData() {
        try {        
            setIsLoadingUserStorageData(true)

            const userLogged = await storageUserGet()
            const token = await storageAuthTokenGet()

            if(token && userLogged) {
                userAndTokenUpdate(userLogged, token)                
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
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