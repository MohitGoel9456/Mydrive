import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    TextInput
} from 'react-native'
import { Button } from './Button';
import { colors } from '../common/color';
import { common, text } from '../common/constants'
import { Text } from './Text';

export const AddItem = ({title, positiveButton, onCancelPress, onPositiveButtonPress}) => {
    const [value, setValue] = useState();

    const onChangeValue = (text) => {
        setValue(text)
    }

    const onPositiveButtonSubmit = () => {
        onPositiveButtonPress(value);
    }

    return (
        <View style={styles.container}>
            <Text 
                style={styles.header}
                type={text.large}
            >
                {title}
            </Text>
            <TextInput
                style={styles.input}
                placeholder='add name'
                onChangeText={onChangeValue}
                value={value}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title={common.cancel}
                    buttonStyles={styles.cancelButton}
                    textStyles={[styles.text]}
                    textType={text.large}
                    onPress={onCancelPress}
                />
                <Button
                    title={positiveButton}
                    textStyles={[styles.text, styles.positiveButtonTextColor]}
                    textType={text.large}
                    onPress={onPositiveButtonSubmit}
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
        marginRight: 16,
    },
    text: {
        fontWeight: '500',
    },
    positiveButtonTextColor: {
        color:  colors.white
    }
})