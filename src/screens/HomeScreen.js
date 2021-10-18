import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    ActionSheetIOS,
    SectionList,
    Platform,
} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { colors } from '../common/color'
import { common, dbKeys, fileType, iosActionSheet } from '../common/constants'
import { AddItem } from '../components/AddItem'
import { ConfirmationModel } from '../components/ConfirmationModel';
import { Item } from '../components/Item'
import { ModalContainer } from '../components/ModalContainer'
import { Navtoolbar } from '../components/Navtoolbar'
import { Search } from '../components/Search'
import { Text } from '../components/Text'
import { getInStorage, saveInStorage } from '../db/Database'
import { checkFileType, generateRandom } from '../utils/HomeUtils'

const HomeScreen = () => {
    const route = useRoute();
    const [shouldShowModal, setshouldShowModal] = useState(0); // 1: add folder, 2: add file, 3: edit folder, 4: edit file
    const [shouldShowConfirmationModel, setShouldShowConfirmationModel] = useState(0);  //1: delete file, 2:delete folder
    const [editItem, setEditItem] = useState();
    const [folderWithRef, setFolderWithRef] = useState([]);
    const [searchKey, setSearchKey] = useState();

    const actionSheetfileOptions = [iosActionSheet.deleteFile, iosActionSheet.duplicateFile, iosActionSheet.renameFile];
    const actionSheetFolderOptions = [iosActionSheet.deleteFolder, iosActionSheet.duplicateFolder, iosActionSheet.renameFolder];

    const getDbData = async () => {
        const dbData = await getInStorage(getKey());
        setFolderWithRef(dbData);
    }

    useEffect(() => {
        getDbData();
    }, []);

    const getKeyFromParams = () => {
        if (route.params) {
            const { key } = route.params;
            return key.toString();
        }
        return undefined;
    }

    const getKey = () => {
        return getKeyFromParams() ? getKeyFromParams() : dbKeys.myDrive;
    }

    const checkTypeFolder = (item) => {
        return item.type === fileType.folder;
    }

    const returnDataForSections = () => {
        if (folderWithRef.length === 0) {
            return [];
        }
        let folderList = folderWithRef?.filter(item => checkTypeFolder(item))
        let filesList = folderWithRef?.filter(item => item?.type != 'folder')
        if (searchKey) {
            folderList = folderList.filter(item => item.name.includes(searchKey));
            filesList = filesList.filter(item => item.name.includes(searchKey));
        }
        const folderListSize = folderList.length;
        const fileListSize = filesList.length;
        return [
            {
                title: folderListSize > 0 ? folderListSize + ' ' + fileType.folder : '',
                data: folderList
            },
            {
                title: fileListSize > 0 ? fileListSize + ' ' + fileType.files : '',
                data: filesList
            }
        ]
    }

    const onAddPress = () => {
        Platform.OS === 'ios' ? showIosActionSheet() : showAndroidActionSheet();
    }

    const showAndroidActionSheet = () => {
        
    }

    const showIosActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["New file", "New folder", "Cancel"],
                cancelButtonIndex: 2,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    setshouldShowModal(2)
                } else if (buttonIndex === 1) {
                    setshouldShowModal(1);
                } else if (buttonIndex === 2) {
                    //cancel action
                }
            });
    }

    const onModalCancelPress = () => {
        setshouldShowModal(0);
    }

    const onConfirmationModelCancelPress = () => {
        setShouldShowConfirmationModel(0);
    }

    const onModalPositivePress = (value) => {
        switch (shouldShowModal) {
            case 1:
            case 2:
                onCreateFolderPress(value);
                break;
            case 3:
            case 4:
                onRenameFilePress(value);
                break;
        }
    }

    const onConfirmationPositiveButtonPress = () => {
        switch (shouldShowConfirmationModel) {
            case 1:
            case 2:
                onDeletePress();
                break;
        }
    }

    const onCreateFolderPress = async (value) => {
        const name = value.trim();
        const type = checkFileType(name);
        const fileName = name.split('.')[0];
        let newData = [...folderWithRef];
        if (checkIfFileAlreadyExists(fileName)) {
            newData.push({
                name: fileName,
                type: type,
                id: generateRandom()
            })
            await saveInStorage(getKey(), newData);
            onModalCancelPress();
            setFolderWithRef(newData);
        } else {
            alert("Name already exists")
        }

    }

    const checkIfFileAlreadyExists = (fileName) => {
        const filteredData = folderWithRef.filter(item => item.name === fileName);
        return filteredData.length === 0;
    }

    const onThreeDotsPress = (item) => {
        const options = checkTypeFolder(item) ? actionSheetFolderOptions : actionSheetfileOptions;
        setEditItem(item);
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [...options, iosActionSheet.cancel],
                destructiveButtonIndex: 0,
                cancelButtonIndex: 3,
            },
            buttonIndex => {
                handleThreeDotsActionSheetItemsClickEvent(buttonIndex, item);
            });
    }

    const duplicateFileName = (item, i = 1) => {
        const alreadyExists = folderWithRef.filter(x => x.name == (i == 1 ? item.name : item.name + ` (${i})`));
        if (alreadyExists.length > 0) {
            i++;
            return duplicateFileName(item, i);
        } else {
            return i;
        }
    }

    const duplicateFile = async (item, insideKey = null, insideContent = []) => {
        insideContent = insideKey ? insideContent : folderWithRef;
        let i = duplicateFileName(item);
        const newItemId = generateRandom() + '';
        insideContent.push({
            name: i == 1 ? item.name : item.name + ` (${i})`,
            type: item.type,
            id: newItemId
        });
        if (!insideKey) {
            setFolderWithRef([...insideContent]);
        }
        const key = insideKey ? insideKey : (getKey());
        await saveInStorage(key, insideContent);
        if (checkTypeFolder(item)) {
            // find all contents of the folder and copy again
            let folderContent = await getInStorage(item.id.toString());
            try {
                let newFolderContent = [];
                folderContent.map(async (folderFile) => {
                    newFolderContent = await duplicateFile(folderFile, newItemId, newFolderContent);
                });
            } catch (err) {
                console.error(err);
            }
        }
        return insideContent;
    }

    const handleThreeDotsActionSheetItemsClickEvent = (buttonIndex, item) => {
        const itemTypeFolder = checkTypeFolder(item);
        switch (buttonIndex) {
            case 0:
                itemTypeFolder ? setShouldShowConfirmationModel(2) : setShouldShowConfirmationModel(1);
                break;
            case 1:
                duplicateFile(item);
                break;
            case 2:
                itemTypeFolder ? setshouldShowModal(3) : setshouldShowModal(4);
                break;
        }
    }

    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
                onThreeDotsPress={onThreeDotsPress}
            />
        )
    }

    const renderSeparator = () => {
        return (
            <View style={styles.separator} />
        )
    }

    const headerTitle = () => {
        if (route.params) {
            const { name } = route.params;
            return name;
        } else {
            return common.homeHeaderTitle
        }
    }

    const onRenameFilePress = (name) => {
        let data = folderWithRef.map((item) => {
            if (item.id === editItem.id) {
                return { ...item, name: name };
            } else {
                return item;
            }
        })
        updateDatabase(data);
        onConfirmationModelCancelPress();
    }

    const onDeletePress = () => {
        const filterData = folderWithRef.filter((item) => {
            return item.id != editItem.id;
        })
        updateDatabase(filterData)
        onConfirmationModelCancelPress();
    }

    const updateDatabase = (data) => {
        setFolderWithRef(data);
        saveInStorage(getKey(), data);
    }

    const searchValue = (val) => {
        setSearchKey(val);
    }

    const modalConfig = {};
    switch (shouldShowModal) {
        case 1:
            modalConfig.title = common.createFolderTitle;
            modalConfig.positiveButton = common.createFolderButton;
            break;
        case 2:
            modalConfig.title = common.createFileTitle;
            modalConfig.positiveButton = common.createFileButton;
            break;
        case 3:
            modalConfig.title = common.renameFolder;
            modalConfig.positiveButton = common.renameFolder;
            break;
        case 4:
            modalConfig.title = common.renameFile;
            modalConfig.positiveButton = common.renameFile;
            break;
    }

    const confirmationModelConfig = {}
    switch (shouldShowConfirmationModel) {
        case 1:
            confirmationModelConfig.title = common.delete + ' ' + editItem.name + ' ' + common.file;
            confirmationModelConfig.positiveButton = common.delete;
            confirmationModelConfig.description = common.deleteFileDescription;
            break;
        case 2:
            confirmationModelConfig.title = common.delete + ' ' + editItem.name + ' ' + common.folder;
            confirmationModelConfig.positiveButton = common.delete;
            confirmationModelConfig.description = common.deleteFolderDescription
            break;
    }

    return (
        <View style={styles.container}>
            <Navtoolbar
                title={headerTitle()}
                onAddPress={onAddPress}
                isShowBackButton={getKeyFromParams() ? true : false}
            />
            <Search
                searchValue={searchValue}
            />
            {returnDataForSections().length > 0 &&
                <SectionList
                    style={styles.sectionList}
                    sections={returnDataForSections()}
                    keyExtractor={(item, index) => item + index}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.listHeader}>{title}</Text>
                    )}
                    ItemSeparatorComponent={renderSeparator}
                    stickySectionHeadersEnabled={false}
                />
            }
            {shouldShowModal != 0 &&
                <ModalContainer>
                    <AddItem
                        title={modalConfig.title}
                        positiveButton={modalConfig.positiveButton}
                        onCancelPress={onModalCancelPress}
                        onPositiveButtonPress={onModalPositivePress}
                    />
                </ModalContainer>
            }
            {shouldShowConfirmationModel != 0 &&
                <ModalContainer>
                    <ConfirmationModel
                        title={confirmationModelConfig.title}
                        description={confirmationModelConfig.description}
                        positiveButton={confirmationModelConfig.positiveButton}
                        onCancelPress={onConfirmationModelCancelPress}
                        onPositiveButtonPress={onConfirmationPositiveButtonPress}
                    />
                </ModalContainer>
            }
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1

    },
    sectionList: {
        marginHorizontal: 24,
    },
    separator: {
        height: 1,
        backgroundColor: colors.lightGrey,
        width: '100%'
    },
    listHeader: {
        fontWeight: 'bold',
        fontWeight: '700',
        color: colors.lead,
        marginTop: 44
    }
})