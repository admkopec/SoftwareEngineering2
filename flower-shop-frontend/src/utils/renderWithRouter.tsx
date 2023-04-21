import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import userEvent from '@testing-library/user-event'

export const renderWithRouter = (ui : JSX.Element, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent,
    ...render(ui, {wrapper: BrowserRouter}),
  }
}