import React from 'react'
import {
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import { colors } from '../common/color';
import { Text } from './Text';

export const Button = (props) => {
    const { title, onPress, buttonStyles, textStyles, textType} = props;
    return (
        <TouchableOpacity
            style={[styles.submit, buttonStyles]}
            onPress={onPress}
        >
            <Text 
                style={[styles.submitText, textStyles]}
                type={textType}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    submit: {
        paddingVertical: 9,
        backgroundColor: colors.green,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.white,
    },
    submitText: {
        color: colors.textdefault,
        textAlign: 'center',
        paddingHorizontal: 16
    }
})
