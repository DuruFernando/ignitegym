import { HistoryCard } from "@components/history-card";
import { ScreenHeader } from "@components/screen-header";
import { ToastMessage } from "@components/toast-message";
import { HistoryByDayDTO } from "@dtos/history-by-day-dto";
import { VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/app-error";
import { useCallback, useEffect, useState } from "react";
import { SectionList } from "react-native";


export function History() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

    const toast = useToast()
    const navigation = useNavigation<AppNavigatorRoutesProps>()


    async function fetchHistory() {
        try {
            setIsLoading(true)
            const { data } = await api.get(`history`)        
            setExercises(data)
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possível carregar o histórico'

            return toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        title="HISTÓRICO"
                        description={title}
                        action="error"
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory()
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />

            <SectionList
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({item}) => <HistoryCard data={item}/>}
                renderSectionHeader={({ section }) => (
                    <Heading 
                        color="$gray200" 
                        fontSize="$md" 
                        mt="$10" 
                        mb="$3" 
                        fontFamily="$heading"
                    >
                        {section.title}
                    </Heading>
                )}
                style={{
                    paddingHorizontal: 32
                }}
                contentContainerStyle={
                    exercises.length === 0 && {flex: 1, justifyContent: 'center'}
                }
                ListEmptyComponent={() => (
                    <Text color="$gray200" textAlign="center">
                        Não há exercícios registrados hoje. {"\n"}
                        Vamos fazer exercícios hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
            
        </VStack>
    )
}