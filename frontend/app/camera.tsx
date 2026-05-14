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
                Alert.alert("Success", "Observation saved!");
                setImage(null);
                setName('');
                setLatitude(null);
                setLongitude(null);
            } else {
                Alert.alert("Error", "Failed to save observation.");
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert("Error", "Could not connect to the server.");
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                // Request location before taking the picture
                let { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    console.warn('Location permission denied');
                } else {
                    let loc = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced
                    });
                    setLatitude(loc.coords.latitude);
                    setLongitude(loc.coords.longitude);
                }

                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    setImage(photo.uri);
                }
            } catch (e) {
                console.error("Camera error:", e);
                Alert.alert("Error", "Failed to capture image.");
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
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    // Preview mode after taking a photo
    if (image) {
        return (
            <View style={styles.container}>
                <Image source={{uri: image}} style={styles.preview} />

                {/* Form fields - Coordinates hidden from user */}
                <TextInput
                    style={styles.input}
                    placeholder={'Species name'}
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.formButtonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, {backgroundColor:'#f44336'}]}
                        onPress={() => {
                            setImage(null);
                            setName('');
                            setLatitude(null);
                            setLongitude(null);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveObservation}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    // Standard camera view
    return (
        <View style={styles.container}>
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
                    <Text style={styles.buttonText}>Flip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takePicture}>
                    <Text style={styles.buttonText}>Capture</Text>
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
        backgroundColor: '#121212',
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
        width: '85%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 40,
        gap: 15
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 15
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    preview: {
        width: '85%',
        aspectRatio: 1,
        borderRadius: 15,
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '85%',
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        marginBottom: 20,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center'
    },
    formButtonContainer: {
        flexDirection: 'row',
        gap: 15,
        width: '85%',
    },
});