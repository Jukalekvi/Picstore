import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, Modal } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import ObservationForm from '../components/ObservationForm';
import { useTheme } from '@/context/ThemeContext';
import { getGlobalStyles } from '@/styles/globalStyles';
import { CATEGORIES } from "@/constants/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Observation {
    id: number;
    speciesName: string;
    imagePath: string;
    latitude: number;
    longitude: number;
    timestamp: string | null;
    categoryId: number;
}

export default function Gallery() {
    const { colors } = useTheme();
    const styles = getGlobalStyles(colors);

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

    const updateObservation = async (formData: { speciesName: string, categoryId: number }) => {
        if (!editingObservation) return;

        try {
            const response = await fetch(`http://192.168.0.121:8080/api/observations/${editingObservation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editingObservation, // Keep existing fields like coordinates
                    speciesName: formData.speciesName,
                    categoryId: formData.categoryId
                }),
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
            <View style={styles.centeredContent}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.screenPadding]}>
            <Text style={styles.mainTitle}>Your Collection</Text>

            <Modal visible={editingObservation !== null} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Observation</Text>
                    {editingObservation && (
                        <ObservationForm
                            initialData={{
                                speciesName: editingObservation.speciesName,
                                imagePath: editingObservation.imagePath,
                                categoryId: editingObservation.categoryId
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
                        <View style={styles.cardInfoRow}>
                            <View style={styles.cardTextContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    {/* Category Icon - Set to black as requested */}
                                    <View style={{
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        padding: 6,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <MaterialCommunityIcons
                                            name={(CATEGORIES.find(c => c.id === item.categoryId)?.icon || 'help-circle') as any}
                                            size={22}
                                            color="#000000"
                                        />
                                    </View>
                                    <Text style={styles.speciesText}>{item.speciesName}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: colors.infoLight, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                                    onPress={() => setEditingObservation(item)}
                                >
                                    <MaterialCommunityIcons name="pencil" size={18} color={colors.secondary} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: colors.dangerLight, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
                                    onPress={() => deleteObservation(item.id)}
                                >
                                    <MaterialCommunityIcons name="trash-can" size={18} color={colors.danger} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}