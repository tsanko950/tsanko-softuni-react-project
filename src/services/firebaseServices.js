import { initializeApp } from 'firebase/app';
import { collection, getFirestore, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};

console.log(firebaseConfig)

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  
  export const addMovie = async (movieData) => {
    try {
      const docRef = await addDoc(collection(db, 'movies'), movieData);
      console.log('Movie added successfully with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };
  
  
  export const getAllMovies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const movies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      console.log('All movies:', movies);
      
      return movies;
    } catch (error) {
      console.error('Error getting movies:', error);
      return [];
    }
  };


  export const getMovieById = async (movieId) => {
    try {
      const movieDoc = doc(db, 'movies', movieId);
      const docSnap = await getDoc(movieDoc);
  
      if (docSnap.exists()) {
        const movieData = docSnap.data();
        return movieData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting movie by ID:', error);
      throw error;
    }
  };
  
  
  export const updateMovie = async (id, nuevaInformacion) => {
    try {
      await db.collection('movies').doc(id).update(nuevaInformacion);
      console.log('Película actualizada con éxito');
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };
  
  
  export const removeMovie = async (id) => {
    try {
      await db.collection('movies').doc(id).delete();
      console.log('Movie deleted succesfuly');
    } catch (error) {
      console.error('Error deleting movies:', error);
    }
  };
  


  export const getAllGenres = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'genres'));
      const genres = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return genres;
    } catch (error) {
      console.error('Error getting genres:', error);
      return [];
    }
  };





  export const registerUser = async (email, password, username) => {
    try {
      const auth = getAuth();
      
      // Crear el usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Obtener el ID del usuario registrado
      const userId = userCredential.user.uid;
  
      // Guardar información adicional en Firestore
      const usersCollection = collection(db, 'users');
      const result = await addDoc(usersCollection, { userId, email, username, isAdmin: false });
      var objResult = {};
      objResult.accessToken = userCredential._tokenResponse.idToken;
      objResult.email = email;
      objResult.username = username;
      return objResult;
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password); // auth, 
      const user = userCredential.user;
      return user;
    } catch (error) {
      throw error;
    }
  };