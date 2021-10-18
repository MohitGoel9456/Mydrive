import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Images } from '../assets/images/Images';
import { fileType, text } from '../common/constants';
import { RouteNames } from '../navigation/routes';
import { Text } from './Text';

export const Item = ({ item, onThreeDotsPress }) => {
    const navigation = useNavigation();
    
    const image = () => {
        let imageSource = {}
        switch (item.type) {
            case fileType.doc:
                imageSource = Images.fileText;
                break;
            case fileType.pdf:
                imageSource = Images.filePDF;
                break;
            case fileType.ppt:
                imageSource = Images.filePPT;
                break;
            default:
                imageSource = Images.folder;
                break;
        }
        return imageSource;
    }

    const isItemTypeFolder = () => {
        return item.type === 'folder';
    }

    const imageStyle = isItemTypeFolder() ? styles.imageFolder : styles.imageFile;

    const onItemSubmit = () => {
        if (isItemTypeFolder())
            navigation.push(RouteNames.home, {
                name: item.name,
                key: item.id
            })
    }

    const onThreeDotsClick = () => {
        onThreeDotsPress(item);
    }

    return (
        <TouchableOpacity
            onPress={onItemSubmit}
            style={styles.container}
        >
            <View style={styles.childContainer}>
                <Image
                    source={image()}
                    style={imageStyle}
                />
                <View style={styles.textContainer}>
                    <Text
                        style={styles.textTitle}
                    >
                        {item.name}
                    </Text>
                    {!isItemTypeFolder() &&
                        <Text
                            type={text.small}
                            style={styles.textType}
                        >
                            {(item.type).toUpperCase()}
                        </Text>
                    }
                </View>
            </View>
            <TouchableOpacity onPress={onThreeDotsClick}>
                <Image
                    source={Images.threeDots}
                    style={styles.imageThreeDots}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    childContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageFolder: {
        width: 40,
        height: 32
    },
    imageFile: {
        width: 36,
        height: 42
    },
    textContainer: {
        marginLeft: 16,
        paddingVertical: 24
    },
    textTitle: {
        fontWeight: '500',
    },
    textType: {
        fontWeight: '200',
    },
    imageThreeDots: {
        width: 15,
        height: 15
    }
})