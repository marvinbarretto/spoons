import { mockGetDocs } from '@/tests/__mocks__/firebase'
// Vitest needs the vi.mock(...) to run before any module that imports from Firestore is loaded.

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { usePubs } from '../usePubs'

describe('usePubs composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads pubs from Firestore and caches them', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          data: () => ({
            id: 'pub001',
            name: 'Test Pub',
            location: { lat: 0, lng: 0, city: '', country: '' },
          }),
        },
      ],
    })

    const { pubs, loadPubs } = usePubs()
    await loadPubs()

    expect(mockGetDocs).toHaveBeenCalled()
    expect(pubs.value.length).toBe(1)
    expect(pubs.value[0].id).toBe('pub001')
  })
})
