const spotifyCredentials =
  'd42c32bfbc714f54be3b7092619305f4:e1637f428d3c4330aadcbe6e140feea0';
const valiantThePink = '4FVHIoKmyPrqXezg0vjjPD';
const jon = '121615874';

const randomNames = [
  'Amina Al-Fulan',
  'Mateo Rodríguez',
  'Sakura Tanaka',
  'Elena Petrova',
  'Raj Patel',
  'Yara Da Silva',
  "Finn O'Connell",
  'Zhixin Liu',
  'Leif Andersson',
  'Fatima Zahra',
  'Liam MacLeod',
  'Joon Park',
  'Niko Papadopoulos',
  'Sibusiso Khumalo',
  'Inês Moreira',
  'Tenzin Dorjee',
  'Noa Ben-David',
  'Zubair Khan',
];

const basicAuth = btoa(spotifyCredentials);

const getSpotifyToken = async (basicAuth) => {
  try {
    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await resp.json();
    return data.access_token;
  } catch (err) {
    console.error(`Error fetching token: ${err}`);
  }
};

const fetchData = async (accessToken, endpoint) => {
  try {
    const resp = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!resp.ok) throw new Error(`Spotify API error: ${resp.status}`);

    const data = await resp.json();
    return data.items;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

const main = async (auth) => {
  const accessToken = await getSpotifyToken(auth);
  const playlistsUrl = `https://api.spotify.com/v1/users/${jon}/playlists`;
  const tracksUrl = (id) => `https://api.spotify.com/v1/playlists/${id}/tracks`;

  const _playlists = await fetchData(accessToken, playlistsUrl);
  let playlists = _playlists.reduce((all, curr) => {
    return {
      ...all,
      [curr.id]: {
        id: curr.id,
        img: curr.images[0].url,
        name: curr.name,
        likes: Math.floor(Math.random() * 1001),
        liked: Math.random() >= 0.5,
        creator: randomNames.pop(),
        tracks: [],
      },
    };
  }, {});

  let tracks = {};
  for (let playlistId in playlists) {
    const _tracks = await fetchData(accessToken, tracksUrl(playlistId));
    _tracks.forEach((t) => {
      playlists[playlistId].tracks.push(t.track.id);
      tracks = {
        ...tracks,
        [t.track.id]: {
          id: t.track.id,
          name: t.track.name,
          addedAt: t.added_at,
          href: t.track.href,
          duration: t.track.duration_ms,
          albumId: t.track.album.id,
          albumHref: t.track.album.href,
          albumImg: t.track.album.images[0].url,
          albumName: t.track.album.name,
          albumReleaseDate: t.track.album.release_date,
          artistId: t.track.artists[0].id,
          artistName: t.track.artists[0].name,
          artistHref: t.track.artists[0].href,
        },
      };
    });
  }
  console.log({ playlists, tracks });
};
