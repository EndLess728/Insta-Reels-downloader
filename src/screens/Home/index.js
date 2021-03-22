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
import getDateTime from '../../utils/getDateTime';
import extractFileUrl from '../../utils/extractFileUrl';
import InstagramRequest from '../../services/instagramRequest';
import {Video} from 'expo-av';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Home = () => {
  const [enteredUrl, setEnteredUrl] = useState('');
  const [currentProgress, setProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [localFilURI, setLocalFileURI] = useState('');

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
    console.log('parsed url', urlParsed);
    const fileData = await InstagramRequest.getFileData(urlParsed);
    const {data, error, type, pageUsername} = extractFileUrl(fileData);
    console.log('page username', pageUsername);
    if (error) {
      Alert.alert('Error', 'Try again');
      return;
    }
    setEnteredUrl('');
    downloadFile(data, type, pageUsername);
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

  const downloadFile = async (url, type, pageUsername) => {
    setLoadingState(true);
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory +
        pageUsername +
        getDateTime() +
        (type === 'GraphVideo' ? '.mp4' : '.jpg'),
      {},
      callback,
    );

    try {
      const {uri} = await downloadResumable.downloadAsync();

      console.log('Finished downloading ', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Insta Reels');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Insta Reels', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      setLocalFileURI(uri);
      Alert.alert('Downloaded successfully', 'Visit your gallery');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'something went wrong');
    }
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
          <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Video
              source={{
                uri: localFilURI,
              }}
              rate={1.0}
              volume={1.0}
              shouldPlay={true}
              resizeMode={Video.RESIZE_MODE_CONTAIN}
              useNativeControls={true}
              style={{width: wp('80%'), height: wp('80%')}}
            />
          </View>
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
