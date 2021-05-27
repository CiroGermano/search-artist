let apiAudioDb = {
  init: function () {
    this.urlFormater = urlFormater.audioDb;
  },
  searchArtist: async function (strArtist) {
    let url, urlFormater;

    urlFormater = this.urlFormater;

    url = urlFormater.searchArtist(strArtist);

    return await fetch(url)
      .then((response) => response.json())
      .then((data) => data.artists[0])
      .then((artist) => ({
        artistId: artist.idArtist,
        artistBio: artist.strBiographyPT,
        artistBanner: artist.strArtistBanner,
      }))
      .catch((reason) => {
        throw new Error("apiAudioDb: artista não encontrado.");
      });
  },
};
