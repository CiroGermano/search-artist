let model = {
  setArtist: function (newArtist) {
    let strArtist, objArtist;

    if (sessionStorage.hasOwnProperty("artist")) {
      strArtist = sessionStorage.artist;

      objArtist = JSON.parse(strArtist);
      objArtist = { ...newArtist };

      sessionStorage.artist = JSON.stringify(objArtist);
    } else {
      sessionStorage.artist = null;

      strArtist = sessionStorage.artist;

      objArtist = JSON.parse(strArtist);
      objArtist = { ...newArtist };

      sessionStorage.artist = JSON.stringify(objArtist);
    }
  },
  artist: function () {
    let strArtist, objArtist;

    if (sessionStorage.hasOwnProperty("artist")) {
      strArtist = sessionStorage.artist;
      objArtist = JSON.parse(strArtist);

      return objArtist;
    } else {
      sessionStorage.artist = null;
      strArtist = sessionStorage.artist;
      objArtist = JSON.parse(strArtist);

      return objArtist;
    }
  },
  setArtistNull: function () {
    sessionStorage.setItem("artist", null);
  },
};

let controller = {
  init: function () {
    urlFormater.init();
    apiAudioDb.init();
    apiDeezer.init();

    if (this.hasArtist()) {
      this.renderPageAccordingUrl();
    } else {
      view.init();
    }
  },
  searchArtist: async function (strArtist) {
    try {
      let deezerArtistResponse, audioDbArtistResponse, artist;

      deezerArtistResponse = await apiDeezer
        .searchArtist(strArtist)
        .catch((err) => {
          throw err;
        });

      artist = {};

      artist.id = deezerArtistResponse.id;
      artist.name = deezerArtistResponse.name;
      artist.logo = deezerArtistResponse.picture_big;

      audioDbArtistResponse = await apiAudioDb.searchArtist(strArtist);

      artist.bio = audioDbArtistResponse.artistBio;
      artist.banner = audioDbArtistResponse.artistBanner;

      return artist;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  artistTopTrackUrl: async function (idArtist) {
    let topTrack;
    try {
      topTrack = await apiDeezer.artistTop(idArtist);
      return topTrack.preview;
    } catch (err) {
      throw err;
    }
  },
  artistAlbums: async function (idArtist) {
    try {
      return await apiDeezer.artistAlbums(idArtist);
    } catch (err) {
      throw error;
    }
  },
  artistTracks: async function (albums) {
    let trackSet, promises;

    trackSet = new Set();

    try {
      promises = albums.map(async (album) => {
        let tracks;

        tracks = await apiDeezer.albumTracks(album.id);

        for (let track of tracks) {
          trackSet.add(track);
        }
      });

      await Promise.all(promises);

      return Array.from(trackSet).sort((a, b) => a.localeCompare(b));
    } catch (err) {
      throw err;
    }
  },
  handleSearchArtistButton: async function (strArtist) {
    let artist;

    try {
      artist = await this.mountArtist(strArtist).catch((err) => {
        throw err;
      });
      controller.renderPageAccordingUrl();
    } catch (err) {
      console.error(err);
      alert("Artista não encontrado ou problema na conexão com o servidor.");
      controller.artistNotFound();
    }
  },
  artistNotFound: function () {
    controller.setArtistNull();
    controller.initPageAccordingUrl();
  },
  renderPageAccordingUrl: function () {
    let pageName;

    pageName = this.getPageName();

    if (pageName === "index.html") return view.renderIndexPage();
    if (pageName === "discos.html") return view.renderDiscPage();
    if (pageName === "musicas.html") return view.renderMusicPage();
  },
  initPageAccordingUrl: function () {
    let pageName;

    pageName = this.getPageName();

    if (pageName === "index.html") return view.initIndexPage();
    if (pageName === "discos.html") return view.initDiscPage();
    if (pageName === "musicas.html") return view.initMusicPage();
  },
  getPageName: function () {
    let pageUrl;

    pageUrl = window.location.href;

    if (pageUrl.includes("index.html")) return "index.html";
    if (pageUrl.includes("discos.html")) return "discos.html";
    if (pageUrl.includes("musicas.html")) return "musicas.html";
  },
  mountArtist: async function (strArtist) {
    let mountedArtist, artistInfo, artistAlbums, artistTracks, artistTopTrack;

    try {
      artistInfo = await this.searchArtist(strArtist).catch((err) => {
        throw err;
      });
      artistAlbums = await this.artistAlbums(artistInfo.id).catch((err) => {
        throw err;
      });
      artistTracks = await this.artistTracks(artistAlbums).catch((err) => {
        throw err;
      });
      artistTopTrack = await this.artistTopTrackUrl(artistInfo.id).catch(
        (err) => {
          throw err;
        }
      );

      mountedArtist = { ...artistInfo };
      mountedArtist.albums = artistAlbums;
      mountedArtist.tracks = artistTracks;
      mountedArtist.topTrack = artistTopTrack;

      model.setArtist(mountedArtist);

      return mountedArtist;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  hasArtist: function () {
    if (model.artist() !== null) {
      return true;
    } else {
      return false;
    }
  },
  getArtist: function () {
    return model.artist();
  },
  setArtistNull: function () {
    model.setArtistNull();
  },
  getArtistAlbums: function () {
    return model.artist().albums;
  },
  getArtistAlbumsSortedByYearReleasedAsc: function () {
    return model
      .artist()
      .albums.sort((a, b) => a.release_date > b.release_date);
  },
  getArtistTracksSortedByName: function () {
    return model.artist().tracks;
  },
};

let view = {
  init: function () {
    this.header.init();
    this.artist.init();
  },
  initIndexPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistBio.clear();
  },
  clearIndexPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistBio.clear();
  },
  renderIndexPage: function () {
    this.header.render();

    this.artist.render();

    this.artist.artistBio.render();
  },
  initDiscPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistDiscs.clear();
  },
  clearDiscPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistDiscs.clear();
  },
  renderDiscPage: function () {
    this.header.render();

    this.artist.render();
    this.artist.artistDiscs.render();
  },
  initMusicPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistTracks.init();
  },
  clearMusicPage: function () {
    this.header.render();

    this.artist.clear();

    this.artist.artistTracks.clear();
  },
  renderMusicPage: function () {
    this.header.render();

    this.artist.render();
    this.artist.artistTracks.render();
  },
  header: {
    init: function () {
      this.searchArtistInput.init();
      this.searchArtistButton.init();
    },
    clear: function () {
      this.init();
      this.searchArtistInput.clear();
    },
    render: function () {
      this.clear();
      this.searchArtistInput.render();
    },
    searchArtistInput: {
      init: function () {
        this.inputEl = document.getElementById("searched-artist-input");
      },
      clear: function () {
        this.init();
        this.inputEl.innerHTML = "";
      },
      render: function () {
        this.init();
        this.inputEl.value = "";
        this.inputEl.placeholder = "Artista";
      },
    },
    searchArtistButton: {
      init: function () {
        let button = document.getElementById("search-button");

        button.addEventListener("click", (e) => {
          let strArtist = document.getElementById("searched-artist-input")
            .value;

          controller.handleSearchArtistButton(strArtist);
        });
      },
    },
  },
  artist: {
    init: function () {
      this.artistImg.init();
      this.nav.init();
    },
    clear: function () {
      this.init();
      this.artistImg.clear();
      this.nav.clear();
    },
    render: function () {
      this.clear();
      this.artistImg.render();
      this.nav.render();
    },
    artistImg: {
      init: function () {
        this.img = document.getElementById("artist-img");
      },
      clear: function () {
        this.init();
        this.img.srcset = "";
      },
      render: function () {
        let artist, srcsetStr;

        artist = controller.getArtist();
        srcsetStr = `${artist.logo} 410w, ${artist.banner} 800w`;

        this.clear();

        this.img.srcset = srcsetStr;
      },
    },
    nav: {
      init: function () {
        this.ul = document.getElementById("artist-ul");
      },
      clear: function () {
        this.init();
        this.ul.innerHTML = "";
      },
      render: function () {
        let strHtml;

        strHtml = `<li class="box artist-nav-item"><a href="index.html">Bio</a></li>
        <li class="box artist-nav-item"><a href="discos.html">Álbuns</a></li>
        <li class="box artist-nav-item"><a href="musicas.html">Músicas</a></li>`;

        this.clear();
        this.ul.innerHTML += strHtml;
      },
    },
    artistBio: {
      init: function () {
        this.bio = document.getElementById("artist-bio");
      },
      clear: function () {
        this.init();
        this.bio.innerHTML = "";
      },
      render: function () {
        let artist = controller.getArtist();

        this.clear();
        this.bio.innerHTML = `<p>${artist.bio}</p>`;
      },
    },
    artistDiscs: {
      init: function () {
        this.discsUl = document.getElementById("albums-ul");
      },
      clear: function () {
        this.init();
        this.discsUl.innerHTML = "";
      },
      render: function () {
        let albumsSortedByYearReleased;

        albumsSortedByYearReleased = controller.getArtistAlbumsSortedByYearReleasedAsc();

        this.clear();

        for (const album of albumsSortedByYearReleased) {
          let liEl = document.createElement("li");
          let imgEl = document.createElement("img");
          let nameEl = document.createElement("span");
          let yearReleasedEl = document.createElement("span");

          liEl.classList.add("box");
          liEl.classList.add("album");
          imgEl.classList.add("album-img");
          nameEl.classList.add("album-desc", "bolder");
          yearReleasedEl.classList.add("album-desc");

          imgEl.setAttribute("src", album.cover_medium);
          nameEl.appendChild(document.createTextNode(album.title));
          yearReleasedEl.appendChild(
            document.createTextNode(album.release_date)
          );

          liEl.appendChild(imgEl);
          liEl.appendChild(nameEl);
          liEl.appendChild(yearReleasedEl);

          this.discsUl.appendChild(liEl);
        }
      },
    },
    artistTracks: {
      init: function () {
        this.olElement = document.getElementById("ol-music-list");
      },
      clear: function () {
        this.init();
        this.olElement.innerHTML = "";
      },
      render: function () {
        let tracks;

        tracks = controller.getArtistTracksSortedByName();

        this.clear();

        for (track of tracks) {
          let liEl = document.createElement("li");
          let spanEl = document.createElement("span");

          spanEl.classList.add("text-small");
          liEl.style.fontWeight = "bold";

          spanEl.appendChild(document.createTextNode(track));

          liEl.appendChild(spanEl);

          this.olElement.appendChild(liEl);
        }
      },
    },
  },
};

controller.init();

// artist = {
//   id: null,
//   name: null,
//   name: null,
//   albums: [], // arr of album (album is object)
//   logo: null,
//   banner: null,
//   bio: null,
//   tracks: [], // arr of track (track is literal string)
//   topTrack: null,
// };
