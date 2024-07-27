import { NextRequest, NextResponse } from 'next/server'
import net from 'net'

const RTSP_PORT = 554

async function scanPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    console.log(`Scanning ${host}:${port}`)

    socket.setTimeout(1000)

    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    });

    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    });

    socket.on('error', () => {
      resolve(false)
    });

    socket.connect(port, host)
  });
}

export async function GET(req: NextRequest) {
  const devices: string[] = []

  // Remplacez cette plage par celle de votre réseau local
  const hosts = Array.from({ length: 254 }, (_, i) => `192.168.1.${i + 1}`)

  for (const host of hosts) {
    const isRtspOpen = await scanPort(host, RTSP_PORT)
    if (isRtspOpen) {
        console.log(`Found RTSP device at ${host}`)
      devices.push(host)
    }
  }

  return NextResponse.json(devices)
}
