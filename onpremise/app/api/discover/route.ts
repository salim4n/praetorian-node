import { NextRequest, NextResponse } from 'next/server'
import { Client as SSDPClient } from 'node-ssdp'

export async function GET(req: NextRequest) {
  try {
    const client = new SSDPClient()
    const devices: { headers: any ;rinfo: any }[] = []

    client.on('response', (headers: any, statusCode: any, rinfo: any) => {
      devices.push({ headers, rinfo })
    })

    client.search('ssdp:all')
    
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error in GET /api/discover:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
