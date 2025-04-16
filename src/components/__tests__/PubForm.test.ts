import { render, fireEvent } from '@testing-library/vue'
import PubForm from '../admin/PubForm.vue'
import { describe, it, expect, vi } from 'vitest'

describe('PubForm', () => {
  it('emits form data on submit', async () => {
    const mockSubmit = vi.fn()
    const { getByLabelText, getByText } = render(PubForm, {
      props: {
        onSubmit: mockSubmit,
      },
    })

    await fireEvent.update(getByLabelText('Name:'), 'Test Pub')
    await fireEvent.submit(getByText('Create Pub'))

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Pub' }))
  })
})
