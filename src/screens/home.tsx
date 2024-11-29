import { ExerciseCard } from "@components/exercise";
import { Group } from "@components/group";
import { HomeHeader } from "@components/home-header";
import { Center, Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useState } from "react";
import { FlatList } from "react-native";

export function Home() {
    const [exercises, setExercises] = useState<string[]>(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra', '1', '2', '3', '4', '5', '6'])
    const [groups, setGroups] = useState<string[]>(['Costas', 'Bíceps', 'Tríceps', 'Ombro'])

    const [groupSelected, setGroupSelected] = useState('Costas')

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

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

            <VStack px="$8" >
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
                        Exercícios
                    </Heading>

                    <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                </HStack>

                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => <ExerciseCard name={item} onPress={handleOpenExerciseDetails}/>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 20
                    }}
                    style={{flexShrink: 1}}
                />                
            </VStack>
        </VStack>
    )
}