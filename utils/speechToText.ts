export class SpeechToText {
  private recognition: SpeechRecognition | null = null
  private isListening: boolean = false
  private onResultCallback: ((text: string) => void) | null = null
  private onErrorCallback: ((error: string) => void) | null = null

  constructor() {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'fr-FR'

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        if (this.onResultCallback) {
          this.onResultCallback(text)
        }
      }

      this.recognition.onerror = (event: any) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error)
        }
      }
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('La reconnaissance vocale n\'est pas supportée par votre navigateur')
      return
    }

    this.onResultCallback = onResult
    this.onErrorCallback = onError
    this.isListening = true
    this.recognition.start()
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isSupported(): boolean {
    return !!this.recognition
  }
} 