
// ROZNE
// funkcja zwroci np. losowy genre / tag muzyki
export function getRandomFromArray(array){

    return array[Math.floor(Math.random() * (array.length))];
}

// funkcja odp. formatuje URI (escape reserved characters)
export function URIFormatSearchObject(searchObject){

    let copy = {};

    Object.keys(searchObject).forEach((key) => {

        copy[key] = encodeURIComponent(searchObject[key]);
    });

    return copy;
}

export function filterObjectByKey(object, disallowedKeys) {

    // w celu zamiany usun "!"
    return Object.keys(object)
        .filter(key => !disallowedKeys.includes(key))
        .reduce((copy, key) => {
            copy[key] = object[key];
            return copy;
        }, {});
}


export function convertDuration(seconds){

    const remaining = seconds % 60;
    const formattedRemaining = (remaining < 10 ?  "0" : "") + remaining;

    return `${parseInt(seconds / 60)}:${formattedRemaining}`
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export function arrContainsAlbum(soughtAlbum, albums) {
    let albumPresent = false;
    let i = 0;

    while(i < albums.length) {

        const storedAlbum = albums[i];
        i++;

        if (storedAlbum.url === soughtAlbum.url) {
            albumPresent = true;
            break;
        }
    }
    return albumPresent
}