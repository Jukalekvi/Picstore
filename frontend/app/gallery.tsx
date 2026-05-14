import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, Modal } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ObservationForm from '../components/ObservationForm';
import { globalStyles } from '@/styles/globalStyles';

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
                fetchObservations();
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
            <View style={globalStyles.centeredContent}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={[globalStyles.container, globalStyles.screenPadding]}>
            <Text style={globalStyles.mainTitle}>Your Collection</Text>

            <Modal visible={editingObservation !== null} animationType="slide">
                <View style={globalStyles.modalContent}>
                    <Text style={globalStyles.modalTitle}>Edit Observation</Text>
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
                    <View style={globalStyles.card}>
                        <Image source={{ uri: item.imagePath }} style={globalStyles.cardImage} />
                        <View style={globalStyles.cardInfoRow}>
                            <View style={globalStyles.cardTextContainer}>
                                <Text style={globalStyles.speciesText}>{item.speciesName}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#E3F2FD', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 }}
                                    onPress={() => setEditingObservation(item)}
                                >
                                    <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#FFEBEE', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 }}
                                    onPress={() => deleteObservation(item.id)}
                                >
                                    <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}