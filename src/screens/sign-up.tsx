import { Center, Heading, Image, Text, VStack, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

import BackgroundImg from "@assets/background.png"
import Logo from '@assets/logo.svg'
import { Input } from "@components/input";
import { Button } from "@components/button";



type formDataProps = {
    name: string
    email: string
    password: string
    password_confirm: string
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
    password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref("password"), ""], "Senhas não conferem")
})

export function SignUp() {
    const { control, handleSubmit, formState: { errors } } = useForm<formDataProps>({
        resolver: yupResolver<formDataProps>(signUpSchema)        
    })

    const navigation = useNavigation()

    function handleGoBack() {
        navigation.goBack()
    }

    function handleSignUp({name, email, password, password_confirm}: formDataProps) {
        
    }

    return (
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}
            automaticallyAdjustKeyboardInsets={true}
            automaticallyAdjustsScrollIndicatorInsets={true}
            bg="$gray700"
            
        >
            <VStack flex={1} bg="$gray700">
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

                    <Center flex={1} gap="$2">
                        <Heading color="$gray100">
                            Crie sua conta
                        </Heading>

                        <Controller
                            control={control}
                            name="name"                            
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Nome"
                                    value={value}
                                    errorMessage={errors.name?.message}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        
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
                                    errorMessage={errors.password?.message}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        
                        <Controller
                            control={control}
                            name="password_confirm"                            
                            render={({ field: { onChange, value } }) => (
                                <Input 
                                    placeholder="Confirme a Senha" 
                                    secureTextEntry
                                    value={value}
                                    errorMessage={errors.password_confirm?.message}
                                    onChangeText={onChange}
                                    onSubmitEditing={handleSubmit(handleSignUp)}
                                    returnKeyType="send"
                                />
                            )}
                        />
                        
                        <Button 
                            title="Criar e acessar"
                            onPress={handleSubmit(handleSignUp)}
                        />
                    </Center>

                   
                    <Button 
                        title="Voltar para o login" 
                        variant="outline"
                        onPress={handleGoBack}
                    />
                </VStack>
            </VStack>
        </ScrollView>
    )
}