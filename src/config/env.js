import path from 'path'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: path.join(__dirname, '../../.env.development')
  })
} else {
  dotenv.config({
    path: path.join(__dirname, '../../.env.production')
  })
  console.log('::: Require process.env.NODE_ENV setup :::')
  // throw new Error('::: Require process.env.NODE_ENV setup :::')
}
