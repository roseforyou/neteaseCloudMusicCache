// const fs = require('fs/promises');
// const fsEx = require('fs-extra');
// const path = require('path');
// const download = require('download');
// const NodeID3 = require('node-id3');
// const { song_detail } = require('NeteaseCloudMusicApi');
// process.env.NETEASE_CLOUDMUSIC_PATH = ['sptest'];

// const BAZINGA = 0xa3;
// const BLOCK_SIZE = 256 * 1024;
// const CACHE_EXT = '.uc';
// const OUTPUT_EXT = '.mp3';
// const OUT_PATH = 'sp_mp3';

// fsEx.ensureDirSync(OUT_PATH);
// fsEx.ensureDirSync('Pic');

// //如何从缓存白嫖网易云音乐
// //https://segmentfault.com/a/1190000022772403

// function handleFileNameSingle(fileName) {
//   return fileName
//     .replace(/\?/g, '？')
//     .replace(/\*/g, '＊')
//     .replace(/:/g, '：')
//     .replace(/"/g, '＂')
//     .replace(/</g, '＜')
//     .replace(/>/g, '＞')
//     .replace(/\|/g, '｜')
//     .replace(/\\/g, '＼')
//     .replace(/\//g, '／');
// }

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// function decode(buffer) {
//   for (let i = 0; i < buffer.length; ++i) {
//     buffer[i] ^= BAZINGA;
//   }
// }

// async function decodeFile(target, opts) {
//   const targetPath = target; //path.resolve(target);
//   const stat = await fs.stat(targetPath);
//   const buffer = Buffer.alloc(stat.size);
//   const reader = await fs.open(targetPath, 'r');
//   for (let offset = 0; offset < stat.size; offset += BLOCK_SIZE) {
//     const length = offset + BLOCK_SIZE > stat.size ? stat.size - offset : BLOCK_SIZE;
//     await reader.read(buffer, offset, length);
//   }
//   await reader.close();

//   decode(buffer);

//   const mp3Buf = Buffer.concat([Buffer.from([0x49, 0x44, 0x33, 0x03]), buffer]);

//   if (opts.output) {
//     const originName = path.basename(targetPath).split('.')[0]; //path.basename(targetPath, CACHE_EXT);
//     const { filename, album, albumPic, songName, singer, year, trackNumber } = await decodeInfo(
//       originName,
//     );

//     const jpgPath = `Pic/${album}-${filename}.jpg`;
//     const mp3Path = `${OUT_PATH}/${album}/${filename}.mp3`;

//     if (!fsEx.existsSync(jpgPath)) {
//       fsEx.writeFileSync(jpgPath, await download(albumPic));
//     }

//     // if (!fsEx.existsSync(mp3Path)) {
//     fsEx.ensureDirSync(path.resolve(opts.output, album));
//     const outputPath = path.resolve(opts.output, album, filename + OUTPUT_EXT);
//     const writer = await fs.open(outputPath, 'w');
//     await writer.write(mp3Buf, 0);
//     await writer.close();
//     // }

//     await sleep(10);
//     const imageBuffer = fsEx.readFileSync(jpgPath);
//     const tags = {
//       title: songName,
//       album,
//       artist: singer,
//       year,
//       image: {
//         mime: 'jpeg',
//         type: {
//           id: 3,
//           name: 'front cover',
//         },
//         imageBuffer,
//       },
//       trackNumber,
//     };

//     NodeID3.update(tags, mp3Path);
//     console.log('✔️', ` album: [${album}] - song: [${filename}.mp3]`);
//   }

//   return buffer;
// }

// async function decodeInfo(filename) {
//   const ids = filename.split('-');
//   if (ids.length !== 3) return filename;
//   try {
//     const rsp = await song_detail({ ids: ids[0] });
//     console.log(
//       '%c 🍫 rsp: ',
//       'font-size:20px;background-color: #B03734;color:#fff;',
//       JSON.stringify(rsp),
//     );
//     if (rsp.body.songs.length === 0) return filename;
//     const song = rsp.body.songs[0];
//     const album = handleFileNameSingle(song.al.name);
//     const albumPic = song.al.picUrl;
//     const songName = handleFileNameSingle(song.name);
//     const mp3Name =
//       songName + '-' + song.ar.map(artist => handleFileNameSingle(artist.name)).join(',');
//     const year = new Date(song.publishTime).getFullYear();
//     const trackNumber = song.no;
//     return {
//       filename: mp3Name,
//       album,
//       albumPic,
//       songName,
//       singer: song.ar.map(artist => handleFileNameSingle(artist.name)).join(','),
//       year,
//       trackNumber,
//     };
//   } catch (err) {
//     return { filename };
//   }
// }

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     const val = await callback(array[index], index, array);
//     if (val === false) {
//       break;
//     }
//   }
// }

// (async () => {
//   let ucFiles = [];

//   const pathArray = process.env.NETEASE_CLOUDMUSIC_PATH.split(',');
//   await asyncForEach(pathArray, async dir => {
//     const dirFiles = await fs.readdir(dir);
//     ucFiles = ucFiles.concat(
//       dirFiles.filter(file => file.includes(CACHE_EXT)).map(file => path.resolve(dir, file)),
//     );
//   });

//   await asyncForEach(ucFiles, async file => {
//     await decodeFile(file, {
//       output: `./${OUT_PATH}/`,
//     });
//   });

//   console.log('🏆', 'Finish!');
// })();
