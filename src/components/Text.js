import React from 'react'
import {
    StyleSheet,
    Text as RNText
}from 'react-native'
import { colors } from '../common/color';
import { text } from '../common/constants'

export const Text = ({children, type, style, ...props}) => {
    let defaultStyle = {};

    switch (type) {
        case text.small:
            defaultStyle = styles.labelSmall;
            break;
        case text.regular: 
            defaultStyle = styles.labelRegular;
            break;
        case text.large: 
            defaultStyle = styles.labelLarge;
            break;
        case text.extraLarge:
            defaultStyle = styles.labelExtraLarge;
            break;
        default:
            defaultStyle = styles.labelRegular;
            break;
    }
    return(
        <RNText style={[defaultStyle,styles.colorDefault, style]}{...props}>{children}</RNText>
    )
}

const styles = StyleSheet.create({
    labelSmall: {
        fontSize: 12,
        lineHeight: 18,
    },
    labelRegular: {
        fontSize: 14,
        lineHeight: 20
    },
    labelLarge: {
        fontSize: 16,
        lineHeight: 22
    },
    labelExtraLarge: {
        fontSize: 18,
        lineHeight: 24
    },
    colorDefault: {
        color: colors.textdefault
    }
})