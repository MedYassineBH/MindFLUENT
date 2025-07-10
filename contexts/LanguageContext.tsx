'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

type Language = 'fr' | 'en' | 'es' | 'de' | 'it';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    lessons: 'Leçons',
    practice: 'Pratique',
    chat: 'Discussion',
    profile: 'Profil',
    pronunciation: 'Prononciation',
    grammar: 'Grammaire',
    
    // Common
    title: 'Titre',
    description: 'Description',
    create: 'Créer',
    creating: 'Création en cours...',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    
    // Language names
    french: 'Français',
    english: 'Anglais',
    spanish: 'Espagnol',
    german: 'Allemand',
    
    // Grammar section
    grammarTitle: 'Exercices de grammaire',
    grammarDescription: 'Améliorez votre maîtrise de la grammaire avec des exercices interactifs',
    basicGrammarDescription: 'Apprenez les bases de la grammaire française',
    intermediateGrammarDescription: 'Perfectionnez vos connaissances grammaticales',
    advancedGrammarDescription: 'Maîtrisez les aspects complexes de la grammaire',
    basicVowelsDescription: 'Apprenez à prononcer les voyelles de base',
    basicConsonantsDescription: 'Maîtrisez les consonnes essentielles',
    specialConsonantsDescription: 'Découvrez les sons spéciaux du français',
    stressDescription: 'Apprenez à placer l\'accent correctement',
    rhythmDescription: 'Maîtrisez le rythme de la langue',
    melodyDescription: 'Perfectionnez votre intonation',
    startLearning: 'Commencer à apprendre',
    startPracticing: 'Commencer à pratiquer',
    all: 'Tout',
    basic: 'Base',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    sounds: 'Sons',
    loading: 'Chargement...',
    verbConjugation: 'Conjugaison des verbes',
    articles: 'Articles',
    articlesDescription: 'Maîtrisez l\'utilisation des articles définis, indéfinis et partitifs',
    presentTense: 'Présent de l\'indicatif',
    presentTenseDescription: 'Conjuguez les verbes au présent et formez des phrases simples',
    adjectives: 'Adjectifs',
    adjectivesDescription: 'Apprenez à accorder les adjectifs en genre et en nombre',
    pastTense: 'Passé composé et imparfait',
    pastTenseDescription: 'Distinguez et utilisez les temps du passé',
    pronouns: 'Pronoms',
    pronounsDescription: 'Utilisez correctement les pronoms personnels, relatifs et démonstratifs',
    adverbs: 'Adverbes',
    adverbsDescription: 'Formez et placez correctement les adverbes',
    subjunctive: 'Subjonctif',
    subjunctiveDescription: 'Maîtrisez l\'utilisation du mode subjonctif',
    conditionals: 'Conditionnel',
    conditionalsDescription: 'Exprimez des hypothèses et des souhaits',
    literaryTenses: 'Temps littéraires',
    literaryTensesDescription: 'Découvrez les temps utilisés dans la littérature',
    nextExercise: 'Exercice suivant',
    finish: 'Terminer',
    
    // Pronunciation section
    pronunciationTitle: 'Exercices de prononciation',
    pronunciationDescription: 'Perfectionnez votre accent et votre prononciation',
    pronunciationExercise: 'Exercice de prononciation',
    listenAndRepeat: 'Écoutez et répétez',
    recordYourVoice: 'Enregistrez votre voix',
    compareWithNative: 'Comparez avec un natif',
    excellent: 'Excellent',
    good: 'Bien',
    needsPractice: 'À pratiquer',
    tryAgain: 'Réessayez',
    
    // Flashcards section
    flashcardsTitle: 'Cartes mémoire',
    flashcardsDescription: 'Apprenez et révisez le vocabulaire efficacement',
    createDeck: 'Créer un paquet',
    reviewDeck: 'Réviser un paquet',
    dailyReview: 'Révision quotidienne',
    vocabularyTitle: 'Vocabulaire',
    study: 'Étudier',
    review: 'Réviser',
    progress: 'Progression',
    mastered: 'Maîtrisé',
    backToDecks: 'Retour aux paquets',
    rateConfidence: 'Comment connaissez-vous cette carte ?',
    basicVocabularyDeck: 'Vocabulaire de base',
    basicVocabularyDescription: 'Mots et phrases essentiels pour débutants',
    commonPhrasesDeck: 'Phrases courantes',
    commonPhrasesDescription: 'Expressions et conversations quotidiennes',
    confirmDeleteDeck: 'Êtes-vous sûr de vouloir supprimer ce paquet ?',
    deckCreated: 'Paquet créé avec succès',
    deckUpdated: 'Paquet mis à jour avec succès',
    deckDeleted: 'Paquet supprimé avec succès',
    failedToCreateDeck: 'Échec de la création du paquet',
    failedToUpdateDeck: 'Échec de la mise à jour du paquet',
    failedToDeleteDeck: 'Échec de la suppression du paquet',
    failedToLoadDecks: 'Échec du chargement des paquets',
    deckTitlePlaceholder: 'Entrez le titre du paquet',
    deckDescriptionPlaceholder: 'Entrez une description pour ce paquet',
    cardCount: 'Nombre de cartes',
    lastReviewed: 'Dernière révision',
    reviewNow: 'Réviser maintenant',
    addCard: 'Ajouter une carte',
    editCard: 'Modifier la carte',
    deleteCard: 'Supprimer la carte',
    frontSide: 'Recto',
    backSide: 'Verso',
    difficulty: 'Difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    
    // Settings
    preferences: 'Préférences',
    languageSettings: 'Paramètres de langue',
    interfaceLanguage: 'Langue de l\'interface',
    selectLanguage: 'Sélectionnez une langue',
    appearance: 'Apparence',
    theme: 'Thème',
    themeDescription: 'Choisissez entre le thème clair et sombre',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    notifications: 'Notifications',
    enableNotifications: 'Activer les notifications',
    notificationsDescription: 'Recevez des notifications sur votre progression',
    
    // Error messages
    failedToUpdateSettings: 'Échec de la mise à jour des paramètres',
    settingsUpdated: 'Paramètres mis à jour avec succès',
    failedToSaveMessage: 'Échec de l\'enregistrement du message',
    anErrorOccurred: 'Une erreur est survenue',
    error: 'Erreur',
    retrying: 'Nouvelle tentative',
    failedToSendMessage: 'Échec de l\'envoi du message après plusieurs tentatives. Veuillez réessayer plus tard.',
  },
  en: {
    // Navigation
    home: 'Home',
    lessons: 'Lessons',
    practice: 'Practice',
    chat: 'Chat',
    profile: 'Profile',
    pronunciation: 'Pronunciation',
    grammar: 'Grammar',
    
    // Common
    title: 'Title',
    description: 'Description',
    create: 'Create',
    creating: 'Creating...',
    save: 'Save',
    saving: 'Saving...',
    
    // Language names
    french: 'French',
    english: 'English',
    spanish: 'Spanish',
    german: 'German',
    
    // Grammar section
    grammarTitle: 'Grammar Exercises',
    grammarDescription: 'Improve your grammar mastery with interactive exercises',
    basicGrammarDescription: 'Learn the basics of French grammar',
    intermediateGrammarDescription: 'Perfect your grammar knowledge',
    advancedGrammarDescription: 'Master complex aspects of grammar',
    basicVowelsDescription: 'Learn to pronounce basic vowels',
    basicConsonantsDescription: 'Master essential consonants',
    specialConsonantsDescription: 'Discover special French sounds',
    stressDescription: 'Learn proper word stress',
    rhythmDescription: 'Master language rhythm',
    melodyDescription: 'Perfect your intonation',
    startLearning: 'Start Learning',
    startPracticing: 'Start Practicing',
    all: 'All',
    basic: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    sounds: 'Sounds',
    loading: 'Loading...',
    verbConjugation: 'Verb Conjugation',
    articles: 'Articles',
    articlesDescription: 'Master the use of definite, indefinite, and partitive articles',
    presentTense: 'Present Tense',
    presentTenseDescription: 'Conjugate verbs in present tense and form simple sentences',
    adjectives: 'Adjectives',
    adjectivesDescription: 'Learn to make adjectives agree in gender and number',
    pastTense: 'Past Tenses',
    pastTenseDescription: 'Distinguish and use past tenses',
    pronouns: 'Pronouns',
    pronounsDescription: 'Correctly use personal, relative, and demonstrative pronouns',
    adverbs: 'Adverbs',
    adverbsDescription: 'Form and place adverbs correctly',
    subjunctive: 'Subjunctive',
    subjunctiveDescription: 'Master the use of subjunctive mood',
    conditionals: 'Conditionals',
    conditionalsDescription: 'Express hypotheses and wishes',
    literaryTenses: 'Literary Tenses',
    literaryTensesDescription: 'Discover tenses used in literature',
    nextExercise: 'Next Exercise',
    finish: 'Finish',
    
    // Pronunciation section
    pronunciationTitle: 'Pronunciation Exercises',
    pronunciationDescription: 'Perfect your accent and pronunciation',
    pronunciationExercise: 'Pronunciation Exercise',
    listenAndRepeat: 'Listen and Repeat',
    recordYourVoice: 'Record Your Voice',
    compareWithNative: 'Compare with Native',
    excellent: 'Excellent',
    good: 'Good',
    needsPractice: 'Needs Practice',
    tryAgain: 'Try Again',
    
    // Flashcards section
    flashcardsTitle: 'Flashcards',
    flashcardsDescription: 'Learn and review vocabulary effectively',
    createDeck: 'Create Deck',
    reviewDeck: 'Review Deck',
    dailyReview: 'Daily Review',
    vocabularyTitle: 'Vocabulary',
    study: 'Study',
    review: 'Review',
    progress: 'Progress',
    mastered: 'Mastered',
    backToDecks: 'Back to Decks',
    rateConfidence: 'How well did you know this?',
    basicVocabularyDeck: 'Basic Vocabulary',
    basicVocabularyDescription: 'Essential words and phrases for beginners',
    commonPhrasesDeck: 'Common Phrases',
    commonPhrasesDescription: 'Everyday expressions and conversations',
    confirmDeleteDeck: 'Are you sure you want to delete this deck?',
    deckCreated: 'Deck created successfully',
    deckUpdated: 'Deck updated successfully',
    deckDeleted: 'Deck deleted successfully',
    failedToCreateDeck: 'Failed to create deck',
    failedToUpdateDeck: 'Failed to update deck',
    failedToDeleteDeck: 'Failed to delete deck',
    failedToLoadDecks: 'Failed to load decks',
    deckTitlePlaceholder: 'Enter deck title',
    deckDescriptionPlaceholder: 'Enter a description for this deck',
    cardCount: 'Card Count',
    lastReviewed: 'Last Reviewed',
    reviewNow: 'Review Now',
    addCard: 'Add Card',
    editCard: 'Edit Card',
    deleteCard: 'Delete Card',
    frontSide: 'Front Side',
    backSide: 'Back Side',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    
    // Settings
    preferences: 'Preferences',
    languageSettings: 'Language Settings',
    interfaceLanguage: 'Interface Language',
    selectLanguage: 'Select a language',
    appearance: 'Appearance',
    theme: 'Theme',
    themeDescription: 'Choose between light and dark theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    notificationsDescription: 'Receive notifications about your progress',
    
    // Error messages
    failedToUpdateSettings: 'Failed to update settings',
    settingsUpdated: 'Settings updated successfully',
    failedToSaveMessage: 'Failed to save message',
    anErrorOccurred: 'An error occurred',
    error: 'Error',
    retrying: 'Retrying',
    failedToSendMessage: 'Failed to send message after multiple attempts. Please try again later.',
  },
  es: {
    profile: 'Perfil',
    personalInfo: 'Información personal',
    username: 'Nombre de usuario',
    bio: 'Biografía',
    languageLevel: 'Nivel de idioma',
    dailyGoal: 'Objetivo diario (minutos)',
    cancel: 'Cancelar',
    logout: 'Cerrar sesión',
    preferences: 'Preferencias',
    languageSettings: 'Configuración de idioma',
    interfaceLanguage: 'Idioma de la interfaz',
    appearance: 'Apariencia',
    theme: 'Tema',
    themeDescription: 'Elige entre tema claro y oscuro',
    notifications: 'Notificaciones',
    enableNotifications: 'Activar notificaciones',
    notificationsDescription: 'Recibe notificaciones sobre tu progreso',
    // Grammar section
    basicVowels: 'Vocales básicas',
    compoundVowels: 'Vocales compuestas',
    nasalVowels: 'Vocales nasales',
    basicConsonants: 'Consonantes básicas',
    specialConsonants: 'Consonantes especiales',
    consonantCombinations: 'Combinaciones de consonantes',
    stress: 'Acentuación',
    rhythm: 'Ritmo',
    melody: 'Melodía',
    intonation: 'Entonación',
    // Pronunciation section
    pronunciationExercise: 'Ejercicio de pronunciación',
    listenAndRepeat: 'Escucha y repite',
    recordYourVoice: 'Graba tu voz',
    compareWithNative: 'Compara con nativo',
    excellent: 'Excelente',
    good: 'Bien',
    needsPractice: 'Necesita práctica',
    tryAgain: 'Inténtalo de nuevo',
    // Flashcards section
    flashcardsTitle: 'Tarjetas de memoria',
    createDeck: 'Crear mazo',
    study: 'Estudiar',
    review: 'Repasar',
    progress: 'Progreso',
    mastered: 'Dominado',
    backToDecks: 'Volver a mazos',
    rateConfidence: '¿Qué tan bien conocías esto?',
    basicVocabularyDeck: 'Vocabulario básico',
    basicVocabularyDescription: 'Palabras y frases esenciales para principiantes',
    commonPhrasesDeck: 'Frases comunes',
    commonPhrasesDescription: 'Expresiones y conversaciones cotidianas',
    createNewDeck: 'Crear nuevo mazo',
    editDeck: 'Editar mazo',
    deleteDeck: 'Eliminar mazo',
    cardCount: 'Número de tarjetas',
    lastReviewed: 'Última revisión',
    reviewNow: 'Revisar ahora',
    addCard: 'Añadir tarjeta',
    editCard: 'Editar tarjeta',
    deleteCard: 'Eliminar tarjeta',
    frontSide: 'Anverso',
    backSide: 'Reverso',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    // Flashcards management
    title: 'Título',
    description: 'Descripción',
    create: 'Crear',
    creating: 'Creando...',
    save: 'Guardar',
    saving: 'Guardando...',
    confirmDeleteDeck: '¿Estás seguro de que quieres eliminar este mazo?',
    deckCreated: 'Mazo creado con éxito',
    deckUpdated: 'Mazo actualizado con éxito',
    deckDeleted: 'Mazo eliminado con éxito',
    failedToCreateDeck: 'Error al crear el mazo',
    failedToUpdateDeck: 'Error al actualizar el mazo',
    failedToDeleteDeck: 'Error al eliminar el mazo',
    failedToLoadDecks: 'Error al cargar los mazos',
    deckTitlePlaceholder: 'Introduce el título del mazo',
    deckDescriptionPlaceholder: 'Introduce una descripción para este mazo',
  },
  de: {
    // Common actions and states
    create: 'Erstellen',
    creating: 'Wird erstellt...',
    save: 'Speichern',
    saving: 'Wird gespeichert...',
    
    // Profile and settings
    profile: 'Profil',
    personalInfo: 'Persönliche Informationen',
    username: 'Benutzername',
    bio: 'Biografie',
    languageLevel: 'Sprachniveau',
    dailyGoal: 'Tagesziel (Minuten)',
    cancel: 'Abbrechen',
    logout: 'Abmelden',
    preferences: 'Einstellungen',
    languageSettings: 'Spracheinstellungen',
    interfaceLanguage: 'Oberflächensprache',
    appearance: 'Erscheinungsbild',
    theme: 'Design',
    themeDescription: 'Wählen Sie zwischen hellem und dunklem Design',
    notifications: 'Benachrichtigungen',
    enableNotifications: 'Benachrichtigungen aktivieren',
    notificationsDescription: 'Erhalten Sie Benachrichtigungen über Ihren Fortschritt',
    
    // Grammar section
    basicVowels: 'Grundvokale',
    compoundVowels: 'Zusammengesetzte Vokale',
    nasalVowels: 'Nasalvokale',
    basicConsonants: 'Grundkonsonanten',
    specialConsonants: 'Spezielle Konsonanten',
    consonantCombinations: 'Konsonantenkombinationen',
    stress: 'Betonung',
    rhythm: 'Rhythmus',
    melody: 'Melodie',
    intonation: 'Intonation',
    
    // Pronunciation section
    pronunciationExercise: 'Ausspracheübung',
    listenAndRepeat: 'Hören und nachsprechen',
    recordYourVoice: 'Stimme aufnehmen',
    compareWithNative: 'Mit Muttersprachler vergleichen',
    excellent: 'Ausgezeichnet',
    good: 'Gut',
    needsPractice: 'Übung erforderlich',
    tryAgain: 'Erneut versuchen',
    
    // Flashcards section
    flashcardsTitle: 'Karteikarten',
    createDeck: 'Deck erstellen',
    study: 'Lernen',
    review: 'Wiederholen',
    progress: 'Fortschritt',
    mastered: 'Gemeistert',
    backToDecks: 'Zurück zu Decks',
    rateConfidence: 'Wie gut kanntest du das?',
    basicVocabularyDeck: 'Grundwortschatz',
    basicVocabularyDescription: 'Grundlegende Wörter und Sätze für Anfänger',
    commonPhrasesDeck: 'Häufige Redewendungen',
    commonPhrasesDescription: 'Alltägliche Ausdrücke und Gespräche',
    createNewDeck: 'Neues Deck erstellen',
    editDeck: 'Deck bearbeiten',
    deleteDeck: 'Deck löschen',
    cardCount: 'Kartenanzahl',
    lastReviewed: 'Zuletzt wiederholt',
    reviewNow: 'Jetzt wiederholen',
    addCard: 'Karte hinzufügen',
    editCard: 'Karte bearbeiten',
    deleteCard: 'Karte löschen',
    frontSide: 'Vorderseite',
    backSide: 'Rückseite',
    difficulty: 'Schwierigkeit',
    easy: 'Einfach',
    medium: 'Mittel',
    hard: 'Schwer',
    
    // Flashcards management
    title: 'Titel',
    description: 'Beschreibung',
    confirmDeleteDeck: 'Sind Sie sicher, dass Sie dieses Deck löschen möchten?',
    deckCreated: 'Deck erfolgreich erstellt',
    deckUpdated: 'Deck erfolgreich aktualisiert',
    deckDeleted: 'Deck erfolgreich gelöscht',
    failedToCreateDeck: 'Fehler beim Erstellen des Decks',
    failedToUpdateDeck: 'Fehler beim Aktualisieren des Decks',
    failedToDeleteDeck: 'Fehler beim Löschen des Decks',
    failedToLoadDecks: 'Fehler beim Laden der Decks',
    deckTitlePlaceholder: 'Deck-Titel eingeben',
    deckDescriptionPlaceholder: 'Beschreibung für dieses Deck eingeben',
  },
  it: {
    // Navigation
    home: 'Home',
    lessons: 'Lezioni',
    practice: 'Pratica',
    chat: 'Chat',
    profile: 'Profilo',
    pronunciation: 'Pronuncia',
    grammar: 'Grammatica',
    
    // Common
    title: 'Titolo',
    description: 'Descrizione',
    create: 'Crea',
    creating: 'Creazione in corso...',
    save: 'Salva',
    saving: 'Salvataggio...',
    
    // Language names
    french: 'Francese',
    english: 'Inglese',
    spanish: 'Spagnolo',
    german: 'Tedesco',
    italian: 'Italiano',
    
    // Add other Italian translations as needed...
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (user) {
        // First try to get language from user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_language')
          .eq('id', user.id)
          .single();

        if (profile?.preferred_language) {
          setLanguage(profile.preferred_language as Language);
          localStorage.setItem('language', profile.preferred_language);
          return;
        }
      }

      // Fallback to localStorage
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };

    loadLanguagePreference();
  }, [user]);

  const handleSetLanguage = async (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);

    // Update user profile if logged in
    if (user) {
      await supabase
        .from('profiles')
        .update({ preferred_language: lang })
        .eq('id', user.id);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 