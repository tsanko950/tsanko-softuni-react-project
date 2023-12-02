import { initializeApp } from 'firebase/app';
import { collection, getFirestore, where, query, doc, setDoc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};



  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  const functions = getFunctions(app);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
      // Obtener el ID del usuario registrado
      const userId = userCredential.user.uid;
  
      // Guardar información adicional en Firestore
      //const usersCollection = collection(db, 'users');
      //const result = await addDoc(usersCollection, { userId, email, username, isAdmin: false });
      const result = await setDoc(doc(db, "users", userId), {
        email: email.trim(),
        isAdmin: false,
        userId: userId,
        username: username
      });

      
      
      var objResult = {};
      objResult.accessToken = userCredential._tokenResponse.idToken;
      objResult.email = email.trim();
      objResult.username = username;
      objResult.isAdmin = false;
      objResult.uid = userId;
      console.log(objResult);
      return objResult;
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const auth = getAuth();
  
      // Iniciar sesión con email y contraseña
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      var objResult = {};
      objResult.accessToken = userCredential.user.accessToken;
      objResult.email = userCredential.user.email;
      
      const userInfo = await getUserByID(userCredential.user.uid)
      
      objResult.username = userInfo.username;
      objResult.isAdmin = userInfo.isAdmin;
      objResult.uid = userCredential.user.uid;
      
      console.log(objResult);
      return objResult;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  };

  export const logoutUser = async () => {
    try {
      const auth = getAuth();
  
      await signOut(auth);
  
      // Limpiar el localStorage u otras tareas necesarias
      localStorage.removeItem("auth");
      localStorage.removeItem("accesToken");
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  };

  export const getUserByID = async (userIdToSearch) => {

/*
    const usersCollection = collection(db, 'users');
    console.log(usersCollection)
    const query = usersCollection.Where('userId', '==', userIdToSearch);
  */
    try {
      //const q = query(collection(db, "users"), where("userId", "==", userIdToSearch));
      //const querySnapshot = await getDoc(q);

      const docUserRef = doc(db, "users", userIdToSearch);
      const docUser = await getDoc(docUserRef);

      if (docUser.exists()) {
        return docUser.data();
      } else {
        return null;
      }

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  };