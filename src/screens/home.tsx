import { ExerciseCard } from "@components/exercise";
import { Group } from "@components/group";
import { HomeHeader } from "@components/home-header";
import { Loading } from "@components/loading";
import { ToastMessage } from "@components/toast-message";
import { ExerciseDTO } from "@dtos/exercise-dto";
import { Center, Heading, HStack, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/app-error";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";

export function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [groups, setGroups] = useState<string[]>([])
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])

    const [groupSelected, setGroupSelected] = useState('Antebraço')

    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const toast = useToast()

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate('exercise', { exerciseId })
    }

    async function fetchGroups () {
        try {
            const { data } = await api.get('/groups')
            setGroups(data)
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares'

            return toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        title="GRUPOS MUSCULARES"
                        description={title}
                        action="error"
                        onClose={() => toast.close(id)}
                    />
                )
            })
        }
    }

    async function fetchExerciseByGroups () {
        try {
            setIsLoading(true)

            const { data } = await api.get(`/exercises/bygroup/${groupSelected}`)
            setExercises(data)
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios'

            return toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        title="EXERCÍCIOS"
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

    useEffect(() => {
        fetchGroups()
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExerciseByGroups()
    }, [groupSelected]))
    return (
        <VStack>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group 
                        name={item}   
                        isActive={groupSelected.toLowerCase() === item.toLowerCase()} 
                        onPress={() => 
                        setGroupSelected(item)} 
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
            />

            {
                isLoading
                ?   <Loading/>
                :   <VStack px="$8" >
                        <HStack justifyContent="space-between" mb="$5" alignItems="center">
                            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
                                Exercícios
                            </Heading>

                            <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)}/>}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 20
                            }}
                            style={{flexShrink: 1}}
                        />                
                    </VStack>
            }
            
        </VStack>
    )
}