// // utils/ffmpeg.ts
// import {}  from '@ffmpeg/ffmpeg'

// const ffmpeg = createFFmpegCore({ log: true })

// export const transcodeRTSPToWebRTC = async (rtspUrl: string) => {
//     await ffmpeg.load()

//     const response = await fetch(`/api/rtsp/proxy?url=${encodeURIComponent(rtspUrl)}`)
//     const data = new Uint8Array(await response.arrayBuffer())

//     ffmpeg.FS('writeFile', 'input.sdp', data)
  
//   await ffmpeg.run('-i', 'input.sdp', '-c:v', 'libx264', '-f', 'flv', 'output.flv')
//   const output = ffmpeg.FS('readFile', 'output.flv')

//   return URL.createObjectURL(new Blob([output.buffer], { type: 'video/flv' }))
// }
