import React from 'react'
import {
    View,
    Modal,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'
import { colors } from '../common/color'

export const ModalContainer = (props) => {
    return (
        <Modal animationType={'slide'} transparent={true} visible={props.isShowAddModal}>
            <View style={styles.modal}>
                <View style={styles.container}>
                    {props.children}
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.overlayGray,

    },
    container: {
        backgroundColor: colors.white,
        width: Dimensions.get('window').width - 30,
        borderRadius: 10,
    },
})