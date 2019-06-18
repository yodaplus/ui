import contentHash from 'content-hash'
import { utils } from 'ethers'

const supportedCodecs = ['ipfs-ns', 'swarm-ns']

export function decodeContenthash(encoded) {
  let decoded, protocolType, error
  if (encoded.error) {
    return { protocolType: null, decoded: encoded.error }
  }
  console.log(encoded)
  if (encoded) {
    try {
      decoded = contentHash.decode(encoded)
      console.log(decoded)
      console.log(contentHash.getCodec(encoded))
      if (contentHash.getCodec(encoded) === 'ipfs-ns') {
        protocolType = 'ipfs'
      } else if (contentHash.getCodec(encoded) === 'swarm-ns') {
        protocolType = 'bzz'
      } else {
        decoded = encoded
      }
    } catch (e) {
      error = e.message
    }
  }
  return { protocolType, decoded, error }
}

export function isValidContenthash(encoded) {
  const codec = contentHash.getCodec(encoded)
  return utils.isHexString(encoded) && supportedCodecs.includes(codec)
}

export function encodeContenthash(text) {
  let content, contentType
  let encoded = false
  if (!!text) {
    let matched = text.match(/^(ipfs|bzz):\/\/(.*)/)
    if (matched) {
      contentType = matched[1]
      content = matched[2]
    }

    try {
      console.log(content)
      if (contentType === 'ipfs') {
        encoded = '0x' + contentHash.fromIpfs(content)
      } else if (contentType === 'bzz') {
        encoded = '0x' + contentHash.fromSwarm(content)
      } else {
        console.warn('Unsupported protocol or invalid value', {
          contentType,
          text
        })
      }
    } catch (err) {
      console.warn('Error encoding content hash', { text, encoded })
    }
  }
  return encoded
}
