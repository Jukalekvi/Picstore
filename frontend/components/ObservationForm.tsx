import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';

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
        <View style={globalStyles.formContainer}>
            <Image source={{ uri: initialData.imagePath }} style={globalStyles.imagePreview} />

            <TextInput
                style={globalStyles.input}
                placeholder="Species name"
                value={name}
                onChangeText={setName}
            />

            <View style={globalStyles.buttonRow}>
                <TouchableOpacity
                    style={[globalStyles.buttonBase, globalStyles.buttonDanger]}
                    onPress={onCancel}
                >
                    <Text style={globalStyles.buttonTextLight}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.buttonBase, globalStyles.buttonPrimary]}
                    onPress={() => onSave({ ...initialData, speciesName: name })}
                >
                    <Text style={globalStyles.buttonTextLight}>{saveButtonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}