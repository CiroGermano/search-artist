let apiDeezer = {
  init: function () {
    this.urlFormater = urlFormater.deezer;
  },
  searchArtist: async function (strArtist) {
    try {
      let url, urlFormater;

      urlFormater = this.urlFormater;

      url = urlFormater.searchArtist(strArtist);

      return await fetch(url)
        .then((response) => {
          if (response.status != "200") {
            console.log(response);
            throw new Error(`
            apiDeezer: Problema na requisição
            COD: ${response.status}
            URL: ${response.url}
            INFO: ${response.statusText}`.trim());
          }
          return response.json();
        })
        .then((obj) => obj.data)
        .then((data) => {
          if (data.length == 0)
            throw new Error("apiDeezer: Artista não encontrado: ", strArtist);
          return data[0];
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  artistTop: async function (idArtist) {
    let url, urlFormater;

    urlFormater = this.urlFormater;
    url = urlFormater.artistTop(idArtist);

    return await fetch(url)
      .then((response) => response.json())
      .then((obj) => obj.data[0])
      .catch((err) => err);
  },
  artistAlbums: async function (idArtist) {
    let url, urlFormater;

    urlFormater = this.urlFormater;
    url = urlFormater.artistAlbums(idArtist);

    return await fetch(url)
      .then((response) => response.json())
      .then((obj) => obj.data)
      .catch((err) => err);
  },
  albumTracks: async function (idAlbum) {
    let url, urlFormater, tracksArr;

    urlFormater = this.urlFormater;
    url = urlFormater.albumTracks(idAlbum);

    tracksArr = [];

    tracksArr = await fetch(url)
      .then((response) => response.json())
      .then((obj) => obj.data)
      .then((data) => data.map((track) => track.title))
      .catch((err) => err);

    return tracksArr;
  },
};
