import { StyleSheet } from 'react-native';
import { SPACING, SIZES } from './theme';

export const getGlobalStyles = (colors: any) => StyleSheet.create({
    // --- LAYOUTS ---
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        backgroundColor: colors.background,
    },
    screenPadding: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.header
    },
    mainTitle: {
        fontSize: SIZES.fontMainTitle,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.l,
        color: colors.textMain,
    },

    // --- CARDS (Gallery) ---
    card: {
        backgroundColor: colors.surface,
        borderRadius: SIZES.radiusCard,
        marginBottom: SPACING.m,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    cardImage: {
        width: '100%',
        height: 200
    },
    cardInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: SPACING.m
    },
    cardTextContainer: {
        padding: SPACING.m,
        flex: 1
    },
    speciesText: {
        fontSize: SIZES.fontLarge,
        fontWeight: 'bold',
        color: colors.textMain
    },

    // --- FORMS & INPUTS ---
    formWrapper: {
        width: '100%',
        paddingTop: SPACING.modalTop,
        alignItems: 'center'
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        padding: SPACING.l
    },
    input: {
        backgroundColor: colors.surface,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        fontSize: SIZES.fontLarge,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.textMain,
    },
    imagePreview: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: SIZES.radiusCard,
        marginBottom: 20
    },

    // --- BUTTONS ---
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.m
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
        backgroundColor: colors.primary
    },
    buttonSecondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
    },
    buttonDanger: {
        backgroundColor: colors.danger
    },
    buttonTextLight: {
        color: colors.textLight,
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonTextDark: {
        color: colors.textMain,
        fontWeight: 'bold',
        fontSize: 16
    },

    // --- CAMERA SPECIFIC ---
    cameraWrapper: {
        width: '90%',
        aspectRatio: 1,
        borderRadius: SIZES.radiusCard,
        overflow: 'hidden',
        backgroundColor: colors.black,
        elevation: 5
    },
    cameraButtonContainer: {
        flexDirection: 'row',
        width: '90%',
        gap: SPACING.m,
        marginTop: 20
    },

    // --- MODALS ---
    modalContent: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: SPACING.modalTop
    },
    modalTitle: {
        fontSize: SIZES.fontTitle,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.textMain
    },

    // --- SEGMENTED CONTROL (Theme switcher) ---
    segmentedControlWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.border,
        borderRadius: SIZES.radiusSmall,
        padding: 4,
        width: '100%',
        height: 50,
    },
    segment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radiusSmall - 2,
    },
    activeSegment: {
        backgroundColor: colors.surface,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    segmentText: {
        fontSize: SIZES.fontSmall,
        fontWeight: '600',
        color: colors.textMain,
    },
    activeSegmentText: {
        color: colors.primary,
    },

    // --- Category switcher (for the species) ---
    categoryList: {
        marginVertical: 15,
        height: 100,
    },
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginRight: 15,
        borderRadius: 15,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: 'transparent',
        width: 90,
        height: 80,
    },
    categoryItemActive: {
        borderColor: colors.primary,
        backgroundColor: colors.infoLight,
    },
    categoryText: {
        fontSize: 10,
        marginTop: 5,
        color: colors.textMain,
        textAlign: 'center',
    },
});