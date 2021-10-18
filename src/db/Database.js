import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveInStorage = async (key, data) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return 'success';
}

export const getInStorage = async (key) => {
    const dbData = await AsyncStorage.getItem(key);
    return dbData ? JSON.parse(dbData) : [];
}
