import { initializeApp } from 'firebase/app';
import { collection, getFirestore, Timestamp, updateDoc, doc, setDoc, getDoc, where, query, getDocs, addDoc } from "firebase/firestore";
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
  
  /* MOVIES */
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
  
  
  export const updateMovie = async (id, newMovieData) => {
    try {
      await updateDoc(doc(db, "movies", id), newMovieData);
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
  

  /* GENRES */
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




/* USERS */
  export const registerUser = async (email, password, username) => {
    try {
      const auth = getAuth();
      
      // Crear el usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
      // Obtener el ID del usuario registrado
      const userId = userCredential.user.uid;
  
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
  
      localStorage.removeItem("auth");
      localStorage.removeItem("accesToken");
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  };

  export const getUserByID = async (userIdToSearch) => {

    try {
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



  /* COMMENTS */
  export const getAllCommentsByMovie = async (movieId) => {
    try {
      const q = query(collection(db, "comments"), where("movie", "==", movieId));

      const querySnapshot = await getDocs(q);
      let comments = [];
      querySnapshot.forEach((doc) => {
        let comment = doc.data();
        comment.id = doc.id;
        comments.push(comment);
        console.log(doc.id, " => ", doc.data());
      });
      return comments;
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  };

  export const addComment = async (movieId, comment) => {
    try {
      
      const userData = JSON.parse(localStorage.getItem("auth"));
  
      var commentObj = {};
      commentObj.comment = comment;
      commentObj.creatorUsername = userData.username;
      commentObj.creator = userData.uid;
      commentObj.movie = movieId;
      commentObj.negativeVotes = 0;
      commentObj.positiveVotes = 0;
      commentObj.datetime = Timestamp.fromDate(new Date());

      const docRef = await addDoc(collection(db, 'comments'), commentObj);
      commentObj.id = docRef.id;
      return commentObj;
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };