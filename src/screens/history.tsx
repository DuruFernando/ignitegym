import { HistoryCard } from "@components/history-card";
import { ScreenHeader } from "@components/screen-header";
import { VStack, Text, Heading } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";

interface ExercisesType {
 title: string,
 data: string[]
}

export function History() {
    const [exercises, setExercises] = useState<ExercisesType[]>([
        {
            title: '28.11.24',
            data: ["Puxada frontal", "Remada unilateral"]
        },
        {
            title: '28.11.24',
            data: ["Puxada frontal"]
        },
    ])

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />

            <SectionList
                sections={exercises}
                keyExtractor={item => item}
                renderItem={() => <HistoryCard/>}
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