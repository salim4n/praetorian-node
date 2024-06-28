"use server"
import * as dotenv from 'dotenv'
import { BlobSASPermissions, generateBlobSASQueryParameters, BlobServiceClient, StorageSharedKeyCredential, BlobSASSignatureValues } from '@azure/storage-blob'
import { DetectedObject } from "@tensorflow-models/coco-ssd"
import fetch from 'node-fetch'

const { v4: uuidv4 } = require('uuid')

dotenv.config()

const accountName = process.env.AZURE_STORAGE_NAME as string
const accountKey = process.env.AZURE_STORAGE_KEY as string
const containerName = process.env.AZURE_STORAGE_CONTAINER as string
const connectionString = process.env.CONNECTION_STRING as string
const token = process.env.TELEGRAM_BOT_TOKEN as string
const chatId = process.env.TELEGRAM_CHAT_ID as string

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
    const base64Data =  picture && picture.replace(/^data:image\/webp;base64,/, '')
    const buffer = base64Data && Buffer.from(base64Data, 'base64');
    const blobName = `${uuidv4()}.png`
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    buffer && await blockBlobClient.upload(buffer, buffer.length)
    await blockBlobClient.setMetadata({class : body.detected.class})
    const imageUrl = await generateSasToken(containerName, blobName)
    const message = `Detected: ${body.detected.class}, Confidence: ${body.detected.score.toPrecision(2)} \n Picture: ${imageUrl}`
    await sendTelegramMessage(token, chatId, message)
}catch(e){
    console.error(e)
}
}

const sendTelegramMessage = async (token: string, chatId: string, message: string) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
    return response.json()
}

const generateSasToken = async (containerName: string, blobName: string): Promise<string> => {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(blobName)
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 128)
    const sasOptions: BlobSASSignatureValues = {
        containerName: containerName,
        blobName: blobName,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn: expiryDate
    }
    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()
    const imageUrl = blobClient.url + '?' + sasToken

    return imageUrl
}
