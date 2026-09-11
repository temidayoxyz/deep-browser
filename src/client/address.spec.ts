import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  hostnameOf,
  isHttpUrl,
  normalizeInput,
  pageResourceAddress,
  urlFromAddress,
} from './address.ts'

describe('pageResourceAddress', () => {
  it('round-trips an https URL that contains :// and query', () => {
    const url = 'https://example.test/docs?q=a#b'
    const address = pageResourceAddress(url)
    assert.equal(address.startsWith('dsh-resource://page/'), true)
    assert.equal(urlFromAddress(address), url)
  })

  it('rejects a non-http address payload', () => {
    assert.equal(urlFromAddress('dsh-resource://page/javascript%3Aalert(1)'), undefined)
    assert.equal(urlFromAddress('dsh-resource://file/session/x/a.ts'), undefined)
  })
})

describe('normalizeInput', () => {
  it('keeps an absolute http(s) URL', () => {
    assert.equal(normalizeInput('https://example.test'), 'https://example.test')
    assert.equal(normalizeInput(' http://127.0.0.1:5173/ '), 'http://127.0.0.1:5173/')
  })

  it('treats localhost and loopback as http', () => {
    assert.equal(normalizeInput('localhost:5173'), 'http://localhost:5173')
    assert.equal(normalizeInput('127.0.0.1:3000'), 'http://127.0.0.1:3000')
  })

  it('treats a hostname as https', () => {
    assert.equal(normalizeInput('example.test/path'), 'https://example.test/path')
  })

  it('returns undefined for empty or non-locations', () => {
    assert.equal(normalizeInput(''), undefined)
    assert.equal(normalizeInput('   '), undefined)
    assert.equal(normalizeInput('javascript:alert(1)'), undefined)
  })
})

describe('isHttpUrl / hostnameOf', () => {
  it('accepts only http(s)', () => {
    assert.equal(isHttpUrl('https://a.test'), true)
    assert.equal(isHttpUrl('ftp://a.test'), false)
    assert.equal(isHttpUrl('not a url'), false)
  })

  it('uses the host as the chip label', () => {
    assert.equal(hostnameOf('https://docs.example.test/guide'), 'docs.example.test')
    assert.equal(hostnameOf('http://localhost:5173/'), 'localhost:5173')
  })
})
