import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Input} from 'react-native-elements';
import {FileSystem, Permissions} from 'react-native-unimodules';
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
import {AdMobBanner, AdMobInterstitial, AdMobRewarded} from 'expo-ads-admob';
import {downloadToFolder} from 'expo-file-dl';
import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from 'expo-notifications';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import {Video} from 'expo-av';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = 'DownloadInfo';

const Home = () => {
  const [enteredUrl, setEnteredUrl] = useState('');
  const [currentProgress, setProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [localFilURI, setLocalFileURI] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const admobnterstitial = 'ca-app-pub-4743628857592113/7634608901'; //'ca-app-pub-8434999546031659/9161574888';
  const admobBanner = 'ca-app-pub-4743628857592113/8565203737'; //'ca-app-pub-8434999546031659/8050661438';
  const admobRewarded = 'ca-app-pub-4743628857592113/2738818524';

  async function setNotificationChannel() {
    const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(
      channelId,
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions: NotificationChannelInput = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: 'default',
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions,
      );
    }
  }

  useEffect(() => {
    onRequestPermission();
    setNotificationChannel();
    AdMobRewarded.setAdUnitID(admobRewarded); // Test ID, Replace with your-admob-unit-id
  }, []);

  const fireInterstitial = async () => {
    console.log('hit ads');

    AdMobRewarded.addEventListener(
      'rewardedVideoDidLoad',
      () => console.log('AdMobInterstitial adLoaded'),
      //setLoadingState(false),
    );
    AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (error) =>
      console.warn(error),
    );
    AdMobRewarded.addEventListener(
      'rewardedVideoDidOpen',
      () => console.log('AdMobInterstitial => adOpened'),
      //await downloadToFolder(url, fileName, 'Insta Reels New', channelId),
    );
    AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
      console.log('AdMobInterstitial => adClosed');
      setLoadingState(false);
      // AdMobInterstitial.requestAd().catch((error) => console.warn(error));
    });
    AdMobRewarded.addEventListener('rewardedVideoWillLeaveApplication', () =>
      console.log('AdMobInterstitial => adLeftApplication'),
    );
    await AdMobRewarded.requestAdAsync({servePersonalizedAds: true});
    await AdMobRewarded.showAdAsync();
  };

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
      setLoadingState(false);
      Alert.alert('Error', 'Invalid url');
      return;
    }
    console.log('parsed url', urlParsed);
    const fileData = await InstagramRequest.getFileData(urlParsed);
    const {data, error, type, pageUsername} = extractFileUrl(fileData);
    console.log('page username', pageUsername);
    if (error) {
      setLoadingState(false);
      Alert.alert('Error', 'Try again');
      return;
    }
    setEnteredUrl('');

    downloadFile(data, type, pageUsername);
  };

  const downloadFile = async (url, type, pageUsername) => {
    setVideoUrl(url);
    const fileName =
      pageUsername + getDateTime() + (type === 'GraphVideo' ? '.mp4' : '.jpg');
    fireInterstitial();
    downloadToFolder(url, fileName, 'Insta Reels', channelId).then(
      (checkbool) => {
        if (checkbool) {
          console.log('run only if it is true');
        } else {
          console.warn('Download me error hai');
          setLoadingState(false);
        }
      },
    );
  };

  const onPressDownload = () => {
    console.log('download', enteredUrl);
    setLoadingState(true);
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
              // backgroundColor: 'white',
              marginTop: 20,
              alignSelf: 'center',
            }}>
            <AdMobBanner bannerSize="mediumRectangle" adUnitID={admobBanner} />
          </View>
          {/* <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Video
              source={{
                uri: videoUrl,
              }}
              rate={1.0}
              volume={1.0}
              // shouldPlay={true}
              resizeMode={Video.RESIZE_MODE_CONTAIN}
              useNativeControls
              style={{width: wp('80%'), height: wp('80%')}}
            />
          </View> */}
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
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}>
            <BarIndicator color="white" count={6} size={50} />
            {/* <ActivityIndicator size="large" color="white" /> */}
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
