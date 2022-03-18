import React from 'react' 
import ReactDOM from 'react-dom' 
import './index.css' 
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.rtl.min.css"
import App from './App' 
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, split } from "@apollo/client" 
import { getMainDefinition } from "@apollo/client/utilities" 
import { setContext } from "apollo-link-context" 
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css" 
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', 
  credentials: 'same-origin'
}) 

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    authToken: localStorage.getItem('token'),
  },
}));

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token') 
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
}) 

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query) 
    return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription') 
  },
  wsLink,
  authLink.concat(httpLink)
) 

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
}) 

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
) 
