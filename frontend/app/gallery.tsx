import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

interface Observation {
    id: number;
    speciesName: string;
    imagePath: string;
    latitude: number;
    longitude: number;
    timestamp: string | null;
}

export default function Gallery() {
    const [observations, setObservations] = useState<Observation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchObservations = () => {
        fetch('http://192.168.0.121:8080/api/observations')
            .then(response => response.json())
            .then(data => {
                setObservations(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    // Function for removing an observation from the backend and the user interface
    const deleteObservation = (id: number) => {
        Alert.alert(
            "Delete Observation",
            "Are you sure you want to delete this species from your collection?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.0.121:8080/api/observations/${id}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {
                                // Update the local state by removing the item using a filter
                                setObservations(prev => prev.filter(obs => obs.id !== id));
                            } else {
                                Alert.alert("Error", "Server failed to delete the item.");
                            }
                        } catch (error) {
                            console.error('Error deleting data:', error);
                            Alert.alert("Error", "Could not connect to server.");
                        }
                    }
                }
            ]
        );
    };

    // Use `useFocusEffect` instead of `useEffect` so that the query runs every time the page is loaded
    useFocusEffect(
        useCallback(() => {
            fetchObservations();
        }, [])
    );

    if (loading) {
        // ActivityIndicator to give loading a more professional look
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={{ marginTop: 10 }}>Loading observations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Collection</Text>
            <FlatList
                data={observations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.imagePath }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.infoRow}>
                            <View style={styles.info}>
                                <Text style={styles.speciesName}>{item.speciesName}</Text>
                                <Text style={styles.coords}>
                                    Lat: {item.latitude?.toFixed(4)}, Lon: {item.longitude?.toFixed(4)}
                                </Text>
                            </View>

                            {/* delete-button */}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteObservation(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingTop: 50
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#333'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15
    },
    info: {
        padding: 15,
        flex: 1
    },
    speciesName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    coords: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14
    }
});