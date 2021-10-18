import React, {useState} from 'react'
import {
    View,
    Image,
    TextInput,
    StyleSheet
} from 'react-native'
import { Images } from '../assets/images/Images'

export const Search = ({searchValue}) => {
    const [value, setValue] = useState();

    const onChangeValue = (text) => {
        setValue(text)
        searchValue(text)
    }
    return (
        <View style={styles.container}>
            <Image
                style={styles.search}
                source={Images.search}
            />
            <TextInput
                style={styles.input}
                placeholder='Search..'
                onChangeText={onChangeValue}
                value={value}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 8,
        marginTop: 24
    },
    search: {
        height: 20,
        width: 20,
        marginLeft: 8
    },
    input: {
        height: 40,
        padding: 8,
        marginLeft: 8,
        width: '100%'
    },
})