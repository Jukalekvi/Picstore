import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, Modal } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ObservationForm from '../components/ObservationForm'; // Path to our new shared component

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
    const [editingObservation, setEditingObservation] = useState<Observation | null>(null);

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

    const updateObservation = async (formData: { speciesName: string }) => {
        if (!editingObservation) return;

        try {
            const response = await fetch(`http://192.168.0.121:8080/api/observations/${editingObservation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Alert.alert("Success", "Observation updated!");
                setEditingObservation(null);
                fetchObservations(); // Refresh the list
            } else {
                Alert.alert("Error", "Failed to update.");
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert("Error", "Could not connect to server.");
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchObservations();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Collection</Text>

            {/* Modal for editing an observation */}
            <Modal visible={editingObservation !== null} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Observation</Text>
                    {editingObservation && (
                        <ObservationForm
                            initialData={{
                                speciesName: editingObservation.speciesName,
                                imagePath: editingObservation.imagePath
                            }}
                            onSave={updateObservation}
                            onCancel={() => setEditingObservation(null)}
                            saveButtonText="Update"
                        />
                    )}
                </View>
            </Modal>

            <FlatList
                data={observations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.imagePath }} style={styles.cardImage} />
                        <View style={styles.infoRow}>
                            <View style={styles.info}>
                                <Text style={styles.speciesName}>{item.speciesName}</Text>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => setEditingObservation(item)}
                                >
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteObservation(item.id)}
                                >
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    card: { backgroundColor: 'white', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 3 },
    cardImage: { width: '100%', height: 200 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15 },
    info: { padding: 15, flex: 1 },
    speciesName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    actionButtons: { flexDirection: 'row', gap: 10 },
    editButton: { backgroundColor: '#E3F2FD', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    editButtonText: { color: '#1976D2', fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#FFEBEE', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    deleteButtonText: { color: '#D32F2F', fontWeight: 'bold' },
    modalContent: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Identical to Camera screen
        paddingTop: 60
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333'
    }
});