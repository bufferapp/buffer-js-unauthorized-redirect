import middleware from '../src/middleware'
import { logoutUrl } from '@bufferapp/session-manager'

describe('middleware', () => {
  it('should call next with action', () => {
    const action = { type: 'test' }
    const next = jest.fn()
    const store = { getState: jest.fn() }
    middleware(store)(next)(action)
    expect(next).toBeCalledWith(action)
    expect(store.getState).not.toBeCalled()
  })

  it('should replace the window location if Unauthorized fetch fail in production', () => {
    const action = { type: 'test_FETCH_FAIL', error: 'Unauthorized' }
    const store = {
      getState: () => ({
        environment: {
          environment: 'production',
        },
      }),
    }
    window.location.replace = jest.fn()
    middleware(store)(() => {})(action)
    expect(window.location.replace).toBeCalledWith(
      logoutUrl({
        production: true,
      }),
    )
  })

  it('should replace the window location if Unauthorized fetch fail in production', () => {
    const action = { type: 'test_FETCH_FAIL', error: 'Unauthorized' }
    const store = {
      getState: () => ({
        environment: {
          environment: 'development',
        },
      }),
    }
    window.location.replace = jest.fn()
    middleware(store)(() => {})(action)
    expect(window.location.replace).toBeCalledWith(
      logoutUrl({
        production: false,
      }),
    )
  })
})
