import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const isFocused = useIsFocused();

    const saveObservation = async () => {
        const observationData = {
            speciesName: name,
            imagePath: image,
            latitude: latitude,
            longitude: longitude
        };

        try {
            const response = await fetch('http://192.168.0.121:8080/api/observations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(observationData),
            });

            if (response.ok) {
                console.log('Successfully saved to backend');
                Alert.alert("Success", "Observation saved!");
                setImage(null);
                setName('');
                setLatitude(null);
                setLongitude(null);
            } else {
                Alert.alert("Error", "Failed to save.");
            }
        } catch (error) {
            Alert.alert("Error", "Connection error.");
        }
    };

    const takePicture = async () => {
        // Added a check to ensure that cameraRef is ready and the camera is "mounted"
        if (cameraRef.current) {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                } else {
                    let loc = await Location.getCurrentPositionAsync({});
                    setLatitude(loc.coords.latitude);
                    setLongitude(loc.coords.longitude);
                }

                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setImage(photo.uri);
                }
            } catch (e) {
                console.log("Error taking picture:", e);
                Alert.alert("Error", "Camera is not ready yet.");
            }
        }
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (image) {
        return (
            <View style={styles.container}>
                <Image source={{uri: image}} style={styles.preview} />

                <Text style={{color: 'white', marginBottom: 10}}>
                    Coords: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder={'Enter the name of the species'}
                    value={name}
                    onChangeText={setName}
                />
                <View style={styles.formButtonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, {backgroundColor:'red'}]}
                        onPress={() => {
                            setImage(null);
                            setName('');
                            setLatitude(null);
                            setLongitude(null);
                        }}
                    >
                        <Text style={styles.button_text}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveObservation}
                    >
                        <Text style={styles.button_text}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Render the camera only if the page is active (isFocused) */}
            {isFocused && (
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                />
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={toggleCameraFacing}>
                    <Text style={styles.button_text}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takePicture}>
                    <Text style={styles.button_text}>Take picture</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white'
    },
    camera: {
        aspectRatio: 1,
        margin: '5%',
        borderRadius: 15,
        width: '75%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
        paddingVertical: 64,
        gap: 10
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        overflow: 'hidden',
        paddingVertical: 15
    },
    button_text: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
    preview: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 15,
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        marginBottom: 20,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center'
    },
    formButtonContainer: {
        flexDirection: 'row',
        gap: 20,
        width: '80%',
    },
});