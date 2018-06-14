import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import { fetchLocationId, fetchWeather } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import SearchInput from './components/SearchInput';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: ''
    }
  }
  componentDidMount(){
    this.setState({
      weather: 'Clear',
    })
    this.handleUpdateLocation('Kharkiv')
  }
  handleUpdateLocation = async city => {
    if(!city) return;

    this.setState({loading: true}, async() => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(locationId);
        this.setState({
          loading:false,
          error: false,
          location,
          weather,
          temperature
        });
      } catch(e) {
        this.setState({
          loading: false,
          error: true
        });
      }
    })
  }
  render() {
    const { location, loading, error, weather, temperature } = this.state;

    let content = null;
    
    if(!loading && error){
      content = (
        <Text style={[styles.smallText, styles.textStyle]}>
          Could not load weather, please try a different city
        </Text>
      )
    }else if(!loading && !error){
      content = (
        <View>
          <Text style={[styles.largeText, styles.textStyle]}>
            {location}
          </Text>
          <Text style={[styles.smallText, styles.textStyle]}>
            {weather}
          </Text>
          <Text style={[styles.smallText, styles.textStyle]}>
            {`${ Math.round(temperature)}°`}
          </Text>
        </View>
      )
    }
    return (
      <KeyboardAvoidingView style={styles.container}  behavior="padding">
        <StatusBar barStyle="light-content" />
          <ImageBackground source={getImageForWeather(weather)} style={styles.imageContainer} imageStyle={styles.image}>
            <View style={styles.detailsContainer}>
              <ActivityIndicator animating={loading} color="white" size="large" />
                <View>
                    {content}
                    <SearchInput placeholder="Search any city" onSubmit={this.handleUpdateLocation}/>
                </View>
            </View>
          </ImageBackground>
    </KeyboardAvoidingView>
  );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E'
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios'
      ? 'AvenirNext-Regular'
      : 'Roboto'
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20

  }
});
