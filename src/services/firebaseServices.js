import { initializeApp } from 'firebase/app';
import { collection, getFirestore, Timestamp, updateDoc, doc, deleteDoc, setDoc, getDoc, where, query, startAt, endAt, orderBy, getDocs, addDoc } from "firebase/firestore";
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
      
      return movies;
    } catch (error) {
      console.error('Error getting movies:', error);
      return [];
    }
  };

  export const getMoviesByGenre = async (genres) => {
    try {
      const moviesQuery = query(collection(db, 'movies'), where('genre', 'array-contains-any', genres));
      const querySnapshot = await getDocs(moviesQuery);
      const movies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const similarMovies = [];
      const addedMovieIds = new Set();
      movies.forEach((movie) => {
        if (!addedMovieIds.has(movie.id)) {
          similarMovies.push(movie);
          addedMovieIds.add(movie.id);
        }
      });

      
      return similarMovies;
    } catch (error) {
      console.error('Error getting movies by genre:', error);
      return [];
    }
  };


  export const getMovieById = async (movieId) => {
    try {
      const movieDoc = await doc(db, 'movies', movieId);
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


  export const searchMovies = async (title) => {
    try {
      const moviesQuery = query(
        collection(db, 'movies'),
        orderBy('title'),
        startAt(title.toLowerCase()),
        endAt(title.toLowerCase() + '\uf8ff'),
        startAt(title.toUpperCase()),
        endAt(title.toUpperCase() + '\uf8ff'),
        startAt(title.charAt(0).toUpperCase() + title.slice(1)),
        endAt(title.charAt(0).toUpperCase() + title.slice(1) + '\uf8ff')
      );

      const querySnapshot = await getDocs(moviesQuery);
      const movies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      return movies;
    } catch (error) {
      console.error(`Error searching movies by title "${title}":`, error);
      return [];
    }
  };
  
  
  export const updateMovie = async (id, newMovieData) => {
    try {
      await updateDoc(doc(db, "movies", id), newMovieData);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };
  
  
  export const removeMovie = async (id) => {
    try {
      const r = await deleteDoc(doc(db, "movies", id));
      return true;
    } catch (error) {
      return false;
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
      
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
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
      return objResult;
    } catch (error) {
      return error.code;
    }
  };
  
  export const loginUser = async (email, password) => {
    try {
      const auth = getAuth();
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      var objResult = {};
      objResult.accessToken = userCredential.user.accessToken;
      objResult.email = userCredential.user.email;
      
      const userInfo = await getUserByID(userCredential.user.uid)
      
      objResult.username = userInfo.username;
      objResult.isAdmin = userInfo.isAdmin;
      objResult.uid = userCredential.user.uid;
      
      return objResult;
    } catch (error) {
      console.error(error.code);
      return error.code;
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
 // EDIT COMMENT
  export const updateComment = async (id, newCommentData) => {
    try {
      await updateDoc(doc(db, "comments", id), {
        comment: newCommentData
      });
     
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  export const removeComment = async (id) => {
    try {
      await deleteDoc(doc(db, "comments", id));
    } catch (error) {
      console.error('Error getting comments:', error);
    }
  };