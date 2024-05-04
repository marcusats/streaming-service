import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import Song from '../models/songModel.js';
import ListeningHistory from '../models/listeningHistoryModel.js';
import Playlist from '../models/playlistModel.js';

await mongoose.connect('mongodb+srv://marcos:WXgAl20LBjRb49b8@cluster0.ofr2q.mongodb.net/streaming-service?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const admin = {
  first_name: 'Han',
  last_name: 'Solo',
  email: 'hansolo@example.com',
  password: 'HanSolo@1234'
}

const users = [
  {
    first_name: 'John',
    last_name: 'Doe',
    display_name: 'johndoe',
    email: 'john@example.com',
    password: 'Password123$',
    date_of_birth: '01/01/1990',
    gender: 'MALE',
    profile_image_url: 'https://picsum.photos/200/200?random=1',
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    display_name: 'janedoe',
    email: 'jane@example.com',
    password: 'Password456$',
    date_of_birth: '01/01/1995',
    gender: 'FEMALE',
    profile_image_url: 'https://picsum.photos/200/200?random=2',
  },
];

const artists = [
  {
    first_name: 'Bob',
    last_name: 'Marley',
    display_name: 'Marley',
    email: 'bob@example.com',
    password: 'Password456#',
    date_of_birth: '01/01/1940',
    gender: 'MALE',
    profile_image_url: 'https://picsum.photos/200/200?random=3',
    genres: ['REGGAE'],
  },
  {
    first_name: 'Adele',
    last_name: 'Adkins',
    display_name: 'Adele',
    email: 'adele@example.com',
    password: 'Password456@',
    date_of_birth: '01/01/1980',
    gender: 'FEMALE',
    profile_image_url: 'https://picsum.photos/200/200?random=4',
    genres: ['POP', 'SOUL'],
  },
];

const albums = [
  {
    album_type: 'ALBUM',
    cover_image_url: 'https://picsum.photos/200/200?random=5',
    title: 'Greatest Hits',
    description: 'Best hits of all time',
    release_date: new Date('2020-01-01'),
    artists: [],
    songs: [],
    genres: ['POP', 'ROCK'],
    total_duration: 3600,
    visibility: 'PUBLIC',
  },
  {
    album_type: 'SINGLE',
    cover_image_url: 'https://picsum.photos/200/200?random=6',
    title: 'Single Track',
    description: 'A single track',
    release_date: new Date('2021-05-01'),
    artists: [],
    songs: [],
    genres: ['POP'],
    total_duration: 180,
    visibility: 'PUBLIC',
  },
];

const songs = [
  {
    album: null,
    artists: [],
    duration: 180,
    title: 'Song',
    likes: 20,
    song_url: 'https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3',
    cover_image_url: 'https://picsum.photos/200/200?random=7',
    writtenBy: 'Songwriter',
    producers: ['Producer', 'Producer'],
    language: 'English',
    genre: 'POP',
    lyrics: 'Lyrics for song 1',
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 240,
    title: 'Songg',
    likes: 30,
    song_url: 'https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3',
    cover_image_url: 'https://picsum.photos/200/200?random=8',
    writtenBy: 'Songwriter',
    producers: ['Producer'],
    language: 'English',
    genre: 'ROCK',
    lyrics: 'Lyrics for song 2',
    release_date: new Date('2021-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 180,
    title: 'dare',
    likes: 20,
    song_url: 'https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3',
    cover_image_url: 'https://picsum.photos/200/200?random=9',
    writtenBy: 'Songwriter',
    producers: ['Producer', 'Producer'],
    language: 'English',
    genre: 'POP',
    lyrics: 'Lyrics for song 1',
    release_date: new Date('2020-01-01'),
  },
  {
    album: null,
    artists: [],
    duration: 240,
    title: 'white',
    likes: 30,
    song_url: 'https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3',
    cover_image_url: 'https://picsum.photos/200/200?random=10',
    writtenBy: 'Songwriter',
    producers: ['Producer'],
    language: 'English',
    genre: 'ROCK',
    lyrics: 'Lyrics for song 2',
    release_date: new Date('2021-01-01'),
  },
];

const listeningHistory = [
  {
    userId: null,
    songId: null,
    timestamp: new Date('2023-01-01'),
  },
  {
    userId: null,
    songId: null,
    timestamp: new Date('2023-02-01'),
  },
];

const playlists = [
  {
    description: 'Playlist 1',
    liked_users: [],
    title: 'Playlist 1',
    owner: null,
    songs: [],
    visibility: 'PUBLIC',
  },
  {
    description: 'Playlist 2',
    liked_users: [],
    title: 'Playlist 2',
    owner: null,
    songs: [],
    visibility: 'PRIVATE',
  },
];

async function seed() {
  try {
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await ListeningHistory.deleteMany({});
    await Playlist.deleteMany({});

    const createAdmin = await Admin.create(admin);
    const createdUsers = await User.create(users);
    const createdArtists = await Artist.create(artists);

    const albumsWithArtists = albums.map((album) => ({
      ...album,
      artists: createdArtists.map((artist) => ({ artistId: artist._id })),
    }));

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    const createdAlbums = await Album.create(albumsWithArtists);

    const songsWithAlbumsAndArtists = songs.map((song) => ({
      ...song,
      album:
        createdAlbums[Math.floor(Math.random() * createdAlbums.length)]._id,
    }));

    const createdSongs = await Song.create(songsWithAlbumsAndArtists);

    for (let album of createdAlbums) {
      const albumSongs = createdSongs.filter((song) =>
        song.album.equals(album._id)
      );
      album.songs = {
        songId: albumSongs[Math.floor(Math.random() * albumSongs.length)]._id,
      };
      await album.save();
    }

    const albumsWithLikedBy = createdAlbums.map((album) => ({
      ...album._doc,
      liked_by: {
        users: createdUsers.map((user) => user._id),
        artists: createdArtists.map((artist) => artist._id),
      },
    }));

    await Promise.all(
      albumsWithLikedBy.map((album) =>
        Album.findByIdAndUpdate(album._id, { liked_by: album.liked_by })
      )
    );

    //populating followes and following for artists and user
    const aids = createdArtists.map((artist) => artist._id);
    for (let currentArtist of createdArtists) {
      const otherArtists = createdArtists.filter(
        (artist) => artist._id.toString() !== currentArtist._id.toString()
      );
      const followingArtists = otherArtists.map((artist) => artist._id);
      const followingUsers = createdUsers.map((user) => user._id);
      await Artist.findByIdAndUpdate(currentArtist._id, {
        $set: {
          'following.artists': followingArtists,
          'followers.artists': followingArtists,
          'following.users': followingUsers,
          'followers.users': followingUsers,
        },
      });
    }
    for (let currentUser of createdUsers) {
      const otherUsers = createdUsers.filter(
        (user) => user._id.toString() !== currentUser._id.toString()
      );
      const followingArtists = createdArtists.map((artist) => artist._id);
      const followingUsers = otherUsers.map((user) => user._id);
      await User.findByIdAndUpdate(currentUser._id, {
        $set: {
          'following.artists': followingArtists,
          'followers.artists': followingArtists,
          'following.users': followingUsers,
          'followers.users': followingUsers,
        },
      });
    }

    for (let playlist of playlists) {
      playlist.songs = createdSongs.map((song) => song._id);
    }

    for (let playlist of playlists) {
      playlist.liked_users = createdUsers.map((user) => user._id);
    }

    for (let history of listeningHistory) {
      history.userId =
        createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
      history.songId =
        createdSongs[Math.floor(Math.random() * createdSongs.length)]._id;
    }
    console.log(listeningHistory);
    for (let album of albums) {
      album.artists = createdArtists.map((artist) => artist._id);
    }

    for (let song of songs) {
      song.artists = createdArtists.map((artist) => artist._id);
    }

    await Playlist.create(playlists);
    await ListeningHistory.create(listeningHistory);
    await Album.create(albums);
    await Song.create(songs);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

await seed();