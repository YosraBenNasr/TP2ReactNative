import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';

// Redux imports pour l'atelier RN8
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// ==========================================
// REDUX SETUP (Atelier RN8)
// ==========================================
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value = Math.max(0, state.value - 1); },
    reset: (state) => { state.value = 0; },
    addFive: (state) => { state.value += 5; },
    multiplyTwo: (state) => { state.value *= 2; },
  },
});

const { increment, decrement, reset, addFive, multiplyTwo } = counterSlice.actions;

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// ==========================================
// COMPOSANT RN5 : Component Enfant (Heading)
// ==========================================
class Heading extends Component {
  render() {
    return <Text style={styles.heading}>{this.props.message}</Text>;
  }
}

// ==========================================
// COMPOSANT RN7 : Compteur avec Hooks (Fonctionnel)
// ==========================================
function CompteurHooksChild({ valeur }) {
  return (
    <View>
      <Text style={styles.nombre}>Compteur Hooks : {valeur}</Text>
      {valeur >= 10 && <Text style={styles.warning}>Seuil atteint (Valeur élevée)</Text>}
    </View>
  );
}

function EcranRN7Hooks() {
  const [compteur, setCompteur] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [actif, setActif] = useState(false);

  useEffect(() => {
    if (!actif) return;
    const id = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [actif]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atelier RN7 : Hooks</Text>
      <CompteurHooksChild valeur={compteur} />
      <Button title="+1" onPress={() => setCompteur((c) => c + 1)} color="#4CAF50" />
      <View style={{ height: 8 }} />
      <Button title="-1" onPress={() => setCompteur((c) => Math.max(0, c - 1))} color="#E53935" />
      <View style={{ height: 8 }} />
      <Button title="Reset compteur" onPress={() => setCompteur(0)} color="#757575" />

      <Text style={styles.texteChrono}>Chronomètre : {secondes} s</Text>
      <Button title={actif ? 'Pause Chrono' : 'Démarrer Chrono'} onPress={() => setActif((a) => !a)} color="#1F4E78" />
      <View style={{ height: 8 }} />
      <Button title="Remise à zéro chrono" onPress={() => setSecondes(0)} color="#9E9E9E" />
    </View>
  );
}

// ==========================================
// COMPOSANT RN8 : Redux Toolkit
// ==========================================
function CompteurAffiche() {
  const valeur = useSelector((state) => state.counter.value);
  return <Text style={styles.nombre}>Valeur Redux : {valeur}</Text>;
}

function StatutCompteur() {
  const valeur = useSelector((state) => state.counter.value);
  return (
    <Text style={styles.statut}>
      {valeur === 0 ? 'compteur nul' : 'compteur actif'}
    </Text>
  );
}

function CommandesCompteurRedux() {
  const dispatch = useDispatch();
  return (
    <View style={styles.commandes}>
      <Button title="+1" onPress={() => dispatch(increment())} color="#4CAF50" />
      <View style={{ height: 6 }} />
      <Button title="-1" onPress={() => dispatch(decrement())} color="#E53935" />
      <View style={{ height: 6 }} />
      <Button title="+5" onPress={() => dispatch(addFive())} color="#FF9800" />
      <View style={{ height: 6 }} />
      <Button title="x2" onPress={() => dispatch(multiplyTwo())} color="#9C27B0" />
      <View style={{ height: 6 }} />
      <Button title="Reset" onPress={() => dispatch(reset())} color="#757575" />
    </View>
  );
}

function EcranRN8Redux() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atelier RN8 : Redux</Text>
      <CompteurAffiche />
      <CompteurAffiche />
      <StatutCompteur />
      <CommandesCompteurRedux />
    </View>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL (App)
// ==========================================
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Gestion de la navigation ('Home', 'RN1'...'RN6', 'RN7', 'RN8')
      currentScreen: 'Home',

      // State Exercice RN3 (Compteur Class)
      counter: 0,

      // State Exercice RN4 (TextInput)
      input: '',

      // State Exercice RN6 (Géolocalisation)
      latitude: null,
      longitude: null,
      geoMessage: 'Position non demandée',
    };
  }

  // ------------------------------------------
  // Méthodes pour l'Exercice RN2 (Alert)
  // ------------------------------------------
  testFunction = () => {
    Alert.alert('Interaction', 'Button Pressed !!!');
  };

  cancelFunction = () => {
    Alert.alert('Action', 'Opération annulée');
  };

  // ------------------------------------------
  // Méthodes pour l'Exercice RN3 (Compteur)
  // ------------------------------------------
  incrementCount = () => {
    this.setState((previous) => ({ counter: previous.counter + 1 }));
  };

  decrementCount = () => {
    this.setState((previous) => ({
      counter: previous.counter > 0 ? previous.counter - 1 : 0,
    }));
  };

  resetCount = () => {
    this.setState({ counter: 0 });
  };

  // ------------------------------------------
  // Méthodes pour l'Exercice RN4 (TextInput)
  // ------------------------------------------
  handleChangeInput = (text) => {
    this.setState({ input: text });
  };

  showInput = () => {
    Alert.alert('Texte saisi', this.state.input || 'Aucune valeur');
  };

  // ------------------------------------------
  // Méthodes pour l'Exercice RN6 (GPS)
  // ------------------------------------------
  getPosition = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      this.setState({ geoMessage: 'Permission de localisation refusée' });
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      geoMessage: 'Position obtenue',
    });
  };

  // ------------------------------------------
  // NAVIGATION (Retour à l'accueil)
  // ------------------------------------------
  navigateTo = (screenName) => {
    this.setState({ currentScreen: screenName });
  };

  renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => this.navigateTo('Home')}
    >
      <Text style={styles.backButtonText}>← Retour au Menu Principal</Text>
    </TouchableOpacity>
  );

  // ------------------------------------------
  // RENDU DES ÉCRANS
  // ------------------------------------------
  renderScreen = () => {
    switch (this.state.currentScreen) {
      // ---------------- MENU PRINCIPAL ----------------
      case 'Home':
        return (
          <ScrollView contentContainerStyle={styles.menuContainer}>
            <Text style={styles.mainTitle}>TP React Native - Expo</Text>
            <Text style={styles.subtitle}>Sélectionnez un exercice ou atelier :</Text>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN1')}>
              <Text style={styles.menuBtnText}>Exercice RN1 : Hello World & Style</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN2')}>
              <Text style={styles.menuBtnText}>Exercice RN2 : Boutons & Alerte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN3')}>
              <Text style={styles.menuBtnText}>Exercice RN3 : Compteur & State</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN4')}>
              <Text style={styles.menuBtnText}>Exercice RN4 : Saisie TextInput</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN5')}>
              <Text style={styles.menuBtnText}>Exercice RN5 : Communication Props</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => this.navigateTo('RN6')}>
              <Text style={styles.menuBtnText}>Exercice RN6 : Géolocalisation GPS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuBtn, styles.advancedBtn]} onPress={() => this.navigateTo('RN7')}>
              <Text style={styles.menuBtnText}>Atelier RN7 : Hooks (useState / useEffect)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuBtn, styles.advancedBtn]} onPress={() => this.navigateTo('RN8')}>
              <Text style={styles.menuBtnText}>Atelier RN8 : Redux Toolkit (Flux)</Text>
            </TouchableOpacity>
          </ScrollView>
        );

      // ---------------- EXERCICE RN1 ----------------
      case 'RN1':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Text style={styles.title}>Yosra Ben Nasr - Groupe 03</Text>
            <Text style={styles.date}>Date du TP : 24/10/2026</Text>
          </View>
        );

      // ---------------- EXERCICE RN2 ----------------
      case 'RN2':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Button onPress={this.testFunction} title="Test Button" color="#009688" />
            <View style={{ height: 12 }} />
            <Button onPress={this.cancelFunction} title="Annuler" color="#D32F2F" />
          </View>
        );

      // ---------------- EXERCICE RN3 ----------------
      case 'RN3':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Text style={styles.counter}>Count: {this.state.counter}</Text>
            {this.state.counter >= 10 && (
              <Text style={styles.warning}>Valeur élevée</Text>
            )}
            <Button onPress={this.decrementCount} title="-" color="#E53935" />
            <View style={{ height: 8 }} />
            <Button onPress={this.incrementCount} title="+" color="#4CAF50" />
            <View style={{ height: 8 }} />
            <Button onPress={this.resetCount} title="Remettre à zéro" color="#757575" />
          </View>
        );

      // ---------------- EXERCICE RN4 ----------------
      case 'RN4':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Text>Saisir un texte :</Text>
            <TextInput
              style={styles.input}
              onChangeText={this.handleChangeInput}
              value={this.state.input}
              placeholder="Votre texte ici"
            />
            <Button onPress={this.showInput} title="OK" color="#1F4E78" />
          </View>
        );

      // ---------------- EXERCICE RN5 ----------------
      case 'RN5':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Heading message="Titre reçu du composant parent" />
            <Heading message="Deuxième utilisation du même composant" />
          </View>
        );

      // ---------------- EXERCICE RN6 ----------------
      case 'RN6':
        return (
          <View style={styles.container}>
            {this.renderBackButton()}
            <Button title="Obtenir ma position" onPress={this.getPosition} color="#1565C0" />
            <Text style={styles.info}>{this.state.geoMessage}</Text>
            <Text>Latitude : {this.state.latitude ?? '--'}</Text>
            <Text>Longitude : {this.state.longitude ?? '--'}</Text>
          </View>
        );

      // ---------------- ATELIER RN7 ----------------
      case 'RN7':
        return (
          <View style={{ flex: 1 }}>
            {this.renderBackButton()}
            <EcranRN7Hooks />
          </View>
        );

      // ---------------- ATELIER RN8 ----------------
      case 'RN8':
        return (
          <Provider store={store}>
            <View style={{ flex: 1 }}>
              {this.renderBackButton()}
              <EcranRN8Redux />
            </View>
          </Provider>
        );

      default:
        return null;
    }
  };

  render() {
    return <View style={styles.screenWrapper}>{this.renderScreen()}</View>;
  }
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  menuContainer: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'stretch',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F4E78',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  menuBtn: {
    backgroundColor: '#1F4E78',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 2,
  },
  advancedBtn: {
    backgroundColor: '#2E7D32', // Couleur différente pour distinguer les ateliers avancés RN7 et RN8
  },
  menuBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  counter: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  warning: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 46,
    borderColor: '#1F4E78',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginVertical: 14,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  info: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  nombre: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  texteChrono: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 14,
    fontWeight: '600',
  },
  statut: {
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  commandes: {
    marginTop: 10,
  },
});