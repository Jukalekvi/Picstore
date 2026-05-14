import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';
import ObservationForm from '../components/ObservationForm';

export default function CameraScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [image, setImage] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const isFocused = useIsFocused();

    const saveNewObservation = async (formData: { speciesName: string }) => {
        const observationData = {
            speciesName: formData.speciesName,
            imagePath: image,
            latitude: latitude,
            longitude: longitude
        };

        try {
            const response = await fetch('http://192.168.0.121:8080/api/observations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(observationData),
            });

            if (response.ok) {
                Alert.alert("Success", "Observation saved!");
                resetForm();
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
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    setLatitude(loc.coords.latitude);
                    setLongitude(loc.coords.longitude);
                }

                const photo = await cameraRef.current.takePictureAsync();
                if (photo) setImage(photo.uri);
            } catch (e) {
                console.error("Camera error:", e);
                Alert.alert("Error", "Failed to capture image.");
            }
        }
    }

    const resetForm = () => {
        setImage(null);
        setLatitude(null);
        setLongitude(null);
    };

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // View after taking a picture (The Form)
    if (image) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.formWrapper}>
                    <Text style={styles.formTitle}>New Observation</Text>
                    <ObservationForm
                        initialData={{ speciesName: '', imagePath: image }}
                        onSave={saveNewObservation}
                        onCancel={resetForm}
                        saveButtonText="Save Observation"
                    />
                </View>
            </ScrollView>
        )
    }

    // View while taking a picture (The Camera)
    return (
        <View style={styles.container}>
            <View style={styles.formWrapper}>
                <Text style={styles.formTitle}>Capture Species</Text>

                <View style={styles.cameraWrapper}>
                    {isFocused && (
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing={facing}
                        />
                    )}
                </View>

                <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
                    >
                        <Text style={styles.secondaryButtonText}>Flip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={takePicture}
                    >
                        <Text style={styles.primaryButtonText}>Capture</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingBottom: 40
    },
    formWrapper: {
        width: '100%',
        paddingTop: 60,
        alignItems: 'center'
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20
    },
    cameraWrapper: {
        width: '90%', // Matches the image width in ObservationForm
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#000',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    camera: {
        flex: 1,
    },
    cameraButtonContainer: {
        flexDirection: 'row',
        width: '90%',
        gap: 15,
        marginTop: 20,
        paddingHorizontal: 10
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        paddingVertical: 15,
        elevation: 3
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    message: {
        textAlign: 'center',
        paddingTop: 100
    }
});