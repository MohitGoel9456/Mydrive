import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    TextInput
} from 'react-native'
import { colors } from '../common/color';
import { common, text } from '../common/constants'
import { Button } from './Button';
import { Text } from './Text';

export const ConfirmationModel = ({ title, description, positiveButton, onCancelPress, onPositiveButtonPress }) => {

    const onPositiveButtonSubmit = () => {
        onPositiveButtonPress();
    }

    return (
        <View style={styles.container}>
            <Text
                style={styles.header}
                type={text.large}
            >
                {title}
            </Text>
            <Text
                style={styles.description}
                type={text.large}
            >
                {description}
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    buttonStyles={styles.positiveButton}
                    title={positiveButton}
                    textStyles={[styles.text, styles.positiveButtonTextColor]}
                    textType={text.large}
                    onPress={onPositiveButtonSubmit}
                />
                <Button
                    title={common.cancel}
                    buttonStyles={styles.cancelButton}
                    textStyles={[styles.text]}
                    textType={text.large}
                    onPress={onCancelPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24
    },
    header: {
        fontStyle: 'normal',
        fontWeight: '600',
        color: colors.charcoal
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.green,
        padding: 24,
        marginTop: 24
    },
    buttonContainer: {
        marginTop: 24,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    cancelButton: {
        borderColor: colors.grey,
        backgroundColor: 'white',
    },
    text: {
        fontWeight: '500',
    },
    positiveButtonTextColor: {
        color: colors.white
    },
    positiveButton: {
        backgroundColor: colors.red,
        marginRight: 16,
    },
    description: {
        marginTop: 24,
        fontWeight: '500',
    }
})