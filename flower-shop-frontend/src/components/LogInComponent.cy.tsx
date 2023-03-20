import React from 'react'
import LogInComponent from './LogInComponent'

describe('<LogInComponent />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LogInComponent />)
  })
})