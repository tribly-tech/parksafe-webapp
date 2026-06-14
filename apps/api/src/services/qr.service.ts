import QRCode from 'qrcode'

function getContactBaseUrl(): string {
  return (
    process.env['SITE_URL'] ??
    process.env['ALLOWED_ORIGIN'] ??
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function buildContactUrl(tagCode: string): string {
  return `${getContactBaseUrl()}/contact/${encodeURIComponent(tagCode)}`
}

export async function generateQrPng(tagCode: string) {
  const url = buildContactUrl(tagCode)

  return await QRCode.toBuffer(url, {
    type: 'png',
    width: 500,
    margin: 2,
  })
}
