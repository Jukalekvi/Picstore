import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface ObservationFormData {
    speciesName: string;
    imagePath: string;
}

interface Props {
    initialData: ObservationFormData;
    onSave: (data: ObservationFormData) => void;
    onCancel: () => void;
    saveButtonText?: string;
}

export default function ObservationForm({ initialData, onSave, onCancel, saveButtonText = "Save" }: Props) {
    const [name, setName] = useState(initialData.speciesName);

    return (
        <View style={styles.formContainer}>
            <Image source={{ uri: initialData.imagePath }} style={styles.preview} />

            <TextInput
                style={styles.input}
                placeholder="Species name"
                value={name}
                onChangeText={setName}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={() => onSave({ ...initialData, speciesName: name })}
                >
                    <Text style={styles.buttonText}>{saveButtonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
    },
    preview: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 15,
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 15,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});