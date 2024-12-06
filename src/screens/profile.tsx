import { Button } from "@components/button";
import { Input } from "@components/input";
import { ScreenHeader } from "@components/screen-header";
import { UserPhoto } from "@components/user-photo";
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { useState } from "react";
import { ToastMessage } from "@components/toast-message";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/use-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/app-error";
import { api } from "@services/api";
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

type FormDataProps = {
    name: string
    email: string
    password?: string | null | undefined
    old_password?: string | null | undefined
    confirm_password?: string | null | undefined
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().email().required(),
    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 dígitos.')
        .nullable()
        .transform((value) => !!value ? value : null),
    old_password: yup
        .string()
        .min(6, 'A senha antiga deve ter pelo menos 6 dígitos.')
        .nullable()
        .transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('password'), ""], 'A confirmação de senha não confere.')
        .when('password', {
            is: (Field: any) => Field,
            then: (schema) => schema
                .required('Informe a confirmação de senha.')
                .transform((value) => !!value ? value : null)
            
        }),
})
export function Profile() {
    const [updating, setUpdating] = useState(false)
    const toast = useToast()
    const { user, updateUserProfile } = useAuth()

    const { control, handleSubmit, formState: {errors}  } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    })

    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4,4],
                quality: 1,
            })

            if(photoSelected.canceled){
                return
            }

            const asset = photoSelected.assets[0]

            if(asset.uri) {
                const photoInfo = await FileSystem.getInfoAsync(asset.uri) as {
                    size: number
                }

                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
                    return toast.show({
                        placement: 'top',
                        render: ({ id }) => (
                            <ToastMessage
                                id={id}
                                title="Imagem"
                                description="Essa imagem é muito grande. Escolha uma de até 5MB"
                                action="error"
                                onClose={() => toast.close(id)}
                            />
                        )
                    })
                }

                const fileExtension = asset.uri.split('.').pop();
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
                    uri: asset.uri,
                    type: `${asset.type}/${fileExtension}`
                } as any

                const userPhotoUploadForm = new FormData()

                userPhotoUploadForm.append('avatar', photoFile)

                const avatartUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })

                const userUpdated = user
                userUpdated.avatar = avatartUpdatedResponse.data.avatar
                updateUserProfile(userUpdated)

                toast.show({
                    placement: 'top',
                    render: ({ id }) => (
                        <ToastMessage
                            id={id}
                            title="FOTO"
                            description='Foto atualizada'
                            action="success"
                            onClose={() => toast.close(id)}
                        />
                    )
                })
            }
        } catch (err){
            console.log(err)
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setUpdating(true)
            const userUpdated = user
            userUpdated.name = data.name

            await api.put('users', data)

            await updateUserProfile(userUpdated)
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        title="PERFIL"
                        description='Perfil atualizado com sucesso'
                        action="success"
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício'

            return toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        title="EXERCÍCIO"
                        description={title}
                        action="error"
                        onClose={() => toast.close(id)}
                    />
                )
            })
        } finally {
            setUpdating(false)
        }
    }

    return (
        <VStack>
            <ScreenHeader title="Perfil" />           

            <ScrollView 
                showsVerticalScrollIndicator={true}
                automaticallyAdjustKeyboardInsets={true}
                automaticallyAdjustsScrollIndicatorInsets={true}
                contentContainerStyle={{ flexGrow: 1}}
            >
                <Center mt="$6" px="$10">
                    <UserPhoto 
                        source={user.avatar 
                            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                            : defaultUserPhotoImg
                        }
                        alt="Imagem do usuário"
                        size="xl"
                    />

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text 
                            color="$green500" 
                            fontFamily="$heading" 
                            fontSize="$md"
                            mt="$2"
                            mb="$8"
                        >
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>

                    <Center w="$full" gap="$4" mt="$6">
                        <Controller
                            control={control}
                            name="name"                            
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    bg="$gray600"
                                    value={value}
                                    onChangeText={onChange}
                                    errorMessage={errors.name?.message}
                                />                               
                            )}
                        />    

                        <Controller
                            control={control}
                            name="email"                            
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    bg="$gray600"
                                    isReadOnly
                                    value={value}
                                    onChangeText={onChange}
                                />                               
                            )}
                        />                                            
                    </Center>

                    <Heading 
                        alignSelf="flex-start"
                        fontFamily="$heading"
                        color="$gray200"
                        fontSize="$md"
                        mt="$12"
                        mb="$2"
                    >
                        Alterar senha
                    </Heading>

                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="old_password"                            
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Senha antiga"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                />                            
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"                            
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Nova senha"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />                            
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"                            
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Confirme a nova senha"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.confirm_password?.message}
                                />                            
                            )}
                        />

                        <Button title="Atualizar" isLoading={updating} onPress={handleSubmit(handleProfileUpdate)}/>
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}