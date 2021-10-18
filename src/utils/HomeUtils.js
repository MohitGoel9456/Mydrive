import { fileType } from "../common/constants";

export const checkFileType = (type) => {
    if(type.includes('.'+fileType.ppt)) {
        return fileType.ppt;
    } else if (type.includes('.'+fileType.pdf)) {
        return fileType.pdf;
    }else if (type.includes('.'+fileType.doc)) {
        return fileType.doc
    }else {
        return fileType.folder
    }
}

export const generateRandom = () => {
    const maxLimit = 2000;
    let rand = Math.random() * maxLimit;
    rand = Math.floor(rand); // 99
    return rand;
}