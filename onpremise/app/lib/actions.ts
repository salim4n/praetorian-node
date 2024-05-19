"use server"
import * as dotenv from 'dotenv'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { DetectedObject } from "@tensorflow-models/coco-ssd"
const { v4: uuidv4 } = require('uuid')

dotenv.config()

const accountName = process.env.AZURE_STORAGE_NAME as string
const accountKey = process.env.AZURE_STORAGE_KEY as string
const containerName = process.env.AZURE_STORAGE_CONTAINER as string
const connectionString = process.env.CONNECTION_STRING as string

if (!accountName) throw Error('Azure Storage accountName not found')
if (!accountKey) throw Error('Azure Storage accountKey not found')
if (!containerName) throw Error('Azure Storage containerName not found')
if (!connectionString) throw Error('Azure Storage connectionString not found')

const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
)

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
)

export type Detected =  {
    detected: DetectedObject
    picture?: string
}

export async function sendPicture(body: Detected){
try{
    const picture = body.picture
    const base64Data =  picture && picture.replace(/^data:image\/webp;base64,/, '');
    const buffer = base64Data && Buffer.from(base64Data, 'base64');
    const blobName = `${uuidv4()}.png`
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    buffer && await blockBlobClient.upload(buffer, buffer.length)
    await blockBlobClient.setMetadata({class : body.detected.class})
    console.log(`Picture uploaded: ${blobName}`)
}catch(e){
    console.error(e)
}
}
