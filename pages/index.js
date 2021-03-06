import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import axios from 'axios';

import { useState, useEffect, useRef } from 'react';
import { authenticateToken } from '../middleware/tokenAuthenticate';

export default function Home() {
  const [user, setUser] = useState({})

  useEffect(() => {

    const getCurrentUser = () => {
      axios.get('/api/user/current')
        .then((response) => { 
          const {data: {user}} = response;
  
          if (user._id) { //user is logged in
            
            localStorage.setItem('token', user.accessToken);
            sessionStorage.setItem('refreshToken', user.refreshToken);
            setUser(user)
  
          } else { //user is not logged in
            checkToken();
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('/api/user/token', {
          headers: {
            'Authorization': "Bearer " + token
          }
        })
          .then(response => {
            const {data: {user, msg}} = response;
            if (msg == 'invalid token') {
              const refreshToken = sessionStorage.getItem('refreshToken');
              
              axios.post('/api/user/token', {token: refreshToken})
                .then(response => {
                  console.log(response)
                })
            } else if (user) {
              setUser(user)
            }
          })
      }
    }

    getCurrentUser();
    
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <ul>
          <li className="accountMsg">{user.name || 'Please Log in'}</li>
        </ul>
      </nav>

      <form action="/api/user/login" method="post">
        <input type="email" name="email" autoComplete="on" placeholder="Email"/>
        <input type="password" name="password" autoComplete="on" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
