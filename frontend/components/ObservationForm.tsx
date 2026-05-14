import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';

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
    const { colors } = useTheme();
    const styles = getGlobalStyles(colors);
    const [name, setName] = useState(initialData.speciesName);

    return (
        <View style={styles.formContainer}>
            <Image source={{ uri: initialData.imagePath }} style={styles.imagePreview} />

            <TextInput
                style={styles.input}
                placeholder="Species name"
                placeholderTextColor={colors.textMain + '80'}
                value={name}
                onChangeText={setName}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.buttonBase, styles.buttonDanger]}
                    onPress={onCancel}
                >
                    <Text style={styles.buttonTextLight}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonBase, styles.buttonPrimary]}
                    onPress={() => onSave({ ...initialData, speciesName: name })}
                >
                    <Text style={styles.buttonTextLight}>{saveButtonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}