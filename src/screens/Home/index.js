import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Input} from 'react-native-elements';
import {FileSystem, Permissions} from 'react-native-unimodules';
import uuid from 'react-native-uuid';
import {Alert, Platform} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/Entypo'; // entypo ,feather ,fantisto ,Ionicons
import ImageBackground from '../../components/ImageBackground';
import {globalStyles} from '../../constants';
import parseUrl from '../../utils/parseUrl';
import extractFileUrl from '../../utils/extractFileUrl';
import InstagramRequest from '../../services/instagramRequest';

const Home = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');

  useEffect(() => {
    onRequestPermission();
  }, []);

  const onRequestPermission = async () => {
    await MediaLibrary.requestPermissionsAsync();
  };

  const onChange = (text) => {
    setEnteredUrl(text);
    console.log(text);
  };

  const handleCheckUrl = async () => {
    console.log('check url', enteredUrl);
    const {url: urlParsed, error: parseError} = parseUrl(enteredUrl);
    if (parseError) {
      Alert.alert('Error', 'Invalid url');
      return;
    }
    const fileData = await InstagramRequest.getFileData(urlParsed);
    const {data, error, type} = extractFileUrl(fileData);
    console.log('error', error, data, type);
    if (error) {
      Alert.alert('Error', 'Try again');
      return;
    }
    setEnteredUrl('');
    setFileUrl(data);
    setMediaType(type);
    console.log(data, type);
    setTimeout(() => {
      downloadFile();
    }, 1000);
  };

  const downloadFile = () => {
    FileSystem.downloadAsync(
      fileUrl,
      FileSystem.documentDirectory +
        uuid.v4() +
        (mediaType === 'GraphVideo' ? '.mp4' : '.jpg'),
    )
      .then(async ({uri}) => {
        MediaLibrary.saveToLibraryAsync(uri).then(() => {
          Alert.alert('Downloaded succesfully', 'Visit your gallery');
        });

        setMediaType(null);
        setFileUrl(null);
      })
      .catch((error) => {
        Alert.alert('Error', JSON.stringify(error));
      });
  };

  const onPressDownload = () => {
    console.log('download', enteredUrl);
    handleCheckUrl();
  };

  return (
    <SafeAreaView>
      <ImageBackground>
        <View style={{flex: 1}}>
          <View style={{alignSelf: 'center', marginTop: 20}}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              Insta Reels Downloader
            </Text>
          </View>

          <View>
            <Input
              placeholder="Enter Instagram Reels/Video Link"
              leftIcon={<Icon name="link" size={24} color="black" />}
              containerStyle={{
                padding: 15,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                paddingStart: 10,
                padding: 5,
                borderRadius: 10,
              }}
              onChangeText={onChange}
              value={enteredUrl}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              width: '40%',
              alignSelf: 'center',
              justifyContent: 'center',
              height: 45,
              borderRadius: 5,
            }}
            onPress={onPressDownload}>
            <Text
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                fontSize: 20,
                color: 'white',
                fontWeight: 'bold',
              }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
