import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
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
                        <View style={styles.info}>
                            <Text style={styles.speciesName}>{item.speciesName}</Text>
                            <Text style={styles.coords}>
                                Lat: {item.latitude?.toFixed(4)}, Lon: {item.longitude?.toFixed(4)}
                            </Text>
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
    info: {
        padding: 15
    },
    speciesName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    coords: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    }
});