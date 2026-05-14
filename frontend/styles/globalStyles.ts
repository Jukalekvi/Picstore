import { StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES } from './theme';

export const globalStyles = StyleSheet.create({
    // --- LAYOUTS ---
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
    },
    screenPadding: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.header,
    },
    mainTitle: {
        fontSize: SIZES.fontMainTitle,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.l,
        color: COLORS.textMain,
    },

    // --- CARDS (Gallery) ---
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusCard,
        marginBottom: SPACING.m,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
    cardInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: SPACING.m,
    },
    cardTextContainer: {
        padding: SPACING.m,
        flex: 1,
    },
    speciesText: {
        fontSize: SIZES.fontLarge,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },

    // --- FORMS & INPUTS ---
    formWrapper: {
        width: '100%',
        paddingTop: SPACING.modalTop,
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        padding: SPACING.l,
    },
    input: {
        backgroundColor: COLORS.surface,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        fontSize: SIZES.fontLarge,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    imagePreview: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: SIZES.radiusCard,
        marginBottom: 20,
    },

    // --- BUTTONS ---
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    buttonBase: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZES.radiusButton,
        paddingVertical: 15,
        elevation: 3,
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonSecondary: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    buttonDanger: {
        backgroundColor: COLORS.danger,
    },
    buttonTextLight: {
        color: COLORS.textLight,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextDark: {
        color: COLORS.textMain,
        fontWeight: 'bold',
        fontSize: 16,
    },

    // --- CAMERA SPECIFIC ---
    cameraWrapper: {
        width: '90%',
        aspectRatio: 1,
        borderRadius: SIZES.radiusCard,
        overflow: 'hidden',
        backgroundColor: COLORS.black,
        elevation: 5,
    },
    cameraButtonContainer: {
        flexDirection: 'row',
        width: '90%',
        gap: SPACING.m,
        marginTop: 20,
    },

    // --- MODALS ---
    modalContent: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: SPACING.modalTop,
    },
    modalTitle: {
        fontSize: SIZES.fontTitle,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: COLORS.textMain,
    }
});