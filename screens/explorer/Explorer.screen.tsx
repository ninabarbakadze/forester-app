import React, { useState, useEffect, useRef } from 'react';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import { requestForegroundPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from 'react-native-paper';
import { navAction } from '../../types/navAction.type';
import googleMapsStyle from '../../utils/googleMapsStyle.json';

interface Props {
  currentMode: navAction;
  changeMode: (action: navAction) => void;
}

export const Explorer = ({ currentMode, changeMode }: Props) => {
  const [location, setLocation] = useState({ latitude: 52.52, longitude: 13.405, latitudeDelta: 0.2, longitudeDelta: 0.2 });
  const [pin, setPin] = useState({ latitude: 52.52, longitude: 13.405 });
  const [displayPin, setDisplayPin] = useState(false);
  const map = useRef(null);
  const getLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('not granted');
      }
      const locations = await watchPositionAsync({ accuracy: Accuracy.High, timeInterval: 10000, distanceInterval: 1 }, (loc) => {
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude: latitude, longitude: longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 });
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(map);
  useEffect(() => {
    callee();
    getCamera();
    setCamera();
    animateCamera();
  }, []);
  const callee = async () => {
    await getLocation();
  };
  console.log('this is my location', location);
  const handleRegionChange = (region: any) => {
    console.log('region', region);
  };
  const handleButtonPressed = () => {
    changeMode('newTree');
    setDisplayPin(true);
    setPin({ latitude: location.latitude, longitude: location.longitude });
  };
  const getCamera = async () => {
    // @ts-ignore
    const camera = await map.getCamera();
    // @ts-ignore
    alert('Current camera', JSON.stringify(camera), [{ text: 'OK' }], {
      cancelable: true,
    });
  };
  const setCamera = async () => {
    // @ts-ignore
    const camera = await map.getCamera();
    // @ts-ignore
    map.setCamera({
      heading: camera.heading + 10,
    });
  };
  const animateCamera = async () => {
    // @ts-ignore
    const camera = await map.getCamera();
    camera.heading += 40;
    camera.pitch += 10;
    camera.altitude += 1000;
    camera.zoom -= 1;
    camera.center.latitude += 0.5;
    // @ts-ignore
    map.animateCamera(camera, { duration: 2000 });
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        customMapStyle={googleMapsStyle}
        minZoomLevel={13}
        maxZoomLevel={18}
        rotateEnabled={false}
        onRegionChange={(region) => handleRegionChange(region)}>
        {displayPin && (
          <Marker
            draggable
            coordinate={pin}
            image={require('../../assets/user-pin.png')}
            title="test-titble"
            onCalloutPress={() => alert('Clicked')}
            onDragEnd={(e) => setPin({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })}></Marker>
        )}
      </MapView>

      <FAB
        icon={'plus'}
        style={{ margin: 16, position: 'absolute', right: 0, bottom: 0 }}
        visible={currentMode === 'explore' ? true : false}
        onPress={() => handleButtonPressed()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8DC027',
  },
});
