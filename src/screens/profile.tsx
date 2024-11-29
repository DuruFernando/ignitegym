import { Button } from "@components/button";
import { Input } from "@components/input";
import { ScreenHeader } from "@components/screen-header";
import { UserPhoto } from "@components/user-photo";
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useState } from "react";
import { ToastMessage } from "@components/toast-message";

export function Profile() {
    const [userPhoto, setUserPhoto] = useState("https://github.com/DuruFernando.png")
    const toast = useToast()

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

                setUserPhoto(asset.uri)
            }
        } catch (err){
            console.log(err)
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
                        source={{
                            uri: userPhoto
                        }}
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
                        <Input
                            placeholder="Nome"
                            bg="$gray600"
                        />
                        <Input
                            value="fernando.santos@gmail.com"
                            bg="$gray600"
                            isReadOnly
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
                        <Input
                            placeholder="Senha antiga"
                            bg="$gray600"
                            secureTextEntry
                        />
                        <Input
                            placeholder="Nova senha"
                            bg="$gray600"
                            secureTextEntry
                        />
                        <Input
                            placeholder="Confirme a nova senha"
                            bg="$gray600"
                            secureTextEntry
                        />

                        <Button title="Atualizar"/>
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}