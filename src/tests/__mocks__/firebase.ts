import { vi } from 'vitest'

export const mockGetDocs = vi.fn()
export const mockSetDoc = vi.fn()
export const mockUpdateDoc = vi.fn()
export const mockDeleteDoc = vi.fn()
export const mockGetDoc = vi.fn()
export const mockDoc = vi.fn((...args) => args.join('/'))
export const mockCollection = vi.fn()
export const mockGetFirestore = vi.fn(() => ({}))

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  console.log('🔥 Firebase Firestore mock active')
  return {
    ...actual,
    getFirestore: mockGetFirestore,
    getDocs: mockGetDocs,
    setDoc: mockSetDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    getDoc: mockGetDoc,
    doc: mockDoc,
    collection: mockCollection,
  }
})
