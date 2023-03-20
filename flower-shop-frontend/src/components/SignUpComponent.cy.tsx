import React from 'react'
import SignUpComponent from './SignUpComponent'

describe('<SignUpComponent />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SignUpComponent />)
  })
})