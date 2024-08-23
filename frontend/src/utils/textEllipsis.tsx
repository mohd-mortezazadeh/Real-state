function textEllipsis(text: string, count: number) {
    let textLength = text.split('').length
    let newText = text.split('').splice(0, count).join("");

    if (textLength > count) {
        return newText + '...'
    } else {
        return newText
    }
}

export {textEllipsis}