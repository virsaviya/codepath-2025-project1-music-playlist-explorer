const createTrackCard = (track) => {
  const card = document.createElement('div');
  const img = document.createElement('img');
  const details = document.createElement('div');
  const name = document.createElement('a');
  const artist = document.createElement('a');
  // const album = document.createElement('a');
  const duration = document.createElement('p');

  card.className = 'card';
  card.dataset.id = track.id;
  img.src = track.albumImg;
  name.textContent = track.name;
  name.href = `https://open.spotify.com/track/${track.id}`;
  name.target = '_blank';
  name.className = 'name';
  details.className = 'details';
  artist.textContent = track.artistName;
  artist.href = `https://open.spotify.com/artist/${track.artistId}`;
  artist.target = '_blank';
  // album.textContent = track.albumName;
  // album.href = `https://open.spotify.com/album/${track.albumId}`;
  // album.target = '_blank';
  duration.textContent = parseDuration(track.duration);

  details.appendChild(name);
  details.appendChild(artist);
  // details.appendChild(album);
  details.appendChild(duration);

  card.appendChild(img);
  card.appendChild(details);

  return card;
};

const createModalHeader = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];

  const header = document.createElement('div');
  const playlistCover = document.createElement('div');
  const img = document.createElement('img');
  const details = document.createElement('div');
  const close = document.createElement('button');
  const name = document.createElement('h2');
  const creator = document.createElement('h3');
  const likes = createLikeButton(id);
  const shuffle = document.createElement('button');
  const shuffleIcon = document.createElement('i');

  header.className = 'header';
  close.className = 'close';
  close.textContent = '🆇';
  playlistCover.className = 'playlist-cover';
  img.src = playlist.img;
  details.className = 'details';
  name.textContent = playlist.name;
  creator.textContent = `Created by ${playlist.creator}`;
  shuffleIcon.className = 'fa-solid fa-shuffle';

  playlistCover.appendChild(img);
  shuffle.appendChild(shuffleIcon);
  details.appendChild(name);
  details.appendChild(creator);
  details.appendChild(likes);
  details.appendChild(shuffle);
  header.appendChild(close);
  header.appendChild(playlistCover);
  header.appendChild(details);

  return header;
};

const createModalBody = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];
  const tracks = JSON.parse(localStorage.getItem('tracks'));

  const fragment = document.createDocumentFragment();
  playlist.tracks.forEach((trackId) => {
    const currTrack = tracks[trackId];
    const card = createTrackCard(currTrack);
    fragment.appendChild(card);
  });

  const body = document.createElement('div');
  body.className = 'body';
  body.appendChild(fragment);

  return body;
};

const createModal = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];

  const container = document.getElementById('modal-container');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.dataset.id = playlist.id;

  const header = createModalHeader(id);
  const body = createModalBody(id);
  modal.appendChild(header);
  modal.appendChild(body);

  container.classList.remove('hidden');
  container.appendChild(modal);
};

const createLikeButton = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];
  const likes = document.createElement('div');
  const count = document.createElement('span');
  const btn = document.createElement('button');
  const iconFilled = document.createElement('i');
  const iconOutline = document.createElement('i');

  likes.className = 'likes';
  count.textContent = playlist.likes;
  iconFilled.className = `fa-solid fa-heart ${playlist.liked ? '' : 'hidden'}`;
  iconOutline.className = `fa-regular fa-heart ${
    playlist.liked ? 'hidden' : ''
  }`;

  btn.appendChild(iconFilled);
  btn.appendChild(iconOutline);
  likes.appendChild(btn);
  likes.appendChild(count);
  return likes;
};

const createPlaylistCard = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];

  const card = document.createElement('div');
  const img = document.createElement('img');
  const name = document.createElement('h3');
  const details = document.createElement('div');
  const creator = document.createElement('h6');
  const likes = createLikeButton(id);

  card.className = 'card';
  card.dataset.id = playlist.id;
  img.src = playlist.img;
  name.textContent = playlist.name;
  details.className = 'details';
  creator.textContent = `by ${playlist.creator}`;

  details.appendChild(creator);
  details.appendChild(likes);

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(details);

  return card;
};

const createPlaylists = () => {
  const playlists = JSON.parse(localStorage.getItem('playlists'));
  const container = document.getElementById('playlists');

  const fragment = document.createDocumentFragment();
  Object.keys(playlists).forEach((id) => {
    const card = createPlaylistCard(id);
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
};

/**
 * MISC
 */

const parseDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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
