import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { colors } from '../common/color'
import { Images } from '../assets/images/Images'

export const Navtoolbar = ({isShowBackButton = true, ...props}) => {
    const navigation = useNavigation();
    const onBackPress = () => {
        navigation.goBack()
    }

    const onAddPress = () => {
        props.onAddPress();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBackPress}>
                {isShowBackButton ?
                    <Image
                        source={Images.back}
                        style={styles.image}
                    />
                    :
                    <View />
                }
            </TouchableOpacity>
            <Text style={styles.title}>{props.title}</Text>
            <TouchableOpacity
                onPress={onAddPress}
                style={styles.addContainer}
            >
                <Image
                    source={Images.add}
                    style={styles.addImage}
                />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 12,
        justifyContent: 'space-between',
        height: 50,
    },
    image: {
        height: 28,
        width: 28,
        padding: 4
    },
    addContainer: {
        backgroundColor: colors.green,
        borderRadius: 8,
        width: 44,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addImage: {
        height: 20,
        width: 20,
        marginVertical: 4,
        marginHorizontal: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16
    }
})