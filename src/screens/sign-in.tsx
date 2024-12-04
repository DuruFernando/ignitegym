import { Center, Heading, Image, Text, VStack, ScrollView } from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png"
import Logo from '@assets/logo.svg'
import { Input } from "@components/input";
import { Button } from "@components/button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/use-auth";
import { Controller, useForm } from "react-hook-form";

type FormData = {
    email: string, 
    password: string
}

export function SignIn() {
    const { signIn } = useAuth()
    const navigation = useNavigation<AuthNavigatorRoutesProps>()

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

    function handleNewAccount() {
        navigation.navigate('signUp')
    }

    async function handleSignIn ({email, password}: FormData) {
        await signIn(email, password)
    }

    return (
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1}>
                <Image 
                    source={BackgroundImg} 
                    alt="Pessoas Treinando"
                    w="$full"
                    h={624}
                    defaultSource={BackgroundImg}
                    position="absolute"
                />

                <VStack
                    flex={1}
                    px="$10"
                    pb="$16"
                >
                    <Center my="$24">
                        <Logo/>

                        <Text color="$gray100" fontSize="$sm">
                            Treine sua mente e o seu corpo
                        </Text>
                    </Center>

                    <Center gap="$2">
                        <Heading color="$gray100">
                            Acesse a conta
                        </Heading>

                        <Controller
                            control={control}
                            name="email"                            
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="E-mail"
                                    keyboardType="email-address" 
                                    autoCapitalize="none"
                                    value={value}
                                    errorMessage={errors.email?.message}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"                            
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Senha"
                                    secureTextEntry
                                    value={value}
                                    errorMessage={errors.email?.message}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Button title="Acessar" onPress={handleSubmit(handleSignIn)}/>
                    </Center>

                    <Center 
                        flex={1}
                        justifyContent="flex-end"
                        mt="$4"
                    >
                        <Text color="$gray100" fontFamily="$body" fontSize="$sm" mb="$3">Ainda não tem acesso?</Text>
                        <Button 
                            title="Criar conta" 
                            variant="outline" 
                            onPress={handleNewAccount}
                        />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}