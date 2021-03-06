import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import getRealm from '~/services/realm'
import { Keyboard } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import defaultRoomImg from '../../assets/default-room.jpg'


import { Container, ButtonComeBack, Title, Form, Input, Button, TextSubmit, ButtonGetImage, Room, TextImage } from './styles';

export default function NewProject() {

  const route = useRoute()
  const projectId = route.params.projectId

  const [ID, setID] = useState()
  const [name, setName] = useState('')
  const [room, setRoom] = useState(defaultRoomImg)

  const [error, setError] = useState(false)

  // data base
  async function saveRepository() {

    setID(Math.floor(Math.random() * 100000))
    console.log(ID);

    const data = {
      id: ID,
      projetoId: Number(projectId),
      nome: name,
      image: room.uri
    };



    const realm = await getRealm()


    realm.write(() => {
      realm.create('Ambiente', data, 'never')
    })


    return data
  }

  async function handleAddRepository() {
    try {
      if (name === '') {
        setError(true)
      } else {
        await saveRepository()
        setName('')
        setError(false)
        Keyboard.dismiss()
        navigateToProjectRegistred()
      }

    } catch (err) {
      setError(true)
      console.log('deu erro');
    }
  }

  // Navigation
  const navigation = useNavigation()

  function navigateToProject() {
      navigation.navigate('ProjectScreen')
    }

  function navigateToProjectRegistred() {
      navigation.navigate('ProjectScreen', { registred: true })
  }

  const options = {
    title: 'Selecione uma foto do ambiente',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  function getImage() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (!response.uri) {
        console.log(`uri not found`);
        return
      }
      else {
        // const source = { uri: response.uri };
        // You can also display the image using data:
        setRoom(response)
        //  = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    })
  }

  return (
    <Container>
        <ButtonComeBack onPress={() => navigateToProject()}>
          <AntDesign name="left" size={22} color="#fff" />
        </ButtonComeBack>
        <Title>Criar novo ambiente</Title>
      <Form
      error={error}
      >

        <Input
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          placeholder="Nome do ambiente:"
        />

        <ButtonGetImage onPress={getImage}>
          <Room source={room} />
          <TextImage>Selecione uma imagem</TextImage>
        </ButtonGetImage>

        <Button onPress={handleAddRepository}>
          <TextSubmit>Cadastrar</TextSubmit>
        </Button>

      </Form>
    </Container>
  );
}
