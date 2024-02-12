import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Form, FormGroup, Row } from 'reactstrap';
import Helmet from '../components/Helmet/helmet';

import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase.config";
import '../styles/login.css';


const Signup = () => {
  const[username,setUsername] = useState('')
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[file,setFile] = useState(null)
  const[loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const signup = async(e)=> {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      const storageRef = ref(storage,`images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
      (snapshot) => {
        // Optional: Handle upload progress
      },
        (error)=>{
        toast.error(error.message);
        setLoading(false);
      },
        
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL)=>{
            //update user profile
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadURL,
            });
            //store user data in firestore
            await setDoc(doc(db, "users", user.uid),{
              uid: user.uid,
              displayName: username,
              email,
              photoURL:downloadURL,
            });
            //toast.error("Document written with ID: ", username);
            //console.log("Document written with ID: ", docRef.id);
          })
        })
      setLoading(false)
      toast.success('Created Account')
      navigate('/login')
    } catch (error) {
      setLoading(false)
      toast.error('something went wrong')
      
    }
  }
  

  return (
    <Helmet  title='Signup'>
      <section>
        <Container>
          <Row>
            {
              loading? (<Col lg='12' className="text-center"><h5 className="fw-bold">Loading':/|\' </h5>
              </Col>
              ):(
              <Col lg='6' className='m-auto text-center'>
                <h3 className='fw-bold mb-4'>Signup</h3>
                <Form className='auth__form' onSubmit={signup}>
                  <FormGroup className='form__group'>
                    <input type="text" placeholder='Username'
                      value={username} onChange={e => setUsername(e.target.value)}/>
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input type="email" placeholder='Enter your email'
                      value={email} onChange={e => setEmail(e.target.value)}/>
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input type="password" placeholder='Enter your password'
                      value={password} onChange={e => setPassword(e.target.value)} />
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input type="file" onChange={e => setFile(e.target.files[0])} />
                  </FormGroup>
                <button type='submit' className="buy__btn auth__btn">Signup</button>
                <p>Already have an account?{' '} <Link to='/login'>Login</Link></p>
                </Form>
              </Col>)
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Signup