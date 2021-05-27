let urlFormater = {
  init: function () {
    this.audioDb.init();
    this.deezer.init();
  },
  audioDb: {
    init: function () {
      this.audioDbUrlPartial = `https://www.theaudiodb.com/api/v1/json/1`;
    },
    searchArtist: function (strArtist) {
      let artist, url, urlPartial;

      artist = strArtist.trim().replaceAll(" ", "+");
      urlPartial = this.audioDbUrlPartial;
      url = `${urlPartial}/search.php?s=${artist}`;

      return url;
    },
  },
  deezer: {
    init: function () {
      this.deezerUrlPartial = `https://cors-anywhere.herokuapp.com/https://api.deezer.com`;
    },
    searchArtist: function (strArtist) {
      let url, urlPartial;

      urlPartial = this.deezerUrlPartial;
      url = `${urlPartial}/search/artist?q=artist:"${strArtist}"`;

      return url;
    },
    artistTop: function (idArtist) {
      let url, urlPartial;

      urlPartial = this.deezerUrlPartial;
      url = `${urlPartial}/artist/${idArtist}/top`;

      return url;
    },
    artistAlbums: function (idArtist) {
      let url, urlPartial;

      urlPartial = this.deezerUrlPartial;
      url = `${urlPartial}/artist/${idArtist}/albums`;

      return url;
    },
    albumTracks: function (idAlbum) {
      let url, urlPartial;

      urlPartial = this.deezerUrlPartial;
      url = `${urlPartial}/album/${idAlbum}/tracks`;

      return url;
    },
  },
};
