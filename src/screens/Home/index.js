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
import {
  Asset,
  Constants,
  FileSystem,
  Permissions,
} from 'react-native-unimodules';
import Icon from 'react-native-vector-icons/Entypo'; //entypo , feather ,fantisto,Ionicons
import ImageBackground from '../../components/ImageBackground';
import {globalStyles} from '../../constants';

const Home = () => {
  const [fileUrl, setFileUrl] = useState('');

  const [enteredUrl, setEnteredUrl] = useState('');

  useEffect(() => {
    console.log(Constants.systemFonts);
  }, []);

  const onChange = (text) => {
    setEnteredUrl(text);
    console.log(text);
  };

  const onPressDownload = () => {
    console.log('download', enteredUrl);
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
