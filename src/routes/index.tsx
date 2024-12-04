import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { Box } from '@gluestack-ui/themed'
import { AppRoutes } from './app.routes'
import { useContext } from 'react'
import { useAuth } from '@hooks/use-auth'
import { Loading } from '@components/loading'

export function Routes() {
    const { user, isLoadingUserStorageData } = useAuth()

    const theme = DefaultTheme
    theme.colors.background = gluestackUIConfig.tokens.colors.gray700

    if(isLoadingUserStorageData) {
        return <Loading/>
    }
    
    return (
        <Box flex={1} bg="$gray700">
            <NavigationContainer theme={theme}>
                {
                    user.id 
                    ? <AppRoutes />
                    : <AuthRoutes />
                }
            </NavigationContainer>
        </Box>
    )
}