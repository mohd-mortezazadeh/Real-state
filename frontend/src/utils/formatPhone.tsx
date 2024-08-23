export const formatPhoneWithStar = function (phone: any) {

    const prefixLength = 4;
    const suffixLength = 4;

    const prefix = phone.substring(0, prefixLength);
    const suffix = phone.slice(-suffixLength);
    const nbStars = phone.length - (prefixLength + suffixLength);

    let formattedPhone = prefix;
    for (let i = 0; i < nbStars; i++) {
        formattedPhone += '#';
    }
    formattedPhone += suffix;

    return formattedPhone;
}