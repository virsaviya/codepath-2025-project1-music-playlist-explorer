const fetchJSON = async (uri) => {
  try {
    const resp = await fetch(uri);
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error(`Error reading JSON: ${err}`);
  }
};

const main = () => {
  const playlists = localStorage.getItem('playlists');
  const tracks = localStorage.getItem('tracks');
  if (!playlists || !tracks) {
    fetchJSON('data.json').then((data) => {
      localStorage.setItem('playlists', JSON.stringify(data.playlists));
      localStorage.setItem('tracks', JSON.stringify(data.tracks));
      createPlaylists();
    });
  } else createPlaylists();
};

main();
