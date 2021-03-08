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
import ProgressCircle from 'react-native-progress-circle';
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
  const [currentProgress, setProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(false);

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
    downloadFile(data, type);
  };

  const callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    console.log(downloadProgress, progress.toFixed(2) * 100, '%');
    setProgress(progress * 100);
    if (progress >= 1 || progress < 0) {
      setProgress(0);
      setLoadingState(false);
    }
  };

  const downloadFile = async (url, type) => {
    setLoadingState(true);
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory +
        uuid.v1() +
        (type === 'GraphVideo' ? '.mp4' : '.jpg'),
      {},
      callback,
    );

    try {
      const {uri} = await downloadResumable.downloadAsync();

      console.log('Finished downloading ', uri);
      MediaLibrary.saveToLibraryAsync(uri).then(() => {
        Alert.alert('Downloaded succesfully', 'Visit your gallery');
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'something went wrong');
    }
  };

  // FileSystem.downloadAsync(
  //   url,
  //   FileSystem.documentDirectory +
  //     uuid.v1() +
  //     (type === 'GraphVideo' ? '.mp4' : '.jpg'),
  // )
  //   .then(async ({uri}) => {
  //     MediaLibrary.saveToLibraryAsync(uri).then(() => {
  //       Alert.alert('Downloaded succesfully', 'Visit your gallery');
  //     });

  //     setMediaType(null);
  //     setFileUrl(null);
  //   })
  //   .catch((error) => {
  //     Alert.alert('Error', JSON.stringify(error));
  //   });
  // };

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
        {loadingState && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <ProgressCircle
              percent={currentProgress}
              radius={70}
              borderWidth={10}
              color="red"
              shadowColor="#999"
              bgColor="#fff">
              <Text style={{fontSize: 28}}>{`${currentProgress.toFixed(
                2,
              )}%`}</Text>
            </ProgressCircle>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
