import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
    name: string
}

export function ExerciseCard({name, ...rest}: Props) {
    return (
        <TouchableOpacity activeOpacity={0.5} {...rest}>
            <HStack 
                bg="$gray500" 
                alignItems="center" 
                p="$2"
                pr="$4"
                rounded="$md"
                mb="$3"
            >
                <Image
                    source={{
                        uri: 'data:image/jpeg;base64,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'
                    }}
                    alt="Imagem do exercício"
                    h="$16"
                    w="$16"
                    rounded="$md"
                    mr="$4"
                    resizeMode="cover"
                />

                <VStack>
                    <Heading 
                        fontSize="$lg"
                        color="$white"
                        fontFamily="$heading"
                    >
                        {name}
                    </Heading>

                    <Text
                        fontSize="$sm"
                        color="$gray200"
                        mt="$1"
                        numberOfLines={2}
                        fontFamily="$body"
                    >
                        3 séries x 12 repetições
                    </Text>
                </VStack>

                <Icon as={ChevronRight} color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}