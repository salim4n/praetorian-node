// // components/VideoPlayer.tsx

// import SimplePeer from 'simple-peer'
// import React, { useEffect, useRef, useState } from 'react'

// const VideoPlayer: React.FC = () => {

// const [peer, setPeer] = useState<SimplePeer.Instance | null>(null)
// const videoRef = useRef<HTMLVideoElement>(null)

//   useEffect(() => {
//     const initiatePeer = async () => {
//       const streamUrl = await transcodeRTSPToWebRTC('rtsp://admin:superadmin@192.168.1.189:554/stream')

//       const video = document.createElement('video')
//       video.src = streamUrl
//       video.autoplay = true
//       video.controls = true

//       if (videoRef.current) {
//         videoRef.current.srcObject = video.srcObject
//       }

//       const newPeer = new SimplePeer({
//         initiator: true,
//         trickle: false,
//         stream: video.srcObject as MediaStream,
//       });

//       newPeer.on('signal', (data:any) => {
//         // Envoyer l'offre à l'autre pair (non montré ici)
//       });

//       newPeer.on('stream', (stream: MediaProvider | null) => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//         }
//       });

//       setPeer(newPeer)
//     };

//     initiatePeer()
//   }, [])

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Camera Stream</h1>
//       <video ref={videoRef} autoPlay playsInline controls className="w-full" />
//     </div>
//   );
// };

// export default VideoPlayer
