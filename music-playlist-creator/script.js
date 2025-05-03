/**
 * HANDLERS
 */

const handleLike = (id) => {
  const playlists = JSON.parse(localStorage.getItem('playlists'));
  const playlist = playlists[id];

  const parent = document.querySelector(`[data-id="${id}"]`);
  const count = parent.querySelector('.likes span');
  const iconFilled = parent.querySelector('i.fa-solid');
  const iconOutline = parent.querySelector('i.fa-regular');

  const updatedLiked = !playlist.liked;
  const updatedLikes = updatedLiked ? playlist.likes + 1 : playlist.likes - 1;
  if (updatedLiked) {
    iconFilled.classList.remove('hidden');
    iconOutline.classList.add('hidden');
  } else {
    iconFilled.classList.add('hidden');
    iconOutline.classList.remove('hidden');
  }
  count.textContent = updatedLikes;

  const updatedPlaylist = {
    ...playlist,
    liked: updatedLiked,
    likes: updatedLikes,
  };
  const updatedPlaylists = {
    ...playlists,
    [id]: updatedPlaylist,
  };
  localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
};

const toggleLikeFill = (parent, liked) => {
  const iconFilled = parent.querySelector('i.fa-solid');
  const iconOutline = parent.querySelector('i.fa-regular');

  if (liked) {
    iconFilled.classList.add('hidden');
    iconOutline.classList.remove('hidden');
  } else {
    iconFilled.classList.remove('hidden');
    iconOutline.classList.add('hidden');
  }
};

const handlePlaylistClick = (id) => {
  document.body.style.overflow = 'hidden';
  createModal(id);
};

// closes modal on X click, overlay click, or esc keypress
const handleCloseModal = (e) => {
  if (e?.target.matches('#modal-container, .close') || e?.key === 'Escape') {
    const modal = document.getElementById('modal-container');
    modal.innerHTML = '';
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  document.removeEventListener('keydown', handleCloseModal);
};

const handlePlaylistCoverClick = (id) => {
  window.open(`https://open.spotify.com/playlist/${id}`, '_blank');
};

const shufflePlaylist = (id) => {
  const playlist = JSON.parse(localStorage.getItem('playlists'))[id];

  const tracks = [...playlist.tracks];
  let currIdx = tracks.length;
  while (currIdx != 0) {
    let randomIdx = Math.floor(Math.random() * currIdx);
    currIdx--;
    [tracks[currIdx], tracks[randomIdx]] = [tracks[randomIdx], tracks[currIdx]];
  }

  const playlists = JSON.parse(localStorage.getItem('playlists'));
  const updatedPlaylist = { ...playlist, tracks };
  const updatedPlaylists = {
    ...playlists,
    [playlist.id]: updatedPlaylist,
  };
  localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));

  const body = createModalBody(id);
  const modal = document.querySelector('#modal-container .modal');
  const list = document.querySelector('#modal-container .body');
  list.remove();
  modal.appendChild(body);
};

/**
 * COMPONENTS
 */

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
  close.addEventListener('click', handleCloseModal);
  playlistCover.className = 'playlist-cover';
  playlistCover.addEventListener('click', () =>
    handlePlaylistCoverClick(playlist.id),
  );
  img.src = playlist.img;
  details.className = 'details';
  name.textContent = playlist.name;
  creator.textContent = `Created by ${playlist.creator}`;
  shuffleIcon.className = 'fa-solid fa-shuffle';
  shuffle.addEventListener('click', () => shufflePlaylist(id));

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

  document.addEventListener('keydown', handleCloseModal);
  container.addEventListener('click', handleCloseModal);
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

  btn.addEventListener('click', () => handleLike(playlist.id));
  // btn.addEventListener('mouseenter', () => toggleLikeFill(btn, playlist.liked));
  // btn.addEventListener('mouseleave', () => toggleLikeFill(btn, playlist.liked));
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
  img.addEventListener('click', () => handlePlaylistClick(id));
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
